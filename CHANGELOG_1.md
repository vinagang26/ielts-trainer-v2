# Changelog

## v0.1.0 – Grammar Page Hub (2026-07-22)

### What Changed
- **Created**: Grammar page with 14 skill cards (Sentence Structure → Advanced Grammar)
- **Card layout**: Image (300×300px placeholder) → Title → "Train" button
- **Lazy loading**: Images load only when scrolled into view (saves bandwidth)
- **Responsive**: Works on desktop, tablet, mobile

### Files Added
- `pages/grammar/grammar.css`
- `pages/grammar/grammar.js`

### Files Modified
- `index.html` (added 2 lines: CSS link + JS script)

### What You Need to Do
1. Create folder: `images/grammar/`
2. Add 14 PNG files (300×300px each):
   - sentence-structure.png
   - parts-of-speech.png
   - basic-tenses.png
   - articles-determiners.png
   - pronouns.png
   - prepositions.png
   - questions-negatives.png
   - modals.png
   - conditionals.png
   - passive.png
   - reported-speech.png
   - clauses.png
   - gerunds-infinitives.png
   - advanced-grammar.png
3. Click "Grammar" in menu → page loads

### v0.1.1 – Flexible Image Display (2026-07-22)

**What Changed**
- Image wrapper: fixed 300px height → flexible min-height 250px
- Image display: `object-fit: cover` (crops) → `object-fit: contain` (shows full image)
- Result: Entire image visible for all aspect ratios, cards have variable heights

**Why**
Grammar images contain semantic content (rules, examples). Showing them fully matters more than uniform card heights.

### Next Steps
- Training route (`#grammar-train/{skillKey}`) not built yet
- Progress tracking (done/in-progress) deferred
- Button clicks currently redirect to empty route
