const axios = require('axios');

// Test data
const testInvoice = {
  "invoiceNo": "INV-TEST-001",
  "date": "2026-01-19",
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "address": "123 Customer Street, City, State 12345"
  },
  "items": [
    { "name": "Web Development", "qty": 1, "price": 25000 },
    { "name": "UI/UX Design", "qty": 1, "price": 15000 },
    { "name": "SEO Optimization", "qty": 1, "price": 8000 }
  ],
  "taxPercent": 18,
  "company": {
    "name": "TechSolutions Inc",
    "address": "456 Business Ave, Tech City, TC 54321",
    "phone": "+1 (555) 123-4567",
    "email": "billing@techsolutions.com"
  }
};

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Invoice PDF Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Preview HTML
    console.log('2️⃣ Testing HTML Preview...');
    const previewResponse = await axios.post(`${BASE_URL}/api/preview`, testInvoice);
    console.log('✅ Preview generated (HTML length):', previewResponse.data.length, 'characters');
    console.log('');

    // Test 3: Generate PDF
    console.log('3️⃣ Testing PDF Generation...');
    const pdfResponse = await axios.post(`${BASE_URL}/api/generate-pdf`, testInvoice, {
      responseType: 'arraybuffer'
    });
    console.log('✅ PDF generated (size):', pdfResponse.data.length, 'bytes');
    console.log('✅ Content-Type:', pdfResponse.headers['content-type']);
    console.log('');

    // Test 4: Send Invoice (will fail without SendGrid config)
    console.log('4️⃣ Testing Email Sending...');
    try {
      const emailResponse = await axios.post(`${BASE_URL}/api/send-invoice`, testInvoice);
      console.log('✅ Email sent:', emailResponse.data);
    } catch (emailError) {
      if (emailError.response?.status === 500 && emailError.response.data.message?.includes('SendGrid')) {
        console.log('⚠️  Email test skipped - SendGrid not configured (this is expected)');
        console.log('   Configure SENDGRID_API_KEY in .env to test email sending');
      } else {
        console.log('❌ Email error:', emailError.response?.data || emailError.message);
      }
    }
    console.log('');

    // Test 5: Validation
    console.log('5️⃣ Testing Input Validation...');
    try {
      await axios.post(`${BASE_URL}/api/generate-pdf`, { invalid: 'data' });
    } catch (validationError) {
      console.log('✅ Validation working:', validationError.response.data.error);
    }
    console.log('');

    console.log('🎉 All tests completed!');
    console.log('');
    console.log('📋 API Endpoints Available:');
    console.log(`   GET  ${BASE_URL}/health`);
    console.log(`   POST ${BASE_URL}/api/preview`);
    console.log(`   POST ${BASE_URL}/api/generate-pdf`);
    console.log(`   POST ${BASE_URL}/api/send-invoice`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the server is running: npm start');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI, testInvoice };
