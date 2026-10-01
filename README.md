# shivlambda — dance portfolio site

Static site (HTML/CSS/JS, no build step) for GitHub Pages.

## Pages
| Tab | File |
| --- | --- |
| About (home) | `index.html` |
| Portfolio | `portfolio.html` |
| Event Choreography | `choreography.html` |
| Book a Class | `classes.html` |
| Contact | `contact.html` |

The header, footer, booking link, email and Instagram are set once in the `SITE` object at the top of `assets/js/main.js`.
Any element with a `data-book` attribute becomes a "Book here" link to the booking URL.

## Preview locally
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080

## Adding media
- **Intro/hero video:** add `assets/video/intro.mp4` and follow the comment in the hero section of `index.html`.
  Keep it short (10–20 s), muted, 1080p, ideally under ~10 MB.
- **Wedding / event videos:** follow the comments in `choreography.html` (or upload them to YouTube and use a lightbox link like on the portfolio page).
- **Images:** put them in `assets/img/` (resize to ~1800px wide first: `sips -Z 1800 photo.jpg`).

## Deploy to GitHub Pages
1. Create a new public repo on GitHub, e.g. `shivlambda_site`.
2. From this folder:
   ```bash
   git init && git add . && git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/shivlambda_site.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
4. **Custom domain** — the `CNAME` file already contains `shivlambda.com`. In Settings → Pages, confirm the custom domain shows `shivlambda.com`.

## Point shivlambda.com at GitHub Pages (Squarespace Domains)
Doing this takes the Squarespace site offline at shivlambda.com, so do it once the GitHub site looks right at `https://<your-username>.github.io/shivlambda_site/`.

1. Squarespace → **Domains → shivlambda.com → DNS settings**.
2. Delete the Squarespace default records (the `@` A records pointing to 198.185.159.x / 198.49.23.x and the `www` CNAME to `ext-sq.squarespace.com`).
3. Add these records:

   | Host | Type | Data |
   | --- | --- | --- |
   | @ | A | 185.199.108.153 |
   | @ | A | 185.199.109.153 |
   | @ | A | 185.199.110.153 |
   | @ | A | 185.199.111.153 |
   | www | CNAME | `<your-username>.github.io` |

   Leave any MX/email records alone.
4. Wait for DNS to update (minutes to a few hours), then in GitHub Settings → Pages tick **Enforce HTTPS**.
5. Recommended: verify the domain under your GitHub account (Settings → Pages → Verified domains) so no one else can claim it.
