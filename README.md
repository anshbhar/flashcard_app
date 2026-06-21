# FlashMind — Active Recall Flashcard App

> A production-ready, zero-cost Active Recall Flashcard web application built with **React + Vite + Tailwind CSS**, using 100% `localStorage` for data persistence.

[![Built for Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-f59e0b?style=for-the-badge&logo=star)](https://digitalheroesco.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Zero Cost](https://img.shields.io/badge/Cost-₹0%20Spent-green?style=for-the-badge)](.)

---

## 🌐 Live Demo

> **[View Live App →](https://your-live-vercel-url.vercel.app)**  
> *(Replace with your actual Vercel deployment URL after deploying)*

---

## 👤 Developer

**Developer:** Ansh Bhardwaj  
**Contact:** anshb120207@gmail.com

---

## ✅ Submission Checklist

| Requirement | Status |
|---|---|
| ✅ The tool works and gives correct output | Done |
| ✅ "Built for Digital Heroes" button linking to digitalheroesco.com | Done — visible in footer |
| ✅ Developer full name & email visible on the page | Done — permanent footer |
| ✅ Live deployment on Vercel free plan | See live URL above |
| ✅ Public GitHub repo | This repository |
| ✅ Zero cost — ₹0 spent, no paid subscriptions | 100% free stack |

---

## 🚀 Features

### Core Flashcard Engine
- **Card Creation** — Clean form with question/answer fields and empty-field validation
- **Pre-populated Deck** — 3 sample academic cards loaded on first use (localStorage empty)
- **Deck Management** — View all cards with delete functionality
- **localStorage Persistence** — All data stored natively in the browser; zero backend required

### Active Recall Study Engine
- **3D Card Flip Animation** — Fluid CSS `transform: rotateY(180deg)` flip on click
- **Performance Tracking** — "Got It Right" (green) / "Need to Review" (amber) buttons
- **Progress Bar** — Live indicator: "Card X of Y | Z% Complete"
- **Session Flow** — Seamless transitions between cards with flip-back animation

### Session Summary
- **Percentage Score** — Based on cards marked "Got It Right"
- **Review List** — Filtered list of all cards marked "Need to Review"
- **Reset & Restart** — One-click session reset back to Card 1

### Mandatory Requirements
- **Footer:** `Developer: Ansh Bhardwaj | Contact: anshb120207@gmail.com`
- **Badge:** `Built for Digital Heroes` → [https://digitalheroesco.com](https://digitalheroesco.com)

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State | React useState / useCallback |
| Persistence | Browser localStorage API |
| Deployment | Vercel (Free Plan) |
| Cost | ₹0 |

---

## 🛠 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/flashcard-app.git
cd flashcard-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 📦 Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Vercel auto-detects **Vite** — no config needed
5. Click **Deploy** — live in ~60 seconds

---

## 📁 Project Structure

```
flashcard-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main app with all components
│   ├── index.css        # Tailwind + custom CSS (3D flip, glassmorphism)
│   └── main.jsx         # React entry point
├── index.html           # HTML entry point with SEO metadata
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## 🔐 Architecture & Zero-Cost Design

- **No backend** — Pure static SPA
- **No API keys** — Zero external service dependencies  
- **No database** — All card data, session scores, and review lists live in `localStorage`
- **No paid hosting** — Deployed on Vercel's free Hobby plan
- **Total cost: ₹0**

---

*Built with ❤️ by Ansh Bhardwaj for Digital Heroes*
