# Invoice PDF Backend

🚀 **FREE Invoice PDF Generation & Email Backend** using Node.js, Express, Puppeteer & SendGrid.

## ✨ Features

- ✅ **FREE PDF Generation** - Puppeteer (no paid APIs)
- ✅ **Professional Templates** - Beautiful HTML/CSS invoice design
- ✅ **Email Delivery** - SendGrid integration (100 emails/day free)
- ✅ **Input Validation** - Joi schema validation
- ✅ **Multiple Endpoints** - PDF generation, email sending, preview
- ✅ **Production Ready** - Error handling, security, logging

## 🏗️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/preview` | Generate HTML preview |
| `POST` | `/api/generate-pdf` | Generate & download PDF |
| `POST` | `/api/send-invoice` | Generate PDF & send email |

## 📦 Installation

### 1. Install Dependencies
```bash
# Install Node.js packages
npm install

# Install system dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install -y chromium-browser

# Or on macOS
brew install chromium
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

### 3. Configure SendGrid (Optional - for email)
```bash
# Get free SendGrid account: https://sendgrid.com/
# Add your API key to .env file
SENDGRID_API_KEY=SG.your_api_key_here
FROM_EMAIL=billing@yourcompany.com
```

## 🚀 Usage

### Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Test API
```bash
# Run built-in tests
npm test
```

## 📋 Request Format

### Invoice Data Structure
```json
{
  "invoiceNo": "INV-1002",
  "date": "2026-01-19",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Customer Street, City, State"
  },
  "items": [
    { "name": "Web Development", "qty": 1, "price": 25000 },
    { "name": "UI Design", "qty": 2, "price": 15000 }
  ],
  "taxPercent": 18,
  "company": {
    "name": "Your Company",
    "address": "Your Address",
    "phone": "+1 (555) 123-4567",
    "email": "billing@yourcompany.com"
  }
}
```

## 🧪 Example Usage

### 1. Generate PDF Only
```bash
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d @invoice-data.json \
  -o invoice.pdf
```

### 2. Send Invoice via Email
```bash
curl -X POST http://localhost:3000/api/send-invoice \
  -H "Content-Type: application/json" \
  -d @invoice-data.json
```

### 3. Preview HTML
```bash
curl -X POST http://localhost:3000/api/preview \
  -H "Content-Type: application/json" \
  -d @invoice-data.json \
  -o preview.html
```

## 🎨 Frontend Integration

### React Example
```javascript
const generateInvoice = async (invoiceData) => {
  try {
    const response = await fetch('http://localhost:3000/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    
    const result = await response.json();
    console.log('Invoice sent:', result.message);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Download PDF
```javascript
const downloadPDF = async (invoiceData) => {
  const response = await fetch('http://localhost:3000/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData)
  });
  
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${invoiceData.invoiceNo}.pdf`;
  a.click();
};
```

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                          # Server port
SENDGRID_API_KEY=your_key         # SendGrid API key
FROM_EMAIL=billing@company.com    # Email sender
COMPANY_NAME=Your Company         # Default company name
COMPANY_ADDRESS=Your Address      # Default company address
```

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### VPS Deployment
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chromium
sudo apt install -y chromium-browser

# Clone and setup
git clone your-repo
cd invoice-backend
npm install
cp .env.example .env
# Edit .env file
npm start
```

## 💰 Cost Breakdown

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| **Server** | VPS: $5/month | Scales with usage |
| **PDF Generation** | Unlimited | $0 (Puppeteer) |
| **Email** | 100/day (SendGrid) | $0.85/1000 emails |
| **Storage** | Temporary files | $0 |
| **Total** | **~$5/month** | Highly scalable |

## 🔒 Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin protection  
- ✅ **Input Validation** - Joi schema validation
- ✅ **Error Handling** - Secure error responses
- ✅ **No File Storage** - PDFs generated in memory

## 📈 Performance

- ⚡ **Fast PDF Generation** - ~2-3 seconds per invoice
- 🎯 **Lightweight** - Minimal dependencies
- 📊 **Scalable** - Handle 100+ concurrent requests
- 💾 **Memory Efficient** - No temp file storage

## 🆘 Troubleshooting

### Puppeteer Issues
```bash
# Ubuntu/Debian - Install missing dependencies
sudo apt install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2

# Run with --no-sandbox flag (already included)
```

### SendGrid Issues
```bash
# Verify API key permissions
# Ensure "Mail Send" permission is enabled
# Check from email is verified in SendGrid
```

## 📞 Support

- 📧 **Issues**: Create GitHub issue
- 📚 **Docs**: See API documentation above
- 🧪 **Testing**: Run `npm test`

---

**🎉 Your FREE invoice backend is ready to use!**
