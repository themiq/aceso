# 🌱 Aceso

**A cozy little guide for hard days.** A free, single-page mental health guide with a warm, hand-drawn, animated style. Named after the Greek goddess of the *healing process*.

## What's inside

- **Help now**: crisis lines for the US, UK, Ireland, Canada, Australia, NZ, India and worldwide, filterable by region
- **Inner weather check-in**: pick a feeling as weather and get gentle next steps
- **Calm-down toolbox**: breathing bubble (4 patterns), 5-4-3-2-1 grounding, a kind notes jar, a tiny wins garden, and a "check the basics" self-care walkthrough
- **The guide**: 18 chapters (anxiety, depression, burnout, sleep, grief, the inner critic, trauma, suicidal thoughts, identity, money, getting help, helping others and more), each with a short version, things to try and resources
- **Myths, busted**: flip cards
- **Safety plan builder**: saved only in the visitor's browser, printable and downloadable
- **The library**: 150+ searchable, filterable resources, many from [FMHY](https://fmhy.net/misc#mental-health)
- Day/night theme, a pause-animations button, respects reduced-motion, **Quick Exit** button (or press Esc three times)

There's no tracking, no cookies and no build step. It's plain HTML, CSS and JS.

## Files

```
index.html          the whole page (hero scene, sections, guide chapters)
css/style.css       all styling and animation
js/app.js           interactive tools
js/resources.js     the resource library (edit this to add/remove links)
```

## Deploy to GitHub Pages

1. Create a new repo on GitHub (e.g. `aceso`) and push this folder to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then pick `main` and `/ (root)`.
3. Your site will appear at `https://<your-username>.github.io/aceso/` within a minute or two.

## Adding resources

Add a line to `js/resources.js`:

```js
["Name", "https://example.org/", "Short friendly description.", "calm", ["free", "app"]],
```

Categories are listed at the top of that file. The `"pick"` tag marks a ★ cozy pick.

## Keeping links fresh

`.github/workflows/links.yml` checks every link on each push and every Monday. If a link breaks, the Actions tab will flag it.

## Disclaimer

Aceso is a friendly guide, not a medical service. If you're in danger, contact your local emergency number or a crisis line.
