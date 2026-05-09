# Muhammad Bilal — Portfolio Backend API

Production-level REST API built with Node.js, Express.js, and MongoDB.

---

## 🏗️ Project Structure

```
portfolio-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Admin login, JWT
│   │   ├── aboutController.js   # Profile data
│   │   ├── projectController.js # CRUD projects
│   │   ├── skillController.js   # CRUD skills
│   │   ├── reviewController.js  # Reviews + approval
│   │   ├── contactController.js # Contact form
│   │   └── visitorController.js # Analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT protect + adminOnly
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── validate.js          # express-validator runner
│   │   └── visitorTracker.js    # Visitor analytics middleware
│   ├── models/
│   │   ├── Admin.js             # Admin user schema
│   │   ├── About.js             # Profile/about schema
│   │   ├── Project.js           # Project schema
│   │   ├── Skill.js             # Skill schema
│   │   ├── Review.js            # Testimonial schema
│   │   ├── Contact.js           # Contact message schema
│   │   └── Visitor.js           # Visitor + Analytics schemas
│   ├── routes/
│   │   ├── auth.js              # /api/auth/*
│   │   ├── public.js            # /api/* (public)
│   │   └── admin.js             # /api/admin/* (protected)
│   ├── services/
│   │   └── emailService.js      # Nodemailer email sending
│   ├── utils/
│   │   └── seeder.js            # Database seeder
│   ├── app.js                   # Express app setup
│   └── server.js                # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Set up MongoDB
- **Local**: Install MongoDB and start with `mongod`
- **Cloud**: Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- Update `MONGO_URI` in `.env`

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/portfolio_db` |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | `your_super_secret_key_here` |
| `JWT_EXPIRE` | JWT expiry time | `7d` |
| `ADMIN_EMAIL` | Admin login email | `admin@portfolio.com` |
| `ADMIN_PASSWORD` | Admin login password | `Admin@2024!` |
| `EMAIL_USER` | Gmail address | `bilalsuleman780@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

---

### 🔓 Public Endpoints

#### About
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/about` | Get profile/about data |

#### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects?category=AI/ML` | Filter by category |
| GET | `/projects?featured=true` | Get featured projects |
| GET | `/projects/:id` | Get single project |

#### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills` | Get all skills (grouped by category) |

#### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | Get approved reviews + avg rating |
| POST | `/reviews` | Submit a new review |

**POST /reviews body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "role": "Senior Developer",
  "rating": 5,
  "message": "Excellent work on the AI project!"
}
```

#### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contact` | Submit contact form |

**POST /contact body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+923001234567",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

#### Visitors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/visitors/count` | Get public visitor count |

---

### 🔐 Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Admin login → returns JWT |
| GET | `/auth/me` | Get current admin (requires token) |
| PUT | `/auth/change-password` | Change admin password |

**POST /auth/login body:**
```json
{
  "email": "admin@portfolio.com",
  "password": "Admin@2024Secure!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { "id": "...", "name": "Muhammad Bilal", "email": "..." }
}
```

> Use token in header: `Authorization: Bearer <token>`

---

### 🛡️ Admin Endpoints (All require Authorization header)

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Summary stats |
| GET | `/admin/analytics?days=30` | Full analytics |

#### Profile Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/admin/about` | Update about/profile |

#### Project Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/projects` | Create project |
| PUT | `/admin/projects/:id` | Update project |
| DELETE | `/admin/projects/:id` | Delete project |

#### Skill Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/skills` | Add skill |
| PUT | `/admin/skills/:id` | Update skill |
| DELETE | `/admin/skills/:id` | Delete skill |

#### Review Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/reviews` | All reviews |
| GET | `/admin/reviews?status=pending` | Filter by status |
| PUT | `/admin/reviews/:id/approve` | Approve review |
| PUT | `/admin/reviews/:id/reject` | Reject review |
| DELETE | `/admin/reviews/:id` | Delete review |

#### Contact Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/contacts` | All messages |
| GET | `/admin/contacts?status=unread` | Unread messages |
| PUT | `/admin/contacts/:id/read` | Mark as read |
| PUT | `/admin/contacts/:id/status` | Update status |
| DELETE | `/admin/contacts/:id` | Delete message |

---

## 🚀 Deployment Guide

### Option 1: Railway (Recommended — Free Tier)
```bash
# 1. Push code to GitHub
git init && git add . && git commit -m "Initial backend"
git remote add origin https://github.com/yourusername/portfolio-backend
git push -u origin main

# 2. Go to railway.app → New Project → Deploy from GitHub
# 3. Add environment variables in Railway dashboard
# 4. Railway auto-detects Node.js and deploys
```

### Option 2: Render
```bash
# 1. Go to render.com → New Web Service
# 2. Connect GitHub repo
# 3. Build Command: npm install
# 4. Start Command: npm start
# 5. Add environment variables
```

### Option 3: VPS (DigitalOcean/Linode)
```bash
# On your VPS:
git clone <your-repo>
cd portfolio-backend
npm install
cp .env.example .env
# Edit .env
npm run seed

# Install PM2 for process management
npm install -g pm2
pm2 start src/server.js --name portfolio-api
pm2 save
pm2 startup
```

### MongoDB Atlas (Cloud Database)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free M0 cluster
3. Create database user
4. Add IP whitelist (0.0.0.0/0 for all)
5. Get connection string → update `MONGO_URI`

---

## 🛡️ Security Features

- ✅ **Helmet.js** — Secure HTTP headers
- ✅ **Rate limiting** — 100 req/15min (10 for auth)
- ✅ **MongoDB sanitization** — NoSQL injection prevention
- ✅ **XSS protection** — HTML sanitization
- ✅ **HPP** — HTTP parameter pollution prevention
- ✅ **bcrypt** — Password hashing (12 salt rounds)
- ✅ **JWT** — Stateless authentication
- ✅ **Input validation** — express-validator on all POST routes
- ✅ **CORS** — Restricted to client origin only

---

## 🧪 Test with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get projects
curl http://localhost:5000/api/projects

# Admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"Admin@2024Secure!"}'

# Submit review
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","rating":5,"message":"Great work!"}'
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| Security | Helmet, express-rate-limit, xss-clean |
| Validation | express-validator |

---

*Backend by Muhammad Bilal — BS Computer Science, 6th Semester*
