Write-Host "Testing homepage for redirects..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "✅ SUCCESS: Status $($response.StatusCode) - No redirect!" -ForegroundColor Green
    Write-Host "Site is accessible to search engines!" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 307 -or $statusCode -eq 302 -or $statusCode -eq 301) {
        Write-Host "❌ FAIL: Status $statusCode - STILL REDIRECTING" -ForegroundColor Red
        Write-Host "Location: $($_.Exception.Response.Headers.Location)" -ForegroundColor Red
    } else {
        Write-Host "Status: $statusCode" -ForegroundColor Yellow
    }
}
