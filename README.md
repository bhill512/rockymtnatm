# Rocky Mountain ATM Services — Landing Page

This repository hosts the public landing page for **Rocky Mountain ATM Services** and deploys it using **Cloudflare Pages**.

## Quick edits

- **Hero image**:
  - The site includes a built-in stylized hero background: `assets/hero.svg`
  - To use a real photo, add it at `assets/hero.jpg` (it will automatically take precedence)
  - Keep the filename the same to avoid changing code.
  - Suggested size: ~2000px wide, optimized for web.

## Contact form (Formspree)

This site uses **Formspree** so customers can send a message directly from the modal (no backend).

1. Create a Formspree form at `https://formspree.io/`
2. Set the destination email to **owner@rockymtnatm.com**
3. Copy the Formspree endpoint URL (looks like `https://formspree.io/f/xxxxxxx`)
4. Paste it into [`script.js`](script.js) by setting:

```js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxx";
```

If you don’t set the endpoint, the form will show a “Setup needed” warning message when submitted.

## Deploy (Cloudflare Pages)

Repo target: **`bhill512/rockymtnatm`**

### 1) Push the repo to GitHub (if you haven’t already)

```bash
git init
git add .
git commit -m "Initial landing page"
git branch -M main
git remote add origin git@github.com:bhill512/rockymtnatm.git
git push -u origin main
```

### 2) Create a Cloudflare Pages project (recommended for this site)

In Cloudflare Dashboard:
- Go to **Workers & Pages → Pages → Create a project**
- Connect GitHub and select `bhill512/rockymtnatm`
- Framework preset: **None**
- Build command: **(leave empty)**
- Build output directory: **`/`** (the repo root)

After the first deploy, your site will have a `*.pages.dev` URL.

### 3) Attach your domain in Cloudflare Pages

Cloudflare Pages project → **Custom domains**:
- Add **`www.rockymtnatm.com`**
- Add **`rockymtnatm.com`**
- Set **`www.rockymtnatm.com`** as the primary, and enable the “redirect to primary domain” option (if shown).

Cloudflare will create/manage the needed DNS records and SSL automatically.

### Important: remove old GitHub Pages DNS records

If you previously pointed `@` or `www` at GitHub Pages IPs (`185.199.x.x`), remove those DNS records so Cloudflare Pages can manage them cleanly.


