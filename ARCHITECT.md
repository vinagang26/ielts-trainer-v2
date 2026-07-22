# Architecture Document

## File Ownership

| File | Owner |
|------|-------|
| `core/app.js` | Front End Feature Engineer |
| `core/router/router.js` | Interface Specialist |
| `core/router/router.css` | Interface Specialist |
| `components/calendar/calendar.js` | Interface Specialist |
| `components/calendar/calendar.css` | Interface Specialist |
| `components/stats-table/stats-table.js` | Front End Feature Engineer |
| `components/stats-table/stats-table.css` | Interface Specialist |
| `components/circle-menu/circle-menu.js` | Interface Specialist |
| `components/circle-menu/circle-menu.css` | Interface Specialist |
| `components/logo/logo.css` | Interface Specialist |
| `pages/home/home.css` | Interface Specialist |
| `pages/tracker/tracker.css` | Interface Specialist |
| `services/rollover.js` | Front End Feature Engineer |
| `utils/dateUtils.js` | Front End Feature Engineer |
| `styles/global/global.css` | Interface Specialist |
| `styles/global/globall.css` | Interface Specialist |
| `styles/card/card.css` | Interface Specialist |
| `index.html` | Interface Specialist |

## Critical Dependencies

Script load order is strict. Changes require architect approval:

1. `styles/global/global.css`
2. All component CSS
3. `utils/dateUtils.js`
4. `core/app.js` (defines `today`)
5. `components/calendar/calendar.js`
6. `components/stats-table/stats-table.js`
7. `components/circle-menu/circle-menu.js`
8. `core/router/router.js`
9. `services/rollover.js`

## Known Issues

- `index.html` line 81: `<script src="app.js">` → should be `<script src="core/app.js">`
- `styles/global/globall.css` — duplicate, delete
- `pages/tracker/tracker.css` — unused, remove
