# Rocky Mountain ATM Services — Landing Page

This repository hosts the public landing page for **Rocky Mountain ATM Services** and deploys it to **GitHub Pages** via **GitHub Actions**.

## Quick edits

- **Hero image**: add a real JPG photo of the Rocky Mountains at `assets/hero.jpg`.
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

## Deploy (GitHub Pages via Actions)

Repo target: **`bhill512/rockymtnatm`**

1. Push this repo to GitHub (example commands):

```bash
git init
git add .
git commit -m "Initial landing page"
git branch -M main
git remote add origin git@github.com:bhill512/rockymtnatm.git
git push -u origin main
```

2. In GitHub: **Settings → Pages**
   - Source: **GitHub Actions**
3. In GitHub: **Settings → Pages → Custom domain**
   - Set to: **`www.rockymtnatm.com`**
4. After DNS is in place and GitHub issues the certificate, enable **Enforce HTTPS**.

## Cloudflare setup (connect `rockymtnatm.com`)

Canonical domain: **`www.rockymtnatm.com`**

### DNS records

In Cloudflare DNS, create:

- `CNAME` **www** → `bhill512.github.io` (set to **DNS only**, not proxied)
- `CNAME` **@** → `bhill512.github.io` (set to **DNS only**, not proxied)

### Redirect apex → www

Create a **Redirect Rule** (or Page Rule) to force the apex domain to the canonical `www` domain:

- From: `rockymtnatm.com/*`
- To: `https://www.rockymtnatm.com/$1`
- Status: **301**

### SSL/TLS

- In Cloudflare **SSL/TLS**, use a safe standard mode (commonly **Full**).
- Turn on “Always Use HTTPS” only after `https://www.rockymtnatm.com` is working properly.


