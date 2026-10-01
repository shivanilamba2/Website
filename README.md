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
4. To use a custom domain (e.g. shivlambda.com), add it under Settings → Pages and point your DNS at GitHub Pages.
