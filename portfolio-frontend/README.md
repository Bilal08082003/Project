# Muhammad Bilal — Portfolio Frontend

A premium dark futuristic AI-themed portfolio website.

## 📁 Folder Structure

```
portfolio-frontend/
├── index.html        ← Main HTML (open this in browser)
├── css/
│   └── style.css     ← All styles (dark/light mode, animations)
├── js/
│   └── main.js       ← All JS (canvas, cursor, forms, APIs)
└── README.md
```

## 🚀 How to Run

### Option 1 — Open Directly (No Backend)
Just open `index.html` in your browser. All animations work.
Forms will show demo success messages without a backend.

### Option 2 — With Backend (Full Features)
1. Start your backend: `cd portfolio-backend && npm run dev`
2. Open `index.html` — forms now submit to real API

### Option 3 — Live Server (Recommended for Dev)
```bash
# Install VS Code Live Server extension, then right-click index.html → Open with Live Server
```

## 🔧 Change Backend URL

In `js/main.js`, line 7:
```js
const API_BASE = 'http://localhost:5000/api'; // ← Change this for production
```

Replace with your deployed backend URL, e.g.:
```js
const API_BASE = 'https://your-api.railway.app/api';
```

## 🎨 Features

- ✅ Interactive particle canvas with hexagons (mouse-reactive)
- ✅ Custom dual-ring cursor with hover effects
- ✅ Typing animation (5 rotating roles)
- ✅ Animated counter stats
- ✅ Scroll-triggered skill bar animations
- ✅ Project filter by category
- ✅ Star rating review form
- ✅ Contact form with backend integration
- ✅ Dark / Light mode toggle (saved to localStorage)
- ✅ Floating WhatsApp button
- ✅ Scroll-to-top button
- ✅ Live visitor counter from API
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Mobile hamburger navigation

## 🌐 Deploy Frontend

### Netlify (Free)
1. Drag & drop the `portfolio-frontend` folder to netlify.com/drop
2. Done — live in seconds!

### GitHub Pages
1. Push folder to GitHub repo
2. Go to Settings → Pages → Deploy from main branch
3. Your site is live at `https://yourusername.github.io/repo-name`

### Vercel
```bash
npm install -g vercel
cd portfolio-frontend
vercel
```

---
*Portfolio of Muhammad Bilal — BS Computer Science, AI Engineer & Full Stack Developer*
