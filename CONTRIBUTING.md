# Contributing

This repository uses **git flow**.

## Branches

| Branch | Purpose | Branches off | Merges into |
|--------|---------|--------------|-------------|
| `main` | Released versions only. Every push deploys the website to GitHub Pages. | – | – |
| `develop` | Integration branch for the next release | `main` | `release/*` |
| `feature/<name>` | New lessons, site features, fixes for the next release | `develop` | `develop` |
| `release/<x.y.z>` | Release preparation: version bump, changelog, final proofreading | `develop` | `main` **and** `develop` |
| `hotfix/<x.y.z>` | Urgent fix to the live version | `main` | `main` **and** `develop` |

Use `--no-ff` merges (or pull requests) so each feature, release and hotfix
stays visible in the history. Because `main` and `develop` are protected, all merges
into them go through pull requests (see below).

## Branch protection

`main` and `develop` are protected by the ruleset in
[`.github/rulesets/protect-main-develop.json`](.github/rulesets/protect-main-develop.json):

- no direct pushes: every change arrives through a **pull request**, merged with a **merge commit**
- no force pushes, and the branches can't be deleted
- the **PR checks** workflow must pass:
  - **Git flow branch policy**: `main` accepts only `release/x.y.z` and `hotfix/x.y.z`;
    `develop` accepts `feature/*`, `release/*`, `hotfix/*` and `main` (the merge-back after a release)
  - **Content check**: runs `node scripts/check-content.mjs` (page registry, relative links, drill data,
    kana exercise syntax and unit order, VERSION ↔ CHANGELOG)

No approving review is required, so the owner can merge their own PRs.

To apply or update the ruleset: **Settings → Rules → Rulesets → New ruleset → Import a ruleset**,
then choose the JSON file.

## Making a release

1. Create `release/1.2.0` from `develop`.
2. Update `VERSION` and rename `## [Unreleased]` to `## [1.2.0] - YYYY-MM-DD` in `CHANGELOG.md`.
3. Open a PR **`release/1.2.0` → `main`** and merge it once the checks pass. This deploys the website.
4. Open a PR **`main` → `develop`** and merge it, so `develop` gets the release commit.
5. Tag the release: push `v1.2.0` on the `main` merge commit, or run the
   **Publish GitHub release** workflow by hand (Actions → Run workflow) with version `1.2.0`
   and target `main`. Either way, `.github/workflows/release.yml` creates the GitHub release
   from the matching `CHANGELOG.md` section.

Hotfixes work the same way, starting from `main` as `hotfix/1.2.1`.

Versions follow [Semantic Versioning](https://semver.org/): a new lesson or site
feature is a minor bump, and corrections are a patch bump.

## Previewing the site locally

The site fetches the Markdown files, so it needs an HTTP server rather than `file://`:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Content conventions

- The Japan guide lives in `lessons/NN-name.md` (`00-guide.md` is its overview), and the kana courses in
  `hiragana/NN-name.md`, `katakana/NN-name.md` and `kanji/NN-name.md`. Register
  every page in `LESSONS` in `assets/app.js` (id, file, group, title).
- Use `##` for a lesson's main sections and `###` for subsections. The site builds each lesson's
  contents navigation from them, so keep headings short. To link to a section, use the GitHub
  anchor (`06-subways.md#2-tokyo`); the link works on GitHub and on the site.
- Write Japanese as **script · romaji · meaning**. The website makes any Japanese script clickable for audio.
- The flashcard drill reads the kana chart and the `| Sign | Reading | Meaning |` tables in
  `lessons/02-writing.md`. Keep that table format if you edit them.

## Cuisine handbook

The handbook lives in `cuisine/NN-name.md` (`00-start.md`, chapters `01`–`14`, `15-glossary.md`,
`16-sources.md`). Its rules are stricter than the language courses':

- **Only checked sources.** Every factual statement needs a citation, such as `(Kurihara 2015)`, to a
  source in the chapter's `## Sources for this chapter` list. Use peer-reviewed research
  (J-STAGE, PubMed Central, journals), official bodies (MAFF, EFSA…) or producers' technical and
  educational bodies. Don't cite Wikipedia, blogs or recipe sites. If a source is only an abstract,
  say so in the list. Add new sources to `16-sources.md` too.
- **Don't fill gaps.** When the sources disagree, give both. When they say nothing, say so.
- **Each chapter ends** with a ` ```quiz ` block (one answer marked `*` per question) and its source list.
- **Images** go in `cuisine/img/` and must be public domain, CC0, CC BY or CC BY-SA. Write them as HTML
  so the caption can carry the credit:

  ```html
  <figure>
  <img src="img/kombu-drying.jpg" alt="What the photo shows">
  <figcaption>Caption. <span class="credit">Photo: Author, <a href="…">CC BY-SA 4.0</a>, via <a href="…">Wikimedia Commons</a>.</span></figcaption>
  </figure>
  ```

  Then add the image to the **Image credits** table in `16-sources.md`. `scripts/check-content.mjs`
  fails if an image is missing, unused, without alt text, or not credited.

- **Molecule diagrams** (`cuisine/img/mol-*.svg`) are generated by `scripts/diagrams/draw.py`
  (`pip install rdkit`, then `python3 scripts/diagrams/draw.py`). Structures come from PubChem; the
  records used are cached in `scripts/diagrams/pubchem.json`. Write a diagram as
  `<figure class="diagram">`, cite the chemistry in the caption, link the PubChem records in the
  credit, and list it under **Molecule diagrams** in `16-sources.md`.
- **Further-reading links** go to Wikipedia (`https://en.wikipedia.org/wiki/…`) or PubChem, at a term's
  first appearance in a chapter. Check that the article exists and is not a disambiguation page.
  They are background only: never cite Wikipedia as a source, and never put it in a source list
  (the content check enforces this).

## Folklore handbook

The folklore handbook lives in `folklore/NN-name.md` (`00-start.md`, chapters `01`–`13`,
`14-glossary.md`, `15-sources.md`) and follows the same rules as the cuisine handbook: every claim
cited to a source in the chapter's source list, a quiz per chapter, credited images in `folklore/img/`.
Three kinds of source are accepted: peer-reviewed scholarship (for example the *Japanese Journal of
Religious Studies*), primary texts in public-domain editions (quoted as what they are: one writer's
record), and official bodies. Folklore varies by place and period, so say where and when a belief was
recorded rather than presenting it as what "the Japanese" believe. The explanatory diagrams
(`folklore/img/dia-*.svg`) are generated by `scripts/diagrams/folklore.py`.

## Pop culture handbook

The pop culture handbook lives in `popculture/NN-name.md` (`00-start.md`, chapters `01`–`14`,
`15-glossary.md`, `16-sources.md`) and follows the same rules as the other handbooks: every claim
cited to a source in the chapter's source list, a quiz per chapter, credited images in `popculture/img/`.
Accepted sources are scholarship (J-STAGE, Nichibunken, the *Electronic Journal of Contemporary
Japanese Studies* and similar), official bodies and industry associations (National Film Archive of
Japan, Eiren, the Association of Japanese Animations, the Cabinet Office) and the official pages of
festivals, museums and organisers. Give every figure, price and rule with its date. Never reproduce
manga panels, anime stills, game screens or character designs, and leave out photographs in which
copyrighted characters are prominent. The explanatory diagrams (`popculture/img/dia-*.svg`) are
generated by `scripts/diagrams/popculture.py`.

## Signs gallery

`signs/00-gallery.md` holds a ```` ```gallery ```` block, which the app renders from
`assets/signs/photos.json`. The photos live in `assets/signs/` so later lessons can reuse them:
each one as `name.jpg` plus a 400×300 crop in `assets/signs/thumbs/name.jpg`. Every entry in
`photos.json` needs `file`, `w`, `h`, `kind` (one of the `kinds`), `title`, `author`, `license` and
`source`; `ja` (the main Japanese text, exactly as on the sign), `note` (reading and meaning), `place`
and `date` are optional. Use only photos that are public domain or CC0 on Wikimedia Commons
(`source` is the Commons file page), and leave out signs whose artwork, characters or posters
could be someone else's copyright. Transcribe only text you can read clearly in the photo.
`scripts/check-content.mjs` checks licences, credits and that every file is listed and present.

## Offline app (PWA)

The site is an installable web app that works offline:

- `manifest.webmanifest` and `assets/icons/` make it installable (Android Chrome turns it into an app
  with a launcher icon; iOS uses *Add to Home Screen*).
- `sw.js` is a service worker. On install it saves every file listed in `precache.json`, then serves
  the site from that cache; Google Fonts are cached as they are used.
- The deploy runs `node scripts/build-offline.mjs _site`, which writes `precache.json` (every published
  file with a hash of its contents) and stamps `BUILD = '__BUILD__'` in `sw.js` with a hash of the whole
  site. An update copies unchanged files from the previous cache and downloads only changed files,
  each from `file?v=<hash>` so the CDN can't hand out an old copy. Any content change gives
  a new service worker; it downloads the new version in the background. If it finishes while the
  app is in use the page shows a *Reload* bar; an update still waiting at the next start-up is
  applied straight away. The page also checks for updates every 30 minutes and when brought back
  to the foreground. Keep the placeholder in `sw.js`, and don't commit `precache.json`.
- New files and folders are picked up automatically. To try it locally, copy the published files to a
  folder, run the script on that folder and serve it (service workers need `localhost` or HTTPS).

## Search

The search page (`#/search/<query>`, in `assets/app.js`) scans `search-index.json`, which the deploy
builds with `node scripts/build-search.mjs _site`:

- Every page in `LESSONS` is rendered with the site's own `marked` and split at its `##`/`###`
  headings, with the same heading slugs as the app, so each result opens its section.
- The contents of `words`, `station` and `contrast` blocks are indexed; quizzes, drills and games are not.
- The search is a plain substring match that ignores case and Latin accents (*ramen* finds *rāmen*),
  so kana and kanji need no word splitting. Every word typed must appear; headings rank first, and
  the sources pages last.
- New pages are indexed automatically. `scripts/check-content.mjs` checks that every page has
  indexed text and that no two sections share a link.
- To try it locally, run `node scripts/build-search.mjs .` and serve the folder. Don't commit
  `search-index.json`.

## Progress and sync

All progress is in `localStorage`: `nb-done` (completed pages), `nb-hira`, `nb-kata` and `nb-kanji` (review deck, game stats,
best scores, streak days; format `v: 2`), plus per-device preferences `nb-theme` and `nb-deck`.
`assets/progress.js` packs the first three into a compact, deflate-compressed, base64url code for transfer links
(`#/import/<code>`) and files, and merges imports. If you add a field to saved progress, add it to the
compact form and the merge rules there too, and bump the format version if old codes can't express it.

## Kana course exercises

Character data (readings, memory aids, look-alikes, which unit teaches what, the grid layout)
lives in `assets/hiragana-data.js`, `assets/katakana-data.js` and `assets/kanji-data.js`. The exercise
engine, `assets/kana-engine.js`, runs one instance per script, so each course keeps its own progress
(`nb-hira` / `nb-kata` / `nb-kanji` in localStorage). Kanji entries also carry a `meaning`, other
accepted readings (`alt`) and a kana reading for audio (`say`); that enables the `meaning` and `find`
question modes. In the kanji course, the unit-order check applies to kanji only: sign words may contain any kana. The site picks the engine from the page's group in
`LESSONS`. The home page (three tiles) is built in `showHome()` in `assets/app.js`. Pages embed exercises
as fenced code blocks, which the website turns into interactive widgets (on GitHub they show as
plain text):

| Block | Content | Purpose |
|-------|---------|---------|
| ` ```cards ` | `kana: かきくけこ` | Character cards with memory aid and audio |
| ` ```practice ` | `kana:` targets, `mix:` earlier characters, `modes: see,pick,listen,type` (kanji also `meaning`, `find`), `count:`, optional `timer: 60` (speed round), `checkpoint: yes` (90% marks the unit complete), `title:` | Kana drill; adds the targets to the daily review |
| ` ```words ` | rows `kana \| romaji \| meaning \| optional context`, optional `mode: listen` or `mode: meaning` (pick the meaning; needs 4+ words), `title:` | Read (type), listen-and-choose, or guess-the-meaning for real words |
| ` ```station ` | rows `kana \| romaji \| kanji \| prev \| next`, optional `color:` | Read a station sign |
| ` ```contrast ` | rows `き さ \| cue` | Look-alike discrimination |
| ` ```quiz ` | `? question`, `- option` (mark the right one with `*`), `> explanation` | Multiple-choice questions |
| ` ```game ` | `unit: N` (every character from units 1–N, with unit N's new ones boosted) or `pool: learned` (the review deck), `modes:`, `title:` | Endless adaptive game with live per-character proficiency |
| ` ```review `, ` ```map `, ` ```reset ` | empty | Daily spaced review, progress map, progress reset |

In units 1–8, `cards`, `practice`, `words` and `station` blocks may only use characters taught in
that unit or earlier. The content check enforces this, and it also checks the block syntax.
