# Brand Baaja Baraat — Backend

Serverless API backend for the BBB brand intelligence tool.  
Built with Vercel Functions + Anthropic SDK.

---

## Deploy in 5 minutes

### 1. Push this folder to a new GitHub repo

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/bbb-backend.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `bbb-backend` GitHub repo
3. Vercel auto-detects it — click **Deploy**

### 3. Add your API key

In the Vercel dashboard → your project → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |

Then **Redeploy** (Deployments tab → the latest → Redeploy).

### 4. Update the frontend

In `index.html`, find this line:

```js
const res = await fetch('https://bbb-backend.vercel.app/api/analyse', {
```

Replace `bbb-backend.vercel.app` with your actual Vercel URL (shown in the dashboard after deploy).

### 5. Update the CORS allowed origin

In `api/analyse.js`, update line 5:

```js
'https://captainfuzzybeard.github.io',  // ← your GitHub Pages URL
```

Redeploy after saving.

---

## Local dev

```bash
npm install
npx vercel dev
```

Creates a local server at `http://localhost:3000`. You'll need a `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

---

## How it works

```
Browser (GitHub Pages)
  → POST /api/analyse  { prompt, mode }
      ↓
Vercel Function (this repo)
  → Anthropic API (key hidden on server)
      ↓
  ← { result: { ... } }
      ↓
Browser renders analysis
```

The Anthropic API key **never touches the browser**. Users just visit the GitHub Pages site and use it freely.
