# PowerShell test script for the PDF API

Write-Host "🚀 Testing Invoice PDF API" -ForegroundColor Green
Write-Host "=" * 50

# Test health endpoint
Write-Host "🔍 Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "https://pdfgeneration-1n20.onrender.com/health" -Method GET -TimeoutSec 30
    Write-Host "✅ Health check successful!" -ForegroundColor Green
    Write-Host "📊 Service info:" -ForegroundColor Cyan
    $healthResponse | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "📤 Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
    Write-Host "💤 Service might be spinning up. Please wait and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=" * 50

# Test PDF generation
Write-Host "📄 Testing PDF generation..." -ForegroundColor Yellow

$invoiceData = @{
    invoiceNo = "INV-1002"
    date = "2026-01-19"
    customer = @{
        name = "Arun Kumar"
        email = "mrazak338@gmail.com"
        address = "Bangalore, India"
    }
    items = @(
        @{
            name = "UI Design"
            qty = 1
            price = 15000
        },
        @{
            name = "Backend API"
            qty = 1
            price = 20000
        }
    )
    subtotal = 35000
    taxPercent = 18
    taxAmount = 6300
    grandTotal = 41300
    company = @{
        name = "Your Company"
        address = "Your Address"
        phone = "+1-555-123-4567"
        email = "billing@yourcompany.com"
    }
}

try {
    Write-Host "📤 Sending PDF generation request..." -ForegroundColor Cyan
    $pdfResponse = Invoke-RestMethod -Uri "https://pdfgeneration-1n20.onrender.com/api/generate-pdf" -Method POST -Body ($invoiceData | ConvertTo-Json -Depth 5) -ContentType "application/json" -TimeoutSec 60
    
    Write-Host "✅ PDF generation successful!" -ForegroundColor Green
    Write-Host "📋 Response:" -ForegroundColor Cyan
    $pdfResponse | ConvertTo-Json -Depth 3 | Write-Host
    
    if ($pdfResponse.success) {
        Write-Host "🎉 SUCCESS: PDF was generated and processed!" -ForegroundColor Green
        if ($pdfResponse.emailSent) {
            Write-Host "📧 Email was sent successfully!" -ForegroundColor Green
        } else {
            Write-Host "📧 Email was not sent (check SENDGRID_API_KEY)" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "❌ PDF generation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "📤 Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "📄 Error details: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "📄 Could not read error details" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "🏁 Test completed!" -ForegroundColor Green
