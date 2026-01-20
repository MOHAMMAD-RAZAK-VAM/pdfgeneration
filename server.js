const express = require('express');
const htmlPdf = require('html-pdf-node');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Validation schema
const invoiceSchema = Joi.object({
  invoiceNo: Joi.string().required(),
  date: Joi.string().required(),
  customer: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required()
  }).required(),
  items: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      qty: Joi.number().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  taxPercent: Joi.number().min(0).max(100).default(0),
  company: Joi.object({
    name: Joi.string().default('Your Company'),
    address: Joi.string().default('Your Address'),
    phone: Joi.string().default(''),
    email: Joi.string().email().default('billing@yourcompany.com')
  }).default()
});

// Generate HTML template
function generateInvoiceHTML(data) {
  let rows = '';
  let subtotal = 0;

  data.items.forEach(item => {
    const total = item.qty * item.price;
    subtotal += total;
    rows += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₹${item.price.toLocaleString()}</td>
        <td>₹${total.toLocaleString()}</td>
      </tr>
    `;
  });

  const tax = (subtotal * data.taxPercent) / 100;
  const grandTotal = subtotal + tax;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${data.invoiceNo}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 40px;
            background: #fff;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .content {
            padding: 30px;
        }
        
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        
        .company-info, .customer-info {
            flex: 1;
        }
        
        .customer-info {
            text-align: right;
        }
        
        .info-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .items-table th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        .items-table tr:hover {
            background: #f0f0f0;
        }
        
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        
        .totals div {
            margin-bottom: 10px;
            padding: 8px 0;
        }
        
        .subtotal, .tax {
            font-size: 1.1em;
            color: #666;
        }
        
        .grand-total {
            font-size: 1.5em;
            font-weight: bold;
            color: #667eea;
            border-top: 3px solid #667eea;
            padding-top: 15px;
            margin-top: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            color: #666;
        }
        
        @media print {
            body { padding: 0; }
            .invoice-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>INVOICE</h1>
            <p>Professional Invoice System</p>
        </div>
        
        <div class="content">
            <div class="invoice-info">
                <div class="company-info">
                    <div class="info-label">From:</div>
                    <div><strong>${data.company.name}</strong></div>
                    <div>${data.company.address}</div>
                    ${data.company.phone ? `<div>Phone: ${data.company.phone}</div>` : ''}
                    <div>Email: ${data.company.email}</div>
                </div>
                
                <div class="customer-info">
                    <div class="info-label">To:</div>
                    <div><strong>${data.customer.name}</strong></div>
                    <div>${data.customer.address}</div>
                    <div>Email: ${data.customer.email}</div>
                    <br>
                    <div class="info-label">Invoice Details:</div>
                    <div><strong>Invoice #: ${data.invoiceNo}</strong></div>
                    <div>Date: ${data.date}</div>
                </div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            
            <div class="totals">
                <div class="subtotal">
                    <strong>Subtotal: ₹${subtotal.toLocaleString()}</strong>
                </div>
                ${data.taxPercent > 0 ? `
                <div class="tax">
                    <strong>Tax (${data.taxPercent}%): ₹${tax.toLocaleString()}</strong>
                </div>
                ` : ''}
                <div class="grand-total">
                    <strong>TOTAL: ₹${grandTotal.toLocaleString()}</strong>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice.</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Generate PDF from HTML using html-pdf-node
async function generatePDF(html, filename) {
  console.log('📄 Starting PDF generation with html-pdf-node...');
  
  try {
    // Configure html-pdf-node options
    const options = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    };

    // Create the file object for html-pdf-node
    const file = { content: html };

    // Generate PDF buffer
    console.log('🔄 Generating PDF...');
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    console.log('✅ PDF generated successfully');
    
    return pdfBuffer;
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

// Send email with PDF attachment
async function sendInvoiceEmail(invoiceData, pdfBuffer) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key not configured');
  }

  const msg = {
    to: invoiceData.customer.email,
    from: process.env.FROM_EMAIL || 'billing@yourcompany.com',
    subject: `Invoice ${invoiceData.invoiceNo}`,
    text: `Hi ${invoiceData.customer.name},\n\nPlease find your invoice attached.\n\nIf you have any questions, reply to this email.\n\nThanks,\nBilling Team`,
    html: `
      <h3>Hi ${invoiceData.customer.name},</h3>
      <p>Please find your invoice attached.</p>
      <p>If you have any questions, reply to this email.</p>
      <br>
      <p>Thanks,<br>Billing Team</p>
    `,
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: `Invoice-${invoiceData.invoiceNo}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };

  return await sgMail.send(msg);
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Invoice PDF Backend',
    version: '1.0.1',
    library: 'html-pdf-node'
  });
});

// Generate PDF only
app.post('/api/generate-pdf', async (req, res) => {
  try {
    // Validate input
    const { error, value } = invoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const invoiceData = value;
    const html = generateInvoiceHTML(invoiceData);
    const pdfBuffer = await generatePDF(html, `invoice-${invoiceData.invoiceNo}`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${invoiceData.invoiceNo}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
});

// Generate PDF and send email
app.post('/api/send-invoice', async (req, res) => {
  try {
    // Validate input
    const { error, value } = invoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const invoiceData = value;
    const html = generateInvoiceHTML(invoiceData);
    const pdfBuffer = await generatePDF(html, `invoice-${invoiceData.invoiceNo}`);

    // Send email
    await sendInvoiceEmail(invoiceData, pdfBuffer);

    res.json({
      success: true,
      message: `Invoice ${invoiceData.invoiceNo} sent successfully to ${invoiceData.customer.email}`,
      invoiceNo: invoiceData.invoiceNo,
      sentTo: invoiceData.customer.email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Send Invoice Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send invoice',
      message: error.message
    });
  }
});

// Get invoice preview (HTML)
app.post('/api/preview', async (req, res) => {
  try {
    const { error, value } = invoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const html = generateInvoiceHTML(value);
    res.send(html);

  } catch (error) {
    console.error('Preview Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/generate-pdf',
      'POST /api/send-invoice',
      'POST /api/preview'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Invoice PDF Backend running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📄 Generate PDF: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`📧 Send Invoice: POST http://localhost:${PORT}/api/send-invoice`);
  console.log(`👀 Preview: POST http://localhost:${PORT}/api/preview`);
});

module.exports = app;
