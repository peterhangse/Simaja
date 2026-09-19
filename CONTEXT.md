# CONTEXT.md — Simaja

**"Sims-assistenten för Maja"** — privat Vue-app som organiserar en The Sims 4-
värld: simmar, relationer, hus, släkt-träd, dagbok, håpsplaner/bottenvåningar,
OCR-import av karaktärsbilder och en musikspelare. Live: **simaja.web.app**
(Firebase Hosting).

## Teknik (verifierat)

- **Vue 3 + Vite 5 + Pinia + Vue Router 4 + Tailwind CSS** + `firebase@10`
  (Firestore + Auth), `cytoscape` (släktträd), `tesseract.js` (OCR).
- Single-page; routing i client. `package.json` finns, `.env.example` finns.

## Struktur

```
src/main.js            — bootstrap (Firebase-init, router, Pinia, v-flagga)
src/views/             — Dashboard, Simmar, Planering, Släktträd, Håpsplaner,
                         Dagbok, Karta, Musik, Profiler, Inloggning
src/stores/            — Pinia (heldata.js med simmar.db-liknande state)
src/services/          — firebase.js (firestore/auth), escape.js, seed.js
src/data/              — JSON-filer (titleSuggestions, relationer, generera-id)
public/                — musikfiler (114 MB MP3:or), bilder (simmar, vapen)
components/Navbar/Sidebar etc.
```

## Funktioner

- Inloggning (Firebase email/password); dashboard-kort; simmar med
  stats (Sim-plock), relationer, roller, avatarbild.
- **Planering**: lås upp plan-id, håpsplan-mallar (hushåll).
- **Släktträd**: cytoscape-nät + export till PNG.
- **Håpsplaner**: drag & drop-inredning av tomter.
- **Dagbok**: sökbara logg-posterna med block/sim.
- **Karta**: sök + vy per värld/distrikt/hushåll.
- **OCR**: tesseract läser karaktärs-bild → fyll i sim-egenskaper.
- **Musik**: spelare med 57 MB MP3-bibliotek; radiostationer + spotify-style
  "radio" (span-egg).

## Data & tillstånd

- Firestore-samlingar: `worlds`, `houses`, `sims`, `relationships`, `diary`,
  `profiles`. Skrivskydd: bara inloggad.
- localStorage-nycklar: `simaja_session`, `simaja_login_process`,
  `user_id`, `thumb`, `simaja_from` m.m.

## Köra / deploya

- Kopiera `.env.example` → `.env` (Firebase-web-keys + `VITE_APP_PASSWORD`),
  `npm run dev`; `npm run build` + `firebase use simaja && firebase deploy`.
- CI: `.github/workflows/deploy.yml` → bygger och deployar hosting på push till
  main.

## Gotchas (verifierat mot koden)

- **Inte PWA**: gammal claim om service worker/offline-stöd är FALSKT (ingen
  manifest/service-worker).
- **Firebase-reglerna skapar inte lästa-objekt-säkerhet**: `firestore.rules`
  har `request.auth != null;` på $root men skurmar inte skrivaccess per samling.
- **Inga tester**, `sims.js` är en enda stor fil (~900 rader?).
- Repo-mappen vaggar **114 MB MP3:or** — varför git-slow, läs hela data-seten
  innan du tar bort/ändrar.
- `.env.example` refererar `VITE_APP_PASSWORD` men kod-lösningen använder bara
  Firebase-Auth; password-värdet är oanvänt men bibehållet för att inte bryta
  gamla användare.
- `src/services/firebase.js` kan vara den enda sanna Firebase-init-platsen;
  ändringar av Firestore-schema måste stämma med kodens fälttning.