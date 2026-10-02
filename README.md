# Baydar Ahmed — Personal Portfolio & GDG Developer Advocate Application

A world-class, editorial, motion-driven personal portfolio website for **Baydar Ahmed**, Computer Science student at IST (Institute of Space Technology), Islamabad, and Founder of Alpha Labs. Designed for his application to Google Developer Groups (GDG) as a Developer Advocate.

---

## 🛠 Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS with CSS Variable Tokens
- **Typography**: `@fontsource/roboto-flex` (Variable Font) & `@fontsource/jetbrains-mono`
- **UI Animations**: `framer-motion` & `@studio-freight/lenis` (Smooth Scroll)
- **Hero Canvas Shader**: Raw WebGL Fragment Shader (`no three.js`) rendering a Living Contour Field of simplex noise isolines
- **Data Pipeline**: Automated build-time GitHub REST API sync (`scripts/sync-github.js`) + manual/LinkedIn projects override (`src/data/projects.manual.json`)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js >= 18.0.0
- pnpm / npm

### Installation & Server
```bash
# Install dependencies
pnpm install

# Sync GitHub Projects & Start Local Development Server
pnpm dev
```

The site will open at `http://localhost:5173/` (or `http://localhost:4321/`).

---

## 📂 Updating Portfolio Content & Projects

### 1. Personal & Contact Information
Edit [`src/data/site.ts`](file:///c:/Users/Baydar/Desktop/Portfolio%20Baydar/src/data/site.ts) to update:
- Email address (`email`)
- Bio & GDG Advocate statement (`aboutText`, `valueStatement`)
- Academic & Experience listings (`education`, `experience`, `community`)

### 2. Manual & LinkedIn Projects
Edit [`src/data/projects.manual.json`](file:///c:/Users/Baydar/Desktop/Portfolio%20Baydar/src/data/projects.manual.json) to add or modify projects that live on LinkedIn or private clients.

### 3. Automated GitHub Sync
Run the sync script to pull public repositories from `github.com/Baydar1122`:
```bash
pnpm sync
```

---

## 🎨 Customizing Theme Tokens & Colors

Design tokens are defined in [`src/styles/tokens.css`](file:///c:/Users/Baydar/Desktop/Portfolio%20Baydar/src/styles/tokens.css):

```css
:root {
  --bg: #F4F1EA;       /* Warm paper light background */
  --surface: #EBE7DD;  /* Surface card background */
  --ink: #0E0E0C;      /* Primary text color */
  --muted: #5C5C55;    /* Muted text color (WCAG AA compliant) */
  --line: #DCD7CC;     /* Hairline borders */
  --accent: #2F5BFF;   /* Cobalt accent color */
}
```

---

## ⚡ 2-Minute Deployment Guide

### Option A: Deploy to Netlify
1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Build Settings are pre-configured via `netlify.toml`:
   - **Build Command**: `pnpm run build`
   - **Publish Directory**: `dist`
3. Click **Deploy Site**.

### Option B: Deploy to Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework Preset will automatically detect **Vite**:
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**.
