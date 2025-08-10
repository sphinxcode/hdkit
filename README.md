# SAGE Human Design API

**Self-learning Agent for Guidance and Execution**

A modern, high-performance Human Design API service built on the foundations of the original [hdkit](https://github.com/jdempcy/hdkit) toolkit. SAGE provides the core infrastructure for generating Human Design charts, relationship analysis, and location services - forming the backbone of an AI-powered guidance platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/sphinxcode/hdkit.git
cd hdkit
npm install
npm start
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### 1. Location/Timezone Lookup
```http
GET /api/locations?query={city_name}
```

**Example:**
```bash
curl "http://localhost:3000/api/locations?query=London"
```

**Response:**
```json
[
  {
    "country": " United Kingdom",
    "timezone": "Europe/London",
    "asciiname": "London",
    "admin1": " England",
    "tokens": ["London", " England", " United Kingdom"],
    "value": "London, England, United Kingdom",
    "timezoneValid": true,
    "currentTime": "2025-08-10T15:30:00+01:00"
  }
]
```

### 2. Single Human Design Chart
```http
GET /api/hd-data?date={iso_date}&timezone={timezone}
```

**Example:**
```bash
curl "http://localhost:3000/api/hd-data?date=1988-07-22T17:06:00&timezone=Europe/London"
```

**Response:** Full Human Design chart data matching humandesign.ai API format

### 3. Relationship/Composite Chart
```http
GET /api/hd-data-composite?date={iso_date}&timezone={timezone}&date1={iso_date}&timezone1={timezone}
```

**Example:**
```bash
curl "http://localhost:3000/api/hd-data-composite?date=1988-07-22T17:06:00&timezone=Europe/London&date1=1990-03-15T09:30:00&timezone1=America/New_York"
```

### 4. Health Check
```http
GET /api/health
```

Returns service status, uptime, and performance metrics.

## 🏗️ Architecture

### Core Components

**Server (`server.js`)**
- Express.js application with security middleware
- CORS configuration for cross-origin requests
- Request compression and logging
- Global error handling

**Routes**
- `/routes/health.js` - Service health monitoring
- `/routes/locations.js` - Geographic/timezone lookup
- `/routes/chart.js` - Human Design chart calculations

**Calculator (`lib/hdkit-calculator.js`)**
- Astronomical position calculations
- Human Design type and authority determination
- Channel and center activation logic
- Relationship compatibility analysis

### Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Security:** Helmet.js
- **Astronomy:** Swiss Ephemeris (planned)
- **Time/Timezone:** Moment.js with timezone support
- **Deployment:** Railway (configured)

## 🛠️ Development

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Environment Variables
```bash
# Optional - defaults to development
NODE_ENV=production

# Optional - defaults to 3000
PORT=3000
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test location search
curl "http://localhost:3000/api/locations?query=Tokyo"

# Test chart generation
curl "http://localhost:3000/api/hd-data?date=1988-07-22T17:06:00&timezone=Europe/London"
```

## 🔮 SAGE Vision

This API forms the foundation for **SAGE** (Self-learning Agent for Guidance and Execution), an AI-powered platform that will:

- **Analyze** user Human Design charts before they ask questions
- **Provide** proactive, personalized guidance based on current planetary influences
- **Learn** from user interactions to improve recommendations
- **Integrate** I Ching's 64 keys for deeper wisdom insights
- **Offer** conversational AI interface similar to Claude's clean design

### Planned Features

**Phase 1 - API Foundation** ✅
- [x] Core HD chart calculations
- [x] Relationship analysis
- [x] Location/timezone services
- [x] Railway deployment

**Phase 2 - AI Integration** 🔄
- [ ] Real-time planetary influence tracking
- [ ] Proactive user analysis
- [ ] I Ching integration
- [ ] Conversational AI interface

**Phase 3 - Platform Evolution** 📋
- [ ] User authentication & profiles
- [ ] Learning algorithms
- [ ] Mobile applications (Flutter)
- [ ] Custom domain deployment

## 🤝 Contributing

Built on the excellent foundation of [jdempcy/hdkit](https://github.com/jdempcy/hdkit). 

This project transforms the original Human Design toolkit into a modern API service while maintaining compatibility with established chart calculation methods.

## 📄 License

MIT License - see original [hdkit license](https://github.com/jdempcy/hdkit/blob/main/LICENSE)

---

**SAGE** - Bringing ancient wisdom into the age of AI 🔮✨