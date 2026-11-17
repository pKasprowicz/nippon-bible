# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Sync progress** page (sidebar and home page): move your progress between devices without an account or server
  - Send it as a transfer link (copy or the phone share sheet) or as a downloaded file; receive it by opening the link, pasting it, or opening the file
  - The progress travels inside the link's `#` fragment, which browsers never send to a server, so nothing is uploaded anywhere
  - A preview shows what the link contains before anything changes; importing merges with this device's progress. Completed pages: done on either device counts. Review items: the most recently practised copy wins. Game stats: more answers wins. Best scores: higher wins. Streak days: combined
  - Damaged or cut-off links, and files from a newer version, get a clear message instead of a failed import

### Changed
- Review items now record when they were last practised (`last`), and saved progress carries a format version (`v: 2`). Older progress keeps working.

## [1.7.0] - 2026-11-16

### Added
- Previous / next navigation on every page, in content order across all three courses (Japan guide → Hiragana course → Katakana course):
  - A compact bar at the top showing where you are ("Hiragana course · Unit 3 · 4 of 10") with ‹ Previous and Next › links
  - Previous and next cards at the bottom, naming the page and, when you move into another course, that course. The first and last pages link back to Home

### Changed
- The single "Next" button at the end of each page is replaced by the previous/next cards
## [1.6.1] - 2026-11-16

### Fixed
- The lesson menu (☰) couldn't be scrolled on phones, so lessons near the bottom of the list were unreachable. The drawer kept `align-self: start` from the desktop layout, which current browsers apply to fixed elements, so it grew to its full content height instead of fitting the screen. It now stretches to the screen height (using `dvh` for mobile browser toolbars).
- Swiping past the end of the lesson menu or the "On this page" list no longer scrolls the page behind it.

## [1.6.0] - 2026-11-16

### Added
- **Katakana course**, a new section: a start page, 8 units, real-world reading and a final test, and a daily review with free play
  - Original memory aids linking each katakana to its hiragana twin or source kanji, for 46 basic characters, 25 voiced variants, 33 combinations and 11 extra sounds for foreign words (ティ, ファ, チェ…)
  - The long-vowel bar ー from Unit 1, so real loanwords appear from the start
  - Katakana-specific content: how English becomes katakana, made-in-Japan English (コンセント, サラリーマン), European words in Japanese (パン, アルバイト), European countries and capitals, café menus, shop names, hotel and station signs, and names in katakana
  - All exercise types from the Hiragana course, plus a new "guess the meaning" word mode
- **New home page** with three tiles (Japan guide, Hiragana course, Katakana course), each showing your progress and a link to continue where you left off
- Japan guide overview page; sidebar groups "Japan guide", "Hiragana course" and "Katakana course"

### Changed
- The exercise engine (`assets/kana-engine.js`) now serves both scripts, with separate saved progress
- The README is a short map of the three parts; the guide's lesson list and study plan moved to the guide overview
- Old `#/overview` links redirect to the guide overview
- The deploy check also requires the `katakana/` folder

### Fixed
- Changelog for 1.5.0: missed characters in the endless game come back 3–5 questions later (it said 3–4)

## [1.5.0] - 2026-11-16

### Added
- **Endless game** at the end of every hiragana unit, plus "Free play" on the Daily review page
  - Checkpoint-style questions that never run out, covering every character taught so far
  - Adaptive selection: weak, slow and unseen characters come up more often, the unit's new characters get extra turns, and missed ones come back 3–5 questions later
  - A live statistics panel that updates after every answer: answered, accuracy, streak (with best), average answer time, overall proficiency, focus characters, and a per-character proficiency grid
  - Proficiency is saved per character in the browser, so it carries across units and visits; an end-of-game summary shows improvements and newly mastered characters

## [1.4.1] - 2026-11-15

### Fixed
- Hiragana course pages didn't load on the website: the deploy workflow copied a fixed list of folders and missed `hiragana/`. It now publishes every tracked file except CI and tooling.

## [1.4.0] - 2026-11-15

### Added
- **Hiragana course**, a new section of the site: a start page, 8 units, real-world reading and a final test, and a daily review page
  - Character cards with original memory aids and audio for all 46 basic hiragana, 25 voiced variants and 33 combinations
  - Exercises: guess-first quizzes, practice that moves from reading to finding to listening to typing, look-alike contrast drills, real-word reading with hints, listen-and-choose minimal pairs, station-sign reading, timed speed rounds, and unit checkpoints (90% marks a unit complete)
  - Spaced repetition: practised characters and words go into a Leitner-style daily review (1, 2, 4, 8, 16 and 32 days), with a progress map and a day streak, stored in the browser only
  - Each unit's words and signs use only characters taught so far; the content check enforces it
- Sidebar groups: "Survival course" and "Hiragana course"

### Changed
- The content check also validates hiragana exercise blocks and unit order, and supports pages outside `lessons/`
- "No Japanese voice" notice now appears once per visit instead of on every sound

## [1.3.0] - 2026-11-15

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

[1.7.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.7.0
[1.6.1]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.6.1
[1.6.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.6.0
[1.5.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.5.0
[1.4.1]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.4.1
[1.4.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.4.0
[1.3.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.3.0
[1.2.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.2.0
[1.1.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.1.0
[1.0.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.0.0
