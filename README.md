# gta6-trophy-guide-v1

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ehzugzvn/gta6-trophy-guide-v1/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ehzugzvn/gta6-trophy-guide-v1/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**PALM LINE** — a light, paper-clean GTA VI trophy tracker & guide for the make.fun bounty
[gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01). The second-screen
companion for the platinum run: all 55 official PlayStation 5 trophies with their official
names, descriptions and grades, an original cited guide for every single one, and a tracker
that remembers your progress in the browser. No Rockstar logos, artwork or game screenshots
anywhere — the look is plain print: warm paper, palm green, ink.

## What the app does

- **Tracker** — tick trophies off as you earn them; progress, per-trophy counters (stunts,
  spots, dollars, choices…) and the spoiler setting persist in localStorage. Export and
  import your progress as a JSON file, or reset it.
- **Guides with citations** — every trophy carries an original guide and numbered steps with
  [n] citation markers, a per-trophy Sources box, and honest "unconfirmed / sources disagree"
  notes where the method is not settled yet. Citation markers show in the list rows too.
- **Roadmap & missables** — a six-stage platinum roadmap (Prologue & Ch. 1 → Ch. 2 → Ch. 3 →
  Ch. 4 → The Final → Post-game 100%) with per-stage earned counts; clicking a stage filters
  the list. 13 trophies are flagged missable or possibly missable, each with its window —
  including the Chapter 1 first-meditation warning.
- **Filters & spoiler mode** — filter by Story, Missable, Collectibles, Activities or
  Co-op/Online, by grade, or by search. Spoiler mode covers the names and descriptions of
  unearned hidden trophies until you earn them.
- **Audit strip** — the page counts its own data live: 55/55 official names, 55/55 guides
  cited, missables flagged, six roadmap stages, works offline.

## How it runs

The app is plain static files under `app/` (no build step, no network — it works offline in
desktop Chrome). To try it locally with Node 22:

```
node serve.ts          # serves app/ on http://localhost:8080
```

To hand the entry in the way the scorer runs it:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=$PWD/out node main.ts
```

`main.ts` (Node 22, standard library only) checks the screenshots against the scorer's caps,
copies `app/` and `screenshots/` to the output directory and writes `dossier.json` there via
the vendored `vendor/makefun-frontend.ts`. The screenshots show the full tracker with a guide
open, a cited collectible guide with its missable banner, the missable filter, and spoiler
mode in action.
