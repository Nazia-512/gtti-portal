# 🚀 GitHub & Deployment Guide — GTTI Smart Portal

## Step 1: GitHub Par Upload Karna

### First Time Setup

```bash
# 1. GitHub account pe jao: https://github.com
# 2. New Repository banao: "gtti-smart-portal" naam se
# 3. Apne computer mein project folder open karo

# Terminal mein ye commands chalao:

cd gtti-smart-portal

# Git initialize karo
git init

# Saari files add karo
git add .

# First commit karo
git commit -m "🎓 Initial commit — GTTI Smart Portal v1.0"

# GitHub se connect karo (apna username dalo)
git remote add origin https://github.com/YOUR_USERNAME/gtti-smart-portal.git

# Push karo
git branch -M main
git push -u origin main
```

---

## Step 2: Anthropic API Key Lena

1. Jao: https://console.anthropic.com
2. Account banao ya login karo
3. "API Keys" section mein jao
4. "Create Key" click karo
5. Key copy karo (sk-ant-... se shuru hogi)

---

## Step 3: .env File Setup

```bash
# Project folder mein .env file banao:
cp .env.example .env

# .env file mein ye dalo:
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
NEXTAUTH_SECRET=gtti-portal-secret-2024
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

---

## Step 4: Development Server Chalana

```bash
# Dependencies install karo
npm install

# Database setup karo
npx prisma generate
npx prisma db push

# Development server start karo
npm run dev

# Browser mein kholo: http://localhost:3000
```

---

## Step 5: Vercel Pe Deploy Karna (Free Hosting)

```bash
# 1. Vercel account banao: https://vercel.com
# 2. GitHub account se connect karo
# 3. "New Project" click karo
# 4. Apna gtti-smart-portal repo select karo
# 5. Environment Variables mein ye add karo:
#    - ANTHROPIC_API_KEY = your_key_here
#    - NEXTAUTH_SECRET = any_random_string
#    - NEXTAUTH_URL = https://your-app.vercel.app
#    - DATABASE_URL = file:./dev.db
# 6. "Deploy" click karo!
```

**Your portal will be live at:** `https://gtti-smart-portal.vercel.app` 🎉

---

## Future Updates GitHub Pe Kaise Upload Karein

```bash
# Jab bhi koi change karo:
git add .
git commit -m "✨ Add new feature: [feature name]"
git push
```

Vercel automatically re-deploy karega! ✅

---

## 🆘 Common Problems & Solutions

| Problem | Solution |
|---|---|
| `npm install` error | Node.js version 18+ install karo |
| API Key kaam nahi kar raha | `.env` file mein check karo, quotes na lagao |
| Database error | `npx prisma db push` dobara chalao |
| Port already in use | `npm run dev -- -p 3001` try karo |

---

## 📞 Help Chahiye?

GTTI Placement Office se rabta karein ya GitHub Issues mein report karein.
