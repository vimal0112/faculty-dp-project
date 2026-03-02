# PowerShell Script to Test API
# Run this script: .\test-api.ps1

$baseUrl = "http://localhost:3001"

Write-Host "Testing API Endpoints..." -ForegroundColor Green
Write-Host ""

# Test Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✓ Health Check: OK" -ForegroundColor Green
    Write-Host "  Response: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Health Check Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test Register User
Write-Host "2. Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    role = "faculty"
    department = "Computer Science"
    designation = "Assistant Professor"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    Write-Host "✓ User Registered Successfully" -ForegroundColor Green
    Write-Host "  User ID: $($response.user.id)" -ForegroundColor Cyan
    Write-Host "  Name: $($response.user.name)" -ForegroundColor Cyan
    Write-Host "  Email: $($response.user.email)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Registration Failed: $_" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test Login
Write-Host "3. Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "test123"
    role = "faculty"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    Write-Host "✓ Login Successful" -ForegroundColor Green
    Write-Host "  User ID: $($response.user.id)" -ForegroundColor Cyan
    Write-Host "  Name: $($response.user.name)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Login Failed: $_" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check MongoDB Compass - Database: FDP, Collection: users" -ForegroundColor White
Write-Host "2. Refresh MongoDB Compass to see the new user" -ForegroundColor White
