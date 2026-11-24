# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/).

## [1.21.0] - 2026-11-24

### Added
- **Festivals and seasons handbook: the Japanese year.** 12 chapters, a glossary and a sources page:
  - **The calendar:** the old lunisolar calendar and the switch of 1873, era names, the 24 solar terms, lucky days (*rokuyō*) and old month names; the national holidays, Golden Week and the 2026–2027 holiday table; the five *sekku*.
  - **The year:** New Year and the first shrine visit; *setsubun* and the cherry blossom, with the Japan Meteorological Agency's dates by city; Bon, the UNESCO-listed *furyū-odori*, Kyoto's bonfires and fireworks; the harvest moon, the red leaves, Shichi-Go-San and New Year's Eve.
  - **Matsuri:** what a shrine festival is, *mikoshi* and floats, the 37 float festivals on the UNESCO list; Gion, Tenjin, Kanda, Nebuta, Awa Odori and the Sapporo Snow Festival, with dates and a disclaimer; how to join in and stay safe in crowds; and festival Japanese.
  - Cited from official sources and scholarship, with public-domain and freely licensed pictures, seven diagrams, a quiz per chapter, pop-ups and audio.

## [1.20.0] - 2026-11-22

### Added
- **Tap to look up.** Tapping something in the text opens a small pop-up (a bottom sheet on phones):
  - **Japanese words and phrases:** the original writing, kana reading, romaji, meaning and a replay button, plus a link to Wikipedia, the glossary or the explaining chapter where there is one. The word still plays at once; in quizzes and exercises a tap only plays it.
  - **Romaji terms** in italics or bold: the same word pop-up.
  - **Chemical substances:** English and Polish name, formula, IUPAC name, a PubChem abstract, links to the English and Polish Wikipedia, and the other chapters that mention it.
  - **Linked names:** people, places, works and more, with the Japanese name, the sentence on the page that mentions it, and the Wikipedia link as further reading.
  - **Citations** such as "(Kurihara 2015)": the full reference and the chapters that cite it.
  - **Chapter links:** the chapter's title and first paragraph, with an Open button.

## [1.19.0] - 2026-11-22

### Added
- **Bathing handbook: onsen, sentō and ryokan** ("Hot springs and bathhouses" on the home page). It has 12 chapters in three parts:
  - **hot springs:** the legal definition of an onsen, where the heat comes from, and how to read the spring label;
  - **bathhouses:** temple baths, the bathhouses of Edo, and the sentō;
  - **going:** onsen towns and *tōji*, ryokan, etiquette, tattoos, official health advice, and bath Japanese.

  Every chapter has a quiz, and there is a glossary and a full sources page. It has 22 freely licensed photographs (with no bathers shown) and six diagrams.
- **Railways handbook: from steam to Shinkansen** ("Trains and stations" on the home page). It has 13 chapters in three parts:
  - **history:** the first line of 1872, nationalisation and JNR, the Shinkansen, the 1987 break-up of JNR, the private railways that built suburbs, and the subways of Tokyo and Osaka;
  - **how it works:** safety and punctuality, the Shinkansen network today, fares, IC cards and the Japan Rail Pass, local lines, and freight and night trains;
  - **travelling:** *ekiben*, and railway Japanese.

  Prices and dates are given with the date of their source, and a travel disclaimer explains that they change. It has 26 public-domain or freely licensed pictures and seven diagrams.
- Recordings for the Japanese in both handbooks, with corrected readings for spring types, bath words and railway terms.

## [1.18.5] - 2026-11-22

### Fixed
- Recordings had uneven volume, and some sounded distorted. The voice engine's clarity filter sometimes produced spikes (distortion) that also made those clips quieter. All recordings are re-made: a clip that spikes is re-recorded with a gentler filter, and every clip is set to the same perceived loudness (−16 LUFS), without compression and with no clipping.

## [1.18.4] - 2026-11-21

### Fixed
- Sounds started late, because each recording was loaded only when it was needed. Recordings are now kept ready, and each question's sound (and the next one's) is prepared in advance, so it starts at once.
- Sounds were cut off when the next question appeared. After a correct answer the next question now waits until the sound has finished.

## [1.18.3] - 2026-11-21

### Fixed
- Opening *Install & offline* directly (for example after reloading on it) showed "This device: vnull · up to date": the Updates panel now waits until it knows which version the device runs.

## [1.18.2] - 2026-11-21

### Fixed
- Saving the site for offline use could fail and start over: it fetched all ~1,850 files at once, and a single file the server briefly refused (HTTP 503) discarded the whole download, which also kept some devices on an old version. Files are now fetched eight at a time, each retried up to three times, and an interrupted download resumes where it stopped.
- A change to the offline code alone now also counts as a new version.

## [1.18.1] - 2026-11-21

### Fixed
- New versions didn't install while the site was open once you had played any recording: the Reload button did nothing, and some browsers (such as Samsung Internet, which keeps pages alive in the background) stayed on the old version. Updates now switch over straight away.

### Added
- **Updates** on the *Install & offline* page: the version on this device and the newest one, with *Check for updates* and *Reset and reload*.
- A "Version … is available" bar when a newer version exists that your browser hasn't picked up.
- `reset.html`: open it to delete the saved copy of the site and load the newest version, keeping your progress. Works even from an older version that is stuck.

## [1.18.0] - 2026-11-21

### Changed
- **Clearer recorded voice.** All 1,544 recordings are redone with the HTS voice "Takumi" (MMDAgent project, Nagoya Institute of Technology, CC BY 3.0):
  - words no longer sound cut off: each clip keeps a short lead-in, so phones and Bluetooth headphones don't swallow the start, and the voice fades out naturally instead of stopping dead
  - the voice keeps its natural rise and fall (no loudness compression), with clearer consonants and better audio quality
  - readings and pronunciation fixes are unchanged
- The recordings now take 14 MB (the offline download is about 28 MB in total); installed apps download the new recordings once

## [1.17.2] - 2026-11-21

### Fixed
- Recorded audio still didn't play offline or in the installed app after 1.17.1. GitHub's server marks files as varying by compression, and audio players ask for files differently from the page, so the offline copy never found the recordings. It now ignores that header when looking files up.

## [1.17.1] - 2026-11-21

### Fixed
- Recorded audio didn't play when the site was used offline or as an installed app: the device's own voice was used instead. The offline copy now answers the byte-range requests that audio players make, so the recordings play everywhere.

## [1.17.0] - 2026-11-21

### Added
- **Recorded Japanese audio, the same on every device.** Tap-to-listen and the listening exercises now play recordings instead of your browser's speech engine:
  - 1,544 phrases from every lesson, course and handbook, recorded with Open JTalk and the HTS voice "NIT ATR503 M001" (Nagoya Institute of Technology, CC BY 3.0)
  - Works offline, and the listening exercises now also work on phones and computers with no Japanese voice installed
  - Pronunciation checked against the course's romaji; single characters are no longer read as particles (は as "wa", へ as "e"), and menu words such as 白湯 *paitan* and タラバ蟹 *tarabagani* have their proper readings
  - Anything without a recording still uses your device's voice

### Changed
- The offline download is about 7 MB larger
- The content check verifies that every recording is present

## [1.16.2] - 2026-11-21

### Changed
- New versions reach your device much faster:
  - an update now downloads only the files that changed, instead of the whole site;
  - an update that's waiting when you open the app is applied straight away; one that arrives while you're using it still asks with the Reload bar;
  - the app checks for a new version every 30 minutes while it's open, as well as when you come back to it;
  - changed files are requested in a way that gets past GitHub's 10-minute server cache.
- The first update after this release still downloads the whole site once.

## [1.16.1] - 2026-11-21

### Fixed
- Listening exercises (hiragana, katakana and kanji courses) could play the previous answer's sound over a new question, so you heard a different character from the one being asked. This happened mostly on phones, where speech starts late. Now a correct answer to a listening question isn't replayed, a new question clears any queued sound, and its own sound waits until earlier speech has finished.

## [1.16.0] - 2026-11-20

### Added
- **Signs in the wild: photo gallery**, an eighth part of the course: 43 photographs of Japanese text in public space
  - Station boards and train and bus displays, warnings and house rules, notices, street and route signs, shop signs and product labels, shrine and sightseeing signs, and two pre-war adverts, with a filter for each kind
  - Each caption gives the main Japanese text, its reading and meaning, the place and date, and a credit; tap the Japanese to hear it
  - Tap a photo to enlarge it, then browse with ‹ › or the arrow keys
  - Every picture is public domain or CC0 on Wikimedia Commons; no copyrighted artwork, characters or mascots
  - The photos and their details are kept in `assets/signs/` so later lessons can reuse them
  - An eighth home-page tile and menu group; the gallery is saved for offline use like the rest of the course

### Changed
- The content check covers the gallery: licences, credits, sources and that every photo is present

## [1.15.0] - 2026-11-19

### Added
- **Search the whole guide**: the magnifier in the top bar (or the `/` key) searches every lesson, course and handbook at once
  - Works in English, romaji, kana and kanji; ignores capitals and accents, so *ramen* finds *rāmen*
  - Each result shows where it comes from, the section heading and an excerpt with the matches highlighted, and opens that exact section
  - Filter the results by course or handbook; move through them with the arrow keys; Back returns to your results
  - The search index is saved with the rest of the site, so search works offline

### Changed
- The side menu's courses and handbooks are collapsible groups: opening a page expands its own group and collapses the others
- The content check also builds the search index and checks that every page is indexed

## [1.14.0] - 2026-11-18

### Added
- **Pop culture handbook: manga, anime and beyond**, a seventh part of the course: 14 long-form chapters, a glossary and a sources page
  - Pictures that tell stories: picture scrolls, the *Chōjū-giga*, Edo picture books and Hokusai, and how *manga* got its modern meaning; manga, the weekly magazine system and paperback volumes; anime from "trick films" and Tōei Dōga to *Astro Boy*, the production committee and the 2024 market; manga marks and role language (*yakuwarigo*)
  - Screens and stages: cinema from the *benshi* and the six studios to Mizoguchi, Ozu, Kurosawa, the new wave, ghost films and J-horror, Kore-eda, Hamaguchi and *Kokuhō*; *Godzilla*, Tsuburaya and the physics of miniatures; video games from hanafuda to the Famicom and the Japanese RPG; enka's political origins, idols, city pop and Hatsune Miku
  - Fans and society: kawaii and local mascots, Comiket and Akihabara, cosplay, anime pilgrimage and folklore in pop culture, Cool Japan
  - A traveller's guide with dated official rules (Ghibli Museum, National Film Archive, Comic Market 109) and a chapter on the Japanese of fiction for learners
  - Built only on cited sources: scholarship (J-STAGE, Nichibunken, *Japanese Journal of Religious Studies*, *Electronic Journal of Contemporary Japanese Studies*) and official data (National Film Archive of Japan, Eiren, Association of Japanese Animations, Cabinet Office, Comic Market Committee, Festival de Cannes)
  - 32 public-domain and freely licensed pictures and nine explanatory diagrams; no manga panels, anime stills, game screens or character designs
  - A seventh home-page tile and menu group; the handbook is saved for offline use like the rest of the course

### Changed
- The content check and the deploy check cover the pop culture handbook
- Long links in source lists wrap instead of widening the page on phones

## [1.13.0] - 2026-11-18

### Added
- **Folklore handbook: kami, ghosts and yōkai**, a sixth part of the course: 13 long-form chapters, a glossary and a sources page
  - Part I, kami and buddhas: what kami are and why "Shinto" is a slippery word; the Kojiki, the Nihon shoki and the Land of Yomi; pollution and purification; the thousand-year combination of kami and buddhas (*honji suijaku*); the separation of 1868
  - Part II, the dead: ancestors, Bon and the six realms; vengeful spirits (*onryō*, *goryō*) from the first goryō ceremony of 863 to Sugawara no Michizane, Retired Emperor Sutoku and the drowned Heike; how the white-robed, footless yūrei was shaped in the Edo period; a field guide to the kinds of ghost and how each comes into being
  - Part III, yōkai: definitions and the kami–yōkai continuum; night parades and tool spirits (*tsukumogami*); a bestiary of oni, tengu, foxes, tanuki, kappa, mermaids and prophetic beasts; "Doctor Monster", the 1960s yōkai boom, *kamikakushi* and Amabie in the pandemic
  - Built only on cited sources: peer-reviewed scholarship (Nanzan Institute for Religion and Culture, Nichibunken, J-STAGE), Lafcadio Hearn's public-domain books as primary texts, and the Agency for Cultural Affairs' religious statistics
  - About 35 public-domain and freely licensed pictures (woodblock prints, scrolls, Sekien's catalogues, photographs) and seven explanatory diagrams; Wikipedia links for further reading
  - A sixth home-page tile and menu group; the handbook is saved for offline use like the rest of the course

### Changed
- The content check covers both handbooks: cited chapters, quizzes, credited images and no Wikipedia in source lists

## [1.12.0] - 2026-11-17

### Added
- **Molecule diagrams in the cuisine handbook**: seven structural diagrams drawn from PubChem records, each with a cited caption and the relevant group highlighted
  - The three umami substances (chapter 1); the two fates of glutamine in soy-sauce moromi (4); rice vinegar's two fermentations (5); ATP breakdown to hypoxanthine in fish muscle (6); the α-1,4 and α-1,6 links of amylose and amylopectin (9); glucono-δ-lactone opening to gluconic acid (11); agarobiose, the repeating unit of agar (12)
  - Tap a diagram to open it full size, also in the offline app
  - The sources page lists every diagram with its PubChem records
- **Further-reading links**: about 350 terms, people, organisms and places across the handbook link to Wikipedia at their first appearance in each chapter, and the molecules in the diagrams link to PubChem. They are marked ↗, open in a new tab and are kept apart from the cited sources
- Chapter 12 now gives agar's chemical structure from the EFSA re-evaluation

### Changed
- The content check fails if a chapter's source list cites Wikipedia or if a Wikipedia link is malformed
- The offline app serves files opened directly (such as a full-size diagram) instead of the home page

## [1.11.0] - 2026-11-17

### Added
- **Use it offline, as an app**: the whole site (every lesson, course, game, quiz and the cuisine handbook with its photos, about 3 MB) is saved on the device on the first visit and then works with no connection
  - Installable on Android: Chrome turns it into an app with its own launcher icon that opens full screen; an *Install the app* button appears where Chrome offers it. On iPhone and iPad: *Add to Home Screen*
  - New releases download in the background; a *Reload* bar switches to the new version, and the old copy is removed
  - New *Install & offline* page (menu and home page): offline status, install steps for Android and iPhone, and how to get Japanese text-to-speech working without a connection
  - The home page shows whether the course is saved for offline use

### Changed
- The deploy lists every published file for offline saving and gives each release's service worker a content hash
- The content check verifies the app manifest, its icons and the service-worker build placeholder

## [1.10.0] - 2026-11-17

### Added
- **Japanese cuisine handbook**, a fifth part of the site: a start page, 14 long-form chapters, a glossary, and a page of sources and image credits
  - Part I, foundations and seasonings: umami chemistry, dashi, kōji, soy sauce and miso, mirin, vinegar and sake
  - Part II, core techniques: raw fish (rigor, *ikejime*, the K value, *Anisakis* and freezing), frying and batter, marinating with kōji
  - Part III, staples: rice, udon and soba, tofu
  - Part IV, sweets and texture: bean paste, agar and yōkan; mochi and kuzu starch; Japanese texture vocabulary
  - Every fact is cited from peer-reviewed research, official bodies (MAFF, EFSA) or producers' educational and technical bodies. Disagreements between sources are shown, and gaps in the evidence are named instead of filled
  - A self-check quiz at the end of every chapter
  - Freely licensed photos (public domain, CC0, CC BY, CC BY-SA), stored in the repository, each credited in its caption and on the credits page
- A fifth, full-width home-page tile for the handbook, with chapters-read progress
- A link from the Food & dishes lesson to the handbook

### Changed
- The content check covers the handbook: every chapter needs a source list and a quiz, each quiz question needs exactly one correct answer, and every image must exist, have alt text, be used, and be credited
- The deploy check also requires the `cuisine/img/` folder
- Pages can show figures: Markdown image paths are resolved relative to the page

## [1.9.0] - 2026-11-17

### Added
- **Kanji course**: a start page, 8 units organised by place, real-world signs with a final test, and a daily review with free play
  - The 95 kanji most often met on signs: numbers and prices, entrances and directions, stations and trains, restaurants and food, shops and money, opening hours and days, toilets/onsen/hotels, and safety and rules
  - About 120 real sign words (出口, 改札, 定食, 税込, 営業中, 男湯, 禁煙, 非常口…) with the place you'd see them
  - Meaning *and* reading: new question modes "what does this mean?" and "find the kanji", alongside reading, listening and typing; checkpoints ask both
  - Memory aids built from each kanji's parts; cards show the meaning, the main reading and the other readings; any correct reading is accepted when typing, with a note on the most common one
  - Sign-word hints show each kanji's meaning
- A fourth home-page tile for the Kanji course (four columns on wide screens, two on medium, one on phones); kanji progress is included in Sync progress

### Changed
- The exercise engine supports meanings, multiple readings and kana audio for kanji
- The content check validates the kanji course (unit order applies to kanji; sign words may contain any kana) and reports characters missing from a course's data more clearly
- The deploy check also requires the `kanji/` folder

## [1.8.0] - 2026-11-17

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

[1.9.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.9.0
[1.8.0]: https://github.com/pKasprowicz/nippon-bible/releases/tag/v1.8.0
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
