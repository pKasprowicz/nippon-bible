# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Chapter navigation on every lesson: a sticky "On this page" rail on wide screens that highlights the section being read, and a sticky section bar with a contents dropdown on tablets and phones
- Links to individual sections (`#/09-food/2-rice`), plus a link icon next to each heading. Links keep working after sections are renumbered, and GitHub-style anchors in Markdown links work on the site

## [1.2.0] - 2026-11-15

### Added
- Lesson 9, Food & dishes: the pantry (dashi, soy sauce, miso, mirin, kōji, wasabi, pickles); rice and sushi (styles, Edomae preparation, toppings, conveyor-belt sushi), donburi and rice balls; ramen (broth, tare, noodles, oil, toppings, regional styles), soba, udon and other noodles; cooking methods with tempura, tonkatsu, karaage, yakitori, yakiniku and wagyu grades, eel, okonomiyaki (Osaka vs Hiroshima), takoyaki, gyōza, hot pots and oden; soups, eggs, tofu and side dishes; seafood and delicacies; meal formats from teishoku to kaiseki and shōjin ryōri; sweets, tea, sake grades and other drinks; regional specialities; menu vocabulary, ordering phrases, dietary needs and allergen labels; practice questions
- Six food questions in the self-test and a food line on the cheat sheet
- Branch protection ruleset for `main` and `develop` (`.github/rulesets/protect-main-develop.json`)
- PR checks workflow: git flow branch policy and a content check (`scripts/check-content.mjs`)

### Changed
- Cheat sheet & self-test is now Lesson 10 (old `#/09-cheat-sheet` and `#/06-cheat-sheet` links redirect; saved progress carries over)
- The suggested study plan is now 10 days
- Releases now go through pull requests (see `CONTRIBUTING.md`)

## [1.1.0] - 2026-11-14

### Added
- Lesson 6, Subways in Tokyo & Osaka: line codes, platform displays, exits, fares and passes, transfer gates, through-running, Umeda/Namba name confusion, airport links
- Lesson 7, Customs & etiquette: meeting people, visiting homes, table manners, streets, trains, temples and shrines, onsen, toilets and shops, plus a do's & don'ts list
- Lesson 8, Tourist pitfalls: plugs, banned medicines, driving permits, peak seasons, cash, currency conversion, cover charges, touts, last trains, Shinkansen luggage, restaurants, crowds and safety
- Eight new self-test questions on getting around and customs

### Changed
- Cheat sheet & self-test is now Lesson 9 (old `#/06-cheat-sheet` links redirect)
- Lesson 5's short etiquette list is replaced by links to the new lessons

## [1.0.0] - 2026-11-14

First public release of the Japanese survival course for European travellers.

### Course
- Lesson 1, Pronunciation: vowels, long vowels, consonants, rhythm and common mistakes, with Japanese script for every example
- Lesson 2, Writing & recognition: the three scripts, a full kana chart, look-alike traps, katakana loanwords, radicals and about 60 sign kanji
- Lesson 3, Core words: numbers and prices, counters, pointing and question words, and about 100 everyday words
- Lesson 4, Phrases: essential phrases, eight sentence templates, and replies to what staff say
- Lesson 5, Situations: trains, taxis, hotels, restaurants, shopping, directions, temples, onsen, emergencies and etiquette
- Lesson 6: one-screen cheat sheet and a 20-question self-test

### Website
- Course site on GitHub Pages that renders the Markdown lessons
- Tap any Japanese text to hear it (browser speech synthesis)
- Progress tracking, light and dark theme, and a mobile layout
- Flashcard drill for hiragana, katakana and sign kanji

### Project
- Git flow branching model (see `CONTRIBUTING.md`)
- GitHub Actions: Pages deployment from `main`, and a GitHub release for each `v*` tag

[1.2.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.2.0
[1.1.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.1.0
[1.0.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.0.0
