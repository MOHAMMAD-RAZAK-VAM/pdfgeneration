const https = require('https');

// Test data from your invoice-data-format-guide.js
const testInvoiceData = {
  "invoiceNo": "INV-TEST-001",
  "date": "2026-01-19", 
  "customer": {
    "name": "Test Customer",
    "email": "test@example.com",
    "address": "123 Test Street, Test City"
  },
  "items": [
    {
      "name": "Test Service",
      "qty": 1,
      "price": 1000
    }
  ],
  "taxPercent": 18
};

console.log('🧪 Testing Render API with valid invoice data...');
console.log('📋 Test Data:', JSON.stringify(testInvoiceData, null, 2));

// Test the health endpoint first
const healthOptions = {
  hostname: 'pdfgeneration-1n20.onrender.com',
  port: 443,
  path: '/health',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('\n1️⃣ Testing Health Endpoint...');
const healthReq = https.request(healthOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Health Check Status:', res.statusCode);
    console.log('✅ Health Response:', data);
    
    // Now test PDF generation
    testPdfGeneration();
  });
});

healthReq.on('error', (error) => {
  console.error('❌ Health Check Error:', error.message);
});

healthReq.end();

function testPdfGeneration() {
  console.log('\n2️⃣ Testing PDF Generation...');
  
  const postData = JSON.stringify(testInvoiceData);
  
  const pdfOptions = {
    hostname: 'pdfgeneration-1n20.onrender.com',
    port: 443,
    path: '/api/generate-pdf',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const pdfReq = https.request(pdfOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 PDF Generation Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        console.log('✅ PDF Generated Successfully!');
        console.log('📊 Response Length:', data.length, 'bytes');
        console.log('🎯 Content Type:', res.headers['content-type']);
      } else {
        console.log('❌ PDF Generation Failed');
        console.log('📋 Error Response:', data);
      }
    });
  });
  
  pdfReq.on('error', (error) => {
    console.error('❌ PDF Generation Error:', error.message);
  });
  
  pdfReq.write(postData);
  pdfReq.end();
}
