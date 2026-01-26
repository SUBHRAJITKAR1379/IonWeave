# Project AtmosAether: Ionized Atmospheric Harvester

A modern, responsive website showcasing revolutionary atmospheric purification technology.

## 🌟 Features

- **Dark Theme Design**: Professional dark theme with blue/teal accents
- **Smooth Animations**: Fade-in effects, hover transitions, and smooth scrolling
- **Fully Responsive**: Optimized for all devices and screen sizes
- **Interactive Sections**: 
  - Hero section with compelling call-to-action
  - Problem statement with impact metrics
  - Core technology overview
  - Step-by-step process explanation
  - Implementation roadmap
  - Sustainability impact metrics
  - Future vision and innovation roadmap
  - Contact form for inquiries

## 🛠️ Tech Stack

### Frontend
- React 18.2
- Tailwind CSS
- Axios for API calls
- Intersection Observer API for animations

### Backend
- FastAPI
- MongoDB
- Python 3.11

## 🚀 Getting Started

### Prerequisites
- Node.js and Yarn
- Python 3.11+
- MongoDB

### Installation

1. **Backend Setup**
```bash
cd /app/backend
pip install -r requirements.txt
```

2. **Frontend Setup**
```bash
cd /app/frontend
yarn install
```

### Running the Application

The application uses Supervisor to manage services:

```bash
# Start all services
sudo supervisorctl start all

# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart all
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Health Check**: http://localhost:8001/api/health

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Component styles
│   │   ├── index.js      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env              # Frontend environment variables
└── README.md
```

## 🎨 Design Philosophy

- **Clean & Modern**: Flat design with minimal distractions
- **Professional**: Suitable for academic, startup, and competition contexts
- **Accessible**: High contrast for readability
- **Performance**: Optimized images and lazy loading

## 📝 API Endpoints

### Health Check
```
GET /api/health
Response: { "status": "healthy", "service": "AtmosAether API" }
```

### Contact Form Submission
```
POST /api/contact
Body: {
  "name": "string",
  "email": "string",
  "organization": "string (optional)",
  "message": "string"
}
```

## 🌐 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017/aether_web
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🧪 Testing

Test the contact form submission:
```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "organization": "Test Org",
    "message": "This is a test message"
  }'
```

## 🎯 Use Cases

- **Innovation Competitions**: Showcase technology for hackathons and competitions
- **Startup Pitches**: Professional presentation for investors
- **Academic Presentations**: Research and development showcases
- **Municipal Proposals**: Pitch to city governments and environmental agencies

## 🔧 Customization

### Colors
Edit `/app/frontend/tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  'dark-bg': '#0a0e27',
  'dark-card': '#151a3d',
  'accent-blue': '#3b82f6',
  'accent-teal': '#14b8a6',
}
```

### Content
Update content directly in `/app/frontend/src/App.js`

## 📊 Performance

- Optimized image loading
- CSS animations using GPU acceleration
- Lazy loading for sections
- Responsive images with proper sizing

## 🔐 Security

- CORS configured for secure API access
- Email validation on both frontend and backend
- MongoDB connection security
- Environment variable management

## 📄 License

This project is created for AtmosAether innovation showcase.

## 👥 Contact

For inquiries about the technology or partnership opportunities, use the contact form on the website.

---

**Built with ❤️ for a cleaner, healthier atmosphere**
