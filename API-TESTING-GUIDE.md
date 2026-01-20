# 🧪 API Testing Guide

## Your New Input Format:
```json
[
  {
    "invoiceData": { /* your invoice data here */ },
    "customerEmail": "email@example.com",
    "invoiceNo": "INV-1002",
    "customerName": "Customer Name"
  }
]
```

## ✅ Correct API Call:
You need to extract the `invoiceData` from the array and send just that part to the API.

### Using cURL:
```bash
curl -X POST https://pdfgeneration-1n20.onrender.com/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNo": "INV-1002",
    "date": "2026-01-19",
    "customer": {
      "name": "Arun Kumar",
      "email": "mrazak338@gmail.com",
      "address": "Bangalore, India"
    },
    "items": [
      {
        "name": "UI Design",
        "qty": 1,
        "price": 15000
      },
      {
        "name": "Backend API",
        "qty": 1,
        "price": 20000
      }
    ],
    "subtotal": 35000,
    "taxPercent": 18,
    "taxAmount": 6300,
    "grandTotal": 41300,
    "company": {
      "name": "Your Company",
      "address": "Your Address",
      "phone": "+1-555-123-4567",
      "email": "billing@yourcompany.com"
    }
  }'
```

## 🔄 For n8n Workflow:
In your n8n HTTP Request node, use this expression to extract the data:
```javascript
{{ $json.invoiceData }}
```

## 🚀 Service Status:
- Health Endpoint: https://pdfgeneration-1n8nworkflow.onrender.com/health
- Current Status: ✅ Using html-pdf-node (no Chrome dependency)
- Last Deploy: Just triggered with version 1.0.1

## ⚠️ Common Issues:

1. **503 Service Unavailable**: Wait 2-3 minutes for service to spin up
2. **Timeout**: Free tier has cold starts - first request may take 30+ seconds
3. **Validation Error**: Make sure you're sending the invoiceData object, not the full array

## 🧪 Quick Test:
Wait 3-5 minutes, then visit: https://pdfgeneration-1n20.onrender.com/health

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-01-20T...",
  "service": "Invoice PDF Backend",
  "version": "1.0.1",
  "library": "html-pdf-node"
}
```
