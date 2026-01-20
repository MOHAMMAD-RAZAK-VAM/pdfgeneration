// Complete Invoice Processing Test
// This script tests the new /api/process-invoices endpoint that handles everything

const axios = require('axios');

// Your exact data format
const testData = [
  {
    "invoiceData": {
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
    },
    "customerEmail": "mrazak338@gmail.com",
    "invoiceNo": "INV-1002",
    "customerName": "Arun Kumar"
  }
];

const API_BASE = 'https://pdfgeneration-1n20.onrender.com';

async function testCompleteProcessing() {
  console.log('🚀 Testing Complete Invoice Processing System');
  console.log('=' * 60);
  
  try {
    console.log('\n🧪 Testing new /api/process-invoices endpoint...');
    console.log('📊 Sending your exact data format...');
    
    const response = await axios.post(
      `${API_BASE}/api/process-invoices`,
      testData,  // Send your exact array format
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );
    
    console.log('\n✅ SUCCESS! Complete processing works!');
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n🎉 PROCESSING SUMMARY:');
      console.log(`📊 Total invoices: ${response.data.summary.total}`);
      console.log(`✅ Successful: ${response.data.summary.successful}`);
      console.log(`❌ Failed: ${response.data.summary.failed}`);
      console.log(`📧 Emails sent: ${response.data.summary.emailsSent}`);
      
      // Show details for each invoice
      response.data.results.forEach((result, index) => {
        console.log(`\n📋 Invoice ${index + 1}: ${result.invoiceNo}`);
        console.log(`   Customer: ${result.customer}`);
        console.log(`   Amount: ₹${result.amount?.toLocaleString()}`);
        console.log(`   PDF: ${result.pdfGenerated ? '✅' : '❌'}`);
        console.log(`   Email: ${result.emailSent ? '✅ Sent' : '❌ ' + (result.emailError || 'Failed')}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.response) {
      console.error('📤 Status:', error.response.status);
      console.error('📄 Response:', error.response.data);
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      console.error('💭 Service might still be starting up...');
    }
  }
}

async function testHealthFirst() {
  try {
    console.log('🔍 Checking service health...');
    const response = await axios.get(`${API_BASE}/health`, { timeout: 10000 });
    console.log('✅ Service is healthy!');
    console.log('📊 Info:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Service health check failed:', error.message);
    console.log('💤 Service might be sleeping (free tier). Please wait...');
    return false;
  }
}

// Test other endpoints too
async function testOtherEndpoints() {
  const invoiceData = testData[0].invoiceData;
  
  console.log('\n' + '='.repeat(60));
  console.log('🧪 Testing other endpoints with extracted data...');
  
  // Test single PDF generation
  try {
    console.log('\n📄 Testing PDF generation...');
    const pdfResponse = await axios.post(
      `${API_BASE}/api/generate-pdf`,
      invoiceData,
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );
    console.log('✅ PDF generation successful!');
    console.log(`📏 PDF size: ${pdfResponse.data.byteLength} bytes`);
  } catch (error) {
    console.log('❌ PDF generation failed:', error.message);
  }
  
  // Test email sending
  try {
    console.log('\n📧 Testing email sending...');
    const emailResponse = await axios.post(
      `${API_BASE}/api/send-invoice`,
      invoiceData,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    console.log('✅ Email sending successful!');
    console.log('📋 Response:', emailResponse.data);
  } catch (error) {
    console.log('❌ Email sending failed:', error.message);
    if (error.response?.data) {
      console.log('📄 Details:', error.response.data);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('🎯 COMPLETE INVOICE SYSTEM TEST');
  console.log('Date:', new Date().toISOString());
  console.log('API:', API_BASE);
  console.log('='.repeat(60));
  
  const healthOK = await testHealthFirst();
  
  if (healthOK) {
    await testCompleteProcessing();
    await testOtherEndpoints();
  }
  
  console.log('\n🏁 All tests completed!');
  console.log('🎯 Main endpoint: POST /api/process-invoices');
  console.log('📊 Send your exact array format - it handles everything!');
}

runAllTests();
