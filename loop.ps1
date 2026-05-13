#!/usr/bin/env pwsh
# Ralph Wiggum Loop -- GitHub Copilot CLI + OpenSpec
#
# Requirements:
#   winget install GitHub.Copilot
#   npm install -g @fission-ai/openspec@latest
#
# Usage:
#   .\loop.ps1              # unlimited (Ctrl+C to stop)
#   .\loop.ps1 10           # max 10 iterations
#   .\loop.ps1 0 5          # unlimited, max 5 check retries per task

param(
    [int]$MaxIterations = 0,
    [int]$MaxRetries = 3
)

function Get-NextTask {
    $taskFiles = Get-ChildItem -Path "openspec/changes" -Filter "tasks.md" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\archive\\" }
    foreach ($file in $taskFiles) {
        $next = Get-Content $file.FullName | Where-Object { $_ -match '^\s*-\s+\[ \]' } | Select-Object -First 1
        if ($next) { return @{ Task = $next.Trim(); File = $file.FullName } }
    }
    return $null
}

function Get-PendingCount {
    $count = 0
    Get-ChildItem -Path "openspec/changes" -Filter "tasks.md" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\archive\\" } |
        ForEach-Object { $count += (Get-Content $_.FullName | Where-Object { $_ -match '^\s*-\s+\[ \]' }).Count }
    return $count
}

function Show-SpecProgress($tasksFile) {
    $lines = Get-Content $tasksFile -ErrorAction SilentlyContinue
    if (-not $lines) { return }
    $currentSpec = "General"; $done = 0; $total = 0
    foreach ($line in $lines) {
        if ($line -match '^##\s+(.+)') {
            if ($total -gt 0) {
                $pct = [int](($done / $total) * 100)
                $bar = "#" * [int]($pct / 10) + "-" * (10 - [int]($pct / 10))
                Write-Host "  [$bar] $done/$total  $currentSpec" -ForegroundColor White
            }
            $currentSpec = $Matches[1]; $done = 0; $total = 0
        }
        if ($line -match '^\s*-\s+\[x\]') { $done++; $total++ }
        if ($line -match '^\s*-\s+\[ \]') { $total++ }
    }
    if ($total -gt 0) {
        $pct = [int](($done / $total) * 100)
        $bar = "#" * [int]($pct / 10) + "-" * (10 - [int]($pct / 10))
        Write-Host "  [$bar] $done/$total  $currentSpec" -ForegroundColor White
    }
}

function Assert-SpecHeaders {
    $taskFiles = Get-ChildItem -Path "openspec/changes" -Filter "tasks.md" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\archive\\" }
    foreach ($file in $taskFiles) {
        $specDirs = Get-ChildItem -Path (Join-Path (Split-Path $file.FullName) "specs") -Directory -ErrorAction SilentlyContinue
        if ($specDirs.Count -gt 1) {
            $content = Get-Content $file.FullName -Raw
            if ($content -notmatch '(?m)^##\s+\w') {
                Write-Host "`n⚠️  tasks.md has multiple specs but no ## <spec-name> headers." -ForegroundColor Yellow
                Write-Host "   Add a '## <spec-name>' section header per spec, then restart." -ForegroundColor Yellow
                Write-Host "   File: $($file.FullName)" -ForegroundColor Yellow
                exit 1
            }
        }
    }
}

function Invoke-UnitTests {
    $sln = Get-ChildItem -Filter "*.sln" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\bin\\" } | Select-Object -First 1
    if (-not $sln) { return @{ Skipped = $true; Reason = "no .sln found" } }

    $filter = "Category=Unit"
    Write-Host "  ⚙️  dotnet test --filter '$filter'" -ForegroundColor Gray
    $output = & dotnet test $sln.FullName --filter $filter 2>&1
    $exitCode = $LASTEXITCODE

    if ($output -match "No test matches") {
        $filter = "Category!=E2E"
        Write-Host "  ⚙️  No 'Category=Unit' tests — retrying with --filter '$filter'" -ForegroundColor Gray
        $output = & dotnet test $sln.FullName --filter $filter 2>&1
        $exitCode = $LASTEXITCODE
    }

    $summary = ($output | Select-Object -Last 6) -join "`n"
    return @{
        Skipped    = $false
        Success    = ($exitCode -eq 0)
        Summary    = $summary.Trim()
        FullOutput = ($output -join "`n")
        Command    = "dotnet test `"$($sln.Name)`" --filter $filter"
    }
}

function Invoke-JsTests {
    $pkgFiles = Get-ChildItem -Filter "package.json" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\(node_modules|bin|obj|dist|build)\\" }

    $anyFound = $false
    $allPassed = $true
    $summaries = [System.Collections.Generic.List[string]]::new()
    $failures  = [System.Collections.Generic.List[string]]::new()

    foreach ($pkg in $pkgFiles) {
        $content = Get-Content $pkg.FullName -Raw | ConvertFrom-Json -ErrorAction SilentlyContinue
        $testScript = $null
        try { $testScript = $content.scripts.test } catch {}
        if (-not $testScript) { continue }
        $anyFound = $true
        $dir = Split-Path $pkg.FullName
        Write-Host "  ⚙️  npm test in $dir" -ForegroundColor Gray
        Push-Location $dir
        $env:CI = "true"
        $output = & npm test 2>&1
        $exitCode = $LASTEXITCODE
        Remove-Item Env:\CI -ErrorAction SilentlyContinue
        Pop-Location

        # Extract test count — strip ANSI codes first, then find summary line
        $cleanOutput = $output | ForEach-Object { $_ -replace '\x1b\[[0-9;]*[mGKHFABCDJSu]', '' }
        $countLine = $cleanOutput | Where-Object { $_ -match 'Tests\s+\d+\s+passed' } | Select-Object -Last 1
        if (-not $countLine) {
            $countLine = ($cleanOutput | Where-Object { $_.Trim() } | Select-Object -Last 3) -join " | "
        }
        $summaries.Add($countLine.Trim())

        if ($exitCode -ne 0) {
            $allPassed = $false
            $failures.Add("npm test in $dir (exit $exitCode):`n$(($output | Select-Object -Last 10) -join "`n")")
        }
    }

    if (-not $anyFound) { return @{ Skipped = $true; Reason = "no package.json with test script" } }
    return @{
        Skipped   = $false
        Success   = $allPassed
        Summary   = $summaries -join " | "
        Failures  = $failures -join "`n`n"
    }
}

function Test-BrowserStartup {
    # Only for JS projects — skip when a .sln is present
    $sln = Get-ChildItem -Filter "*.sln" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\bin\\" } | Select-Object -First 1
    if ($sln) { return @{ Skipped = $true; Reason = ".NET project" } }

    $pkg = Get-ChildItem -Filter "package.json" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $pkg) { return @{ Skipped = $true; Reason = "no package.json" } }

    $pwDir = Split-Path $pkg.FullName
    if (-not (Test-Path (Join-Path $pwDir "node_modules\playwright"))) {
        return @{ Skipped = $true; Reason = "playwright not installed (run: npm i -D playwright && npx playwright install chromium)" }
    }

    $port = 13579
    Write-Host "  ⚙️  Starting serve on :$port — opening browser (5s)..." -ForegroundColor Gray

    # Do NOT redirect stdout/stderr — unread buffers cause the server to hang
    $psi = [System.Diagnostics.ProcessStartInfo]::new("cmd.exe", "/c npx serve -l $port --no-clipboard")
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow  = $true
    $psi.WorkingDirectory = $pwDir
    $serverProc = [System.Diagnostics.Process]::Start($psi)
    Start-Sleep -Seconds 5

    $script = @"
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push('[console.error] ' + msg.text()); });
page.on('pageerror', err => errors.push('[uncaught] ' + err.message));
page.on('response', resp => { if (resp.status() >= 400) errors.push('[' + resp.status() + '] ' + resp.url()); });
try {
  await page.goto('http://localhost:$port', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);
} catch (e) { errors.push('[navigation] ' + e.message); }
await browser.close();
if (errors.length > 0) { process.stderr.write(errors.join('\n') + '\n'); process.exit(1); }
"@

    # Write temp script alongside node_modules so Node.js resolves 'playwright' correctly
    $tmpScript = Join-Path $pwDir "._ralph_browser_check.mjs"
    $script | Set-Content $tmpScript -Encoding UTF8

    $nodePsi = [System.Diagnostics.ProcessStartInfo]::new("node", "`"$tmpScript`"")
    $nodePsi.UseShellExecute        = $false
    $nodePsi.CreateNoWindow         = $true
    $nodePsi.RedirectStandardOutput = $true
    $nodePsi.RedirectStandardError  = $true
    $nodePsi.WorkingDirectory       = $pwDir
    Push-Location $pwDir
    $nodeProc = [System.Diagnostics.Process]::Start($nodePsi)

    $stdoutTask = $nodeProc.StandardOutput.ReadToEndAsync()
    $stderrTask = $nodeProc.StandardError.ReadToEndAsync()

    $exited = $nodeProc.WaitForExit(20000)
    if (-not $exited) {
        try { $nodeProc.Kill($true) } catch { try { $nodeProc.Kill() } catch {} }
    }

    $null = $stdoutTask.Wait(2000)
    $gotStderr = $stderrTask.Wait(2000)
    $stderr    = if ($gotStderr) { $stderrTask.Result } else { "" }
    $exitCode  = if ($exited) { $nodeProc.ExitCode } else { -1 }

    Pop-Location
    Remove-Item $tmpScript -ErrorAction SilentlyContinue
    # Kill entire server process tree (cmd → npx → serve)
    $srvPid = $serverProc.Id
    & taskkill /F /T /PID $srvPid 2>$null | Out-Null

    if (-not $exited) {
        return @{ Skipped = $false; Success = $false; ErrorLines = "Browser check timed out (20s)" }
    }

    if ($exitCode -ne 0) {
        $errorLines = ($stderr -split "`n" | Where-Object { $_.Trim() }) -join "`n"
        return @{ Skipped = $false; Success = $false; ErrorLines = $errorLines }
    }
    return @{ Skipped = $false; Success = $true }
}

function Test-AppStartup {
    $proj = Get-ChildItem -Filter "*.AppHost.csproj" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\bin\\" } | Select-Object -First 1
    if (-not $proj) {
        $proj = Get-ChildItem -Filter "*.Api.csproj" -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch "\\bin\\" } | Select-Object -First 1
    }
    if (-not $proj) {
        $proj = Get-ChildItem -Filter "*.Web.csproj" -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch "\\bin\\" } | Select-Object -First 1
    }
    if (-not $proj) { return @{ Skipped = $true; Reason = "no startable project found" } }

    Write-Host "  ⚙️  Starting $($proj.Name) — 15s timeout..." -ForegroundColor Gray

    $psi = [System.Diagnostics.ProcessStartInfo]::new("dotnet", "run --project `"$($proj.FullName)`"")
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError  = $true
    $psi.UseShellExecute        = $false
    $psi.CreateNoWindow         = $true
    $proc = [System.Diagnostics.Process]::Start($psi)

    $stdoutTask = $proc.StandardOutput.ReadToEndAsync()
    $stderrTask = $proc.StandardError.ReadToEndAsync()

    $exited = $proc.WaitForExit(15000)
    if (-not $exited) {
        try { $proc.Kill($true) } catch { try { $proc.Kill() } catch {} }
    }

    $gotStdout = $stdoutTask.Wait(2000)
    $gotStderr = $stderrTask.Wait(2000)
    $stdout = if ($gotStdout) { $stdoutTask.Result } else { "(stdout read timed out)" }
    $stderr = if ($gotStderr) { $stderrTask.Result } else { "(stderr read timed out)" }

    $errorPatterns = @(
        "Unhandled exception",
        "Application startup exception",
        "FailFast",
        "Fatal error",
        "(?m)^\s*fail:",
        "(?m)^\s*crit:"
    )
    $benign = @("0 Error(s)", "0 Errors", "0 Warning(s)")

    $allLines = ($stdout + "`n" + $stderr) -split "`n"
    $foundErrors = @()
    foreach ($line in $allLines) {
        if (-not $line.Trim()) { continue }
        if ($benign | Where-Object { $line -match [regex]::Escape($_) }) { continue }
        foreach ($p in $errorPatterns) {
            if ($line -match $p) { $foundErrors += $line.Trim(); break }
        }
    }

    if ($exited -and $proc.ExitCode -ne 0) {
        $foundErrors += "Process exited early with code $($proc.ExitCode)"
    }

    return @{
        Skipped    = $false
        Success    = ($foundErrors.Count -eq 0)
        ErrorLines = $foundErrors -join "`n"
        Output     = ($stdout + $stderr).Trim()
        Project    = $proj.Name
    }
}

$branch = git branch --show-current 2>$null
$i = 0

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "🐣 Ralph Wiggum Loop" -ForegroundColor White
Write-Host "   Branch: $branch" -ForegroundColor White
if ($MaxIterations -gt 0) { Write-Host "   Max: $MaxIterations iterations" -ForegroundColor White }
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

if (-not (Test-Path "openspec/changes")) {
    Write-Host "`n⚠️  No openspec folder found. Follow Step 1 in README.md first." -ForegroundColor Yellow
    exit 1
}

Assert-SpecHeaders

while ($true) {
    if ($MaxIterations -gt 0 -and $i -ge $MaxIterations) {
        Write-Host "`n🏁 Max iterations reached: $MaxIterations" -ForegroundColor Yellow; break
    }

    $next = Get-NextTask
    if (-not $next) {
        Write-Host "`n🎉 All tasks done! Don't forget to archive." -ForegroundColor Green; break
    }

    $remaining = Get-PendingCount
    Write-Host "`n══════════ LOOP $($i+1)  ($remaining tasks remaining) ══════════" -ForegroundColor Green
    Write-Host "📊 Progress:" -ForegroundColor White
    Show-SpecProgress $next.File
    Write-Host "📋 Next task:" -ForegroundColor White
    Write-Host "   $($next.Task)" -ForegroundColor White
    Write-Host ""

    $attempt = 0
    $checksOk = $false
    $failureDetails = ""

    do {
        if ($attempt -eq 0) {
            $prompt = "implement the next task"
        } else {
            Write-Host "`n🔄 Retry $attempt/$($MaxRetries - 1) — asking agent to fix failures..." -ForegroundColor Yellow
            $prompt = "Checks failed after the last implementation attempt. Fix these issues and complete the current task.`n`n$failureDetails"
        }

        copilot --experimental --yolo --agent ralph --prompt $prompt

        Write-Host "`n🔍 Post-implementation checks (attempt $($attempt + 1)/$MaxRetries):" -ForegroundColor White
        $failureDetails = ""
        $checksOk = $true

        $testResult = Invoke-UnitTests
        if ($testResult.Skipped) {
            Write-Host "  ⏭️  .NET tests : skipped ($($testResult.Reason))" -ForegroundColor Gray
        } elseif ($testResult.Success) {
            Write-Host "  ✅ .NET tests : PASSED" -ForegroundColor Green
            Write-Host "     $($testResult.Summary)" -ForegroundColor Gray
        } else {
            Write-Host "  ❌ .NET tests : FAILED" -ForegroundColor Red
            Write-Host "     $($testResult.Summary)" -ForegroundColor Yellow
            $checksOk = $false
            $failureDetails += ".NET unit tests FAILED (command: $($testResult.Command)):`n$($testResult.Summary)`n`n"
        }

        $jsResult = Invoke-JsTests
        if ($jsResult.Skipped) {
            Write-Host "  ⏭️  JS tests   : skipped ($($jsResult.Reason))" -ForegroundColor Gray
        } elseif ($jsResult.Success) {
            Write-Host "  ✅ JS tests   : PASSED  — $($jsResult.Summary)" -ForegroundColor Green
        } else {
            Write-Host "  ❌ JS tests   : FAILED  — $($jsResult.Summary)" -ForegroundColor Red
            Write-Host "     $($jsResult.Failures)" -ForegroundColor Yellow
            $checksOk = $false
            $failureDetails += "JS tests FAILED:`n$($jsResult.Failures)`n`n"
        }

        $startupResult = Test-AppStartup
        if ($startupResult.Skipped) {
            Write-Host "  ⏭️  App startup: skipped ($($startupResult.Reason))" -ForegroundColor Gray
        } elseif ($startupResult.Success) {
            Write-Host "  ✅ App startup: OK  ($($startupResult.Project))" -ForegroundColor Green
        } else {
            Write-Host "  ❌ App startup: ERRORS in $($startupResult.Project)" -ForegroundColor Red
            Write-Host "     $($startupResult.ErrorLines)" -ForegroundColor Yellow
            $checksOk = $false
            $failureDetails += "App startup errors in $($startupResult.Project):`n$($startupResult.ErrorLines)`n`n"
        }

        $browserResult = Test-BrowserStartup
        if ($browserResult.Skipped) {
            Write-Host "  ⏭️  Browser    : skipped ($($browserResult.Reason))" -ForegroundColor Gray
        } elseif ($browserResult.Success) {
            Write-Host "  ✅ Browser    : no JS errors" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Browser    : JS errors detected" -ForegroundColor Red
            Write-Host "     $($browserResult.ErrorLines)" -ForegroundColor Yellow
            $checksOk = $false
            $failureDetails += "Browser JS errors:`n$($browserResult.ErrorLines)`n`n"
        }

        $attempt++
    } while (-not $checksOk -and $attempt -lt $MaxRetries)

    if (-not $checksOk) {
        Write-Host "`n💥 Still failing after $MaxRetries attempt(s). Pushing and continuing." -ForegroundColor Red
    }

    Write-Host "`n📤 Pushing..." -ForegroundColor White
    git push origin $branch 2>$null
    if ($LASTEXITCODE -ne 0) { git push -u origin $branch }

    $i++
    $remaining = Get-PendingCount
    if ($remaining -eq 0) {
        Write-Host "`n🎉 All tasks done!" -ForegroundColor Green; break
    }
}

Write-Host "`n✅ Ralph loop finished after $i iteration(s)." -ForegroundColor White
