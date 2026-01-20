const axios = require('axios');

// Test data in your new format (array with single object)
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

async function testPDFGeneration() {
  try {
    console.log('🧪 Testing new input format...');
    console.log('📊 Input data:', JSON.stringify(testData[0], null, 2));
    
    // Extract the invoiceData from the first object in the array
    const invoiceData = testData[0].invoiceData;
    
    console.log('\n📤 Sending to API...');
    const response = await axios.post(
      'https://pdfgeneration-1n20.onrender.com/api/generate-pdf',
      invoiceData,  // Send just the invoiceData part
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('✅ Success!');
    console.log('📄 Response status:', response.status);
    console.log('📋 Response headers:', response.headers['content-type']);
    
    if (response.data && response.data.success) {
      console.log('🎉 PDF generated successfully!');
      console.log('📧 Email sent:', response.data.emailSent ? 'Yes' : 'No');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('📤 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
    }
  }
}

// Test health endpoint first
async function testHealth() {
  try {
    console.log('🔍 Testing health endpoint...');
    const response = await axios.get(
      'https://pdfgeneration-1n20.onrender.com/health',
      { timeout: 10000 }
    );
    
    console.log('✅ Health check passed');
    console.log('📊 Service info:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  const healthOK = await testHealth();
  
  if (healthOK) {
    console.log('\n' + '='.repeat(50));
    await testPDFGeneration();
  } else {
    console.log('💤 Service appears to be sleeping or unavailable');
    console.log('⏳ Try again in a few minutes after Render spins up');
  }
}

runTests();
