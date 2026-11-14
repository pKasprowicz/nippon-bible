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
stays visible in the history. With the [git-flow](https://github.com/nvie/gitflow)
extension installed, run `git flow init -d` once; the defaults match this table
(version tag prefix `v`).

## Making a release

1. `git flow release start 1.1.0` (or `git checkout -b release/1.1.0 develop`)
2. Update `VERSION` and add a `## [1.1.0] - YYYY-MM-DD` section to `CHANGELOG.md`
3. `git flow release finish 1.1.0` merges into `main`, tags `v1.1.0` and merges back into `develop`
4. `git push origin main develop --follow-tags`

Pushing the tag runs `.github/workflows/release.yml`, which creates the GitHub
release from the matching `CHANGELOG.md` section. If you can't push tags, run the
**Publish GitHub release** workflow by hand (Actions → Run workflow) with the
version number. It creates the `vX.Y.Z` tag on `main` and the release. Pushing `main` runs
`.github/workflows/pages.yml`, which deploys the website.

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
