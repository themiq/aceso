# Aceso

A long-form guide to looking after your mental health, plus a page of free resources. Plain HTML, CSS and JavaScript with no build step, hosted on GitHub Pages.

## Pages

- `index.html` is the guide: crisis lines by country, then sections on anxiety, depression, burnout, sleep, grief, self-talk, trauma, suicidal thoughts, getting help and more. It includes a breathing exercise, a 5-4-3-2-1 grounding exercise and a safety plan that saves only in the reader's browser.
- `why.html` is a short personal statement on mental health.
- `resources.html` lists around 150 resources by topic, with search and a free-only filter. Link to a topic directly with a hash, for example `resources.html#sleep`.

Both pages have a light and dark theme and a Quick exit button. Pressing Esc three times also leaves the site.

## Editing

See [EDITING.md](EDITING.md) for a step-by-step guide. In short:


- Guide text lives in `index.html`. The table of contents builds itself from each `<section data-section>` and its `<h2>`.
- Citations number themselves in order of first appearance. See `EDITING.md`.
- Resources live in `js/resources.js`. Add a line like this to the list:

  ```js
  ["Name", "https://example.org/", "One or two plain sentences about it.", "sleep", ["free", "app"]],
  ```

  Topic keys and their intros are defined at the top of the same file.
- Styles are in `css/style.css`. Shared behaviour is in `js/app.js`, and the resources page filter is in `js/library.js`.

## Link checking

`.github/workflows/links.yml` checks every external link on each push to `main` and every Monday. Failures show up in the Actions tab.

## Disclaimer

Aceso isn't a medical service. If you're in danger, contact your local emergency number or a crisis line.
