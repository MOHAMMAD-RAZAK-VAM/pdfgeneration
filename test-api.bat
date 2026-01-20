@echo off
echo Testing API Health...
curl -X GET "https://pdfgeneration-1n20.onrender.com/health" -H "Accept: application/json"
echo.

echo.
echo Testing PDF Generation...
curl -X POST "https://pdfgeneration-1n20.onrender.com/api/generate-pdf" ^
  -H "Content-Type: application/json" ^
  -d "{\"invoiceNo\":\"INV-1002\",\"date\":\"2026-01-19\",\"customer\":{\"name\":\"Arun Kumar\",\"email\":\"mrazak338@gmail.com\",\"address\":\"Bangalore, India\"},\"items\":[{\"name\":\"UI Design\",\"qty\":1,\"price\":15000},{\"name\":\"Backend API\",\"qty\":1,\"price\":20000}],\"subtotal\":35000,\"taxPercent\":18,\"taxAmount\":6300,\"grandTotal\":41300,\"company\":{\"name\":\"Your Company\",\"address\":\"Your Address\",\"phone\":\"+1-555-123-4567\",\"email\":\"billing@yourcompany.com\"}}"

echo.
echo Test completed.
pause
