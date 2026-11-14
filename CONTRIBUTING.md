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
  - **Content check**: runs `node scripts/check-content.mjs` (lesson registry, relative links, drill data, VERSION ↔ CHANGELOG)

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

- Lessons live in `lessons/NN-name.md`. Add new lessons to `LESSONS` in `assets/app.js`.
- Write Japanese as **script · romaji · meaning**. The website makes any Japanese script clickable for audio.
- The flashcard drill reads the kana chart and the `| Sign | Reading | Meaning |` tables in
  `lessons/02-writing.md`. Keep that table format if you edit them.
