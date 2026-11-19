# Editing Aceso

The site is plain HTML. There's no build step, so whatever you save is what goes live.

## The quickest way: edit on GitHub

1. Go to https://github.com/themiq/aceso.
2. Press the `.` key. This opens the repo in an editor in your browser (github.dev).
3. Open the file you want, make changes, then use the Source Control tab on the left (the branch icon). Write a short message and click **Commit & Push**.
4. The live site updates about a minute later.

For a one-line fix you can also open the file on GitHub and click the pencil icon.

The downside: you can't preview the page before it goes live.

## The comfortable way: edit on your computer with a preview

Use this if you'll be making regular or bigger changes.

1. Install [VS Code](https://code.visualstudio.com/) and [GitHub Desktop](https://desktop.github.com/).
2. In GitHub Desktop: **File → Clone repository → themiq/aceso**.
3. Open the folder in VS Code. Install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**. Your browser now shows the site and refreshes every time you save.
4. When you're happy, go back to GitHub Desktop, type a summary, click **Commit to main**, then **Push origin**.

## Where things are

| What | File |
| --- | --- |
| The guide | `index.html` |
| What I believe | `why.html` |
| Resources page intro | `resources.html` |
| The resources themselves | `js/resources.js` |
| Colours, fonts, spacing | `css/style.css` |

Search for the text you want to change (Ctrl+F or Cmd+F) and edit it in place. Keep the `<p>`, `</p>` and other tags around your text.

## Common jobs

**Edit a paragraph.** Find it and change the words between `<p>` and `</p>`. For a link, write `<a href="https://example.org/" target="_blank" rel="noopener">link text</a>`.

**Add a section to the guide.** Copy an existing `<section id="..." data-section> ... </section>` block, give it a new `id` (lowercase, no spaces) and a new `<h2>` heading. The contents list builds itself from the headings.

**Add a citation.** Put this right after the sentence it supports:

```html
<sup class="cite"><a href="#ref-smith2024"></a></sup>
```

Then add the source to the list under **Sources** at the bottom of `index.html`:

```html
<li id="ref-smith2024">Smith, J. (2024). Title of the paper. <em>Journal Name</em>, 1(2), 3&ndash;4.</li>
```

The `id` must match the `href` without the `#`. Leave the number blank: the page numbers citations and orders the list automatically.

**Add a resource.** In `js/resources.js`, copy a line inside the right topic and change it:

```js
["Name", "https://example.org/", "One or two plain sentences about it.", "sleep", ["free", "app"]],
```

The fourth item is the topic. The keys are listed at the top of the file (`crisis`, `calm`, `sleep` and so on). Tags can be `free`, `app`, `call`, `text`, `chat`, `community`, `open-source` or `paid`. Watch the commas and quotes: one missing comma breaks the whole list. If the resources page goes blank after an edit, that's almost always why.

**Add or change a crisis line.** In `index.html`, find the table under "If you're not safe right now" and copy a `<tr>` row. The `data-region` value (`us`, `uk`, `ie`, `ca`, `au`, `nz`, `in` or `intl`) controls which country filter shows it. Phone links look like `<a href="tel:116123">116 123</a>`.

**Change colours.** The colours are defined at the top of `css/style.css` under `:root` (light theme) and repeated below for dark mode. Change a value there and it changes everywhere.

## After you publish

The **Actions** tab on GitHub runs a link check on every push and every Monday. A red cross means a link is broken or a site was down; click into the run to see which one.
