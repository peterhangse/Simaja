# CONTEXT.md — Simaja

**"Sims-assistenten för Maja"** — privat Vue-app som organiserar en The Sims 4-värld:
simmar, relationer, hus, släktträd, dagbok, planering, OCR-import av karaktärsbilder,
husritning (floor plan) och en musikspelare. Live: **https://simaja.web.app**
(Firebase Hosting, site `simaja` i `.firebaserc`, Firebase-projekt `maja-e0953`).
GitHub: **https://github.com/peterhangse/Simaja** (gren `main`, CI-deploy vid push).

Läs denna fil innan du ändrar något. Uppdatera den i samma commit som
struktur/data/Firestore-schema-ändringar (kontrakt i `AGENTS.md`).

## Teknik (verifierat mot package.json)

- **Vue 3.4** (Composition API, `<script setup>`) + **Vite 5** + **Pinia 2** +
  **Vue Router 4** (lazy-loaded routes) + **Tailwind CSS 3.4**.
- **firebase@10**: Firestore + Auth (email/password) + Storage.
- `cytoscape` + `cytoscape-dagre` (släktträd), `tesseract.js` 5 (OCR),
  `lucide-vue-next` (ikoner).
- ESLint 10 (flat config, `eslint-plugin-vue`) + Prettier — konfigurerade men
  **inga tester** finns.

## Filstruktur (alla filer)

```
index.html                 Bootstrap-shell (lang="en", #app)
vite.config.js             Vue-plugin + alias @ → src/
tailwind.config.js / postcss.config.js / eslint.config.js / .prettierrc
firebase.json              Hosting (site simaja, public dist, SPA-rewrite) + rules/indexes
firestore.rules            6 samlingar, se nedan (create kräver numera auth — säkerhetsrond 2026-09-25, emulator-testad)
firestore.indexes.json     Tom (inga sammansatta index)
storage.rules              read: true (PUBLIC!), write: inloggad + image/* < 5 MB
.firebaserc                Firebase-projekt
.github/workflows/deploy.yml   CI: push till main → npm ci → .env från secrets → build → deploy hosting
.env.example               6 VITE_FIREBASE_*-nycklar (INGEN VITE_APP_PASSWORD)
docs/                      PRD.md, ROADMAP.md, AUDIT.md, NEXT_STEPS.md (stale planering)
public/                    plumbob.svg + sims-music.mp3 (total 57 MB)
"🏠 The Sims 1 & 2 Music... .mp3"   57 MB MP3 i repo-roten — ANVÄNDS EJ av appen

src/
  main.js                  createApp, Pinia, router, global errorHandler (18 rader)
  App.vue                  router-view + <MusicPlayer v-if="authStore.isAuthenticated">
  style.css                466 rader, sims-tema (Nunito, grönt/vitt ljusläge)
  router/index.js          Alla routes + guard: auth → /login, onboarding → /onboarding
  stores/
    auth.js                Firebase email/password, session i localStorage (77 rader)
    sims.js                HELA data-store: CRUD för alla 6 samlingar (532 rader)
  services/
    firebase.js            ENDA Firebase-init-platsen (db, storage, auth)
    ocrService.js          Tesseract (dynamisk import, eng+swe) + parseSimData (240 rader)
  data/
    sims4Data.js           Officiella traits/aspirations/careers/skills/ages, en+sv (330 rader)
    floorPlanData.js       LOT_SIZES, STYLES, BUDGETS, HOUSEHOLD, EXTRAS (354 rader)
  utils/
    fuzzyMatch.js          Levenshtein + OCR-korrigeringar (272 rader)
    floorPlanGenerator.js  Genererar rumslayout från val (675 rader)
    floorPlanWalls.js      Vägg-geometri (148 rader)
  views/                   Login (152), Onboarding (176), Dashboard (319), Worlds (185),
                           WorldDetail (260), Sims (373), SimDetail (436),
                           FamilyTree (611, har Export image → cy.png → family-tree.png),
                           FloorPlan (363), NotFound
  components/
    MusicPlayer.vue        HTML <audio src="/sims-music.mp3"> (208 r), volume i localStorage
    ProfilePicker.vue      Profil-växlare (isolering via profileId)
    FloorPlanCanvas.vue / FloorSwitcher.vue / AnnotationPanel.vue
    SimAvatar.vue / AppHeader.vue / Modal.vue / icons/PlumbobIcon.vue
    forms/                 WorldForm, HouseForm, SimForm, QuickAddSimForm,
                           RelationshipForm, DiaryForm, ScreenshotImportForm (OCR, 491)
```

## Arkitektur & flöden

### Routing + guard (src/router/index.js)

```
beforeEach: requiresAuth && !isAuthenticated → /login
            isAuthenticated && to==Login → /
            isAuthenticated && !hasCompletedOnboarding && to!=Onboarding → /onboarding
```

### Inloggning (stores/auth.js)

- `login(email, password)` → `signInWithEmailAndPassword` → ID-token sparas i
  `simaja_session`. `checkSession()` återställer från localStorage vid mount
  (App.vue). Notera: token valideras EJ mot Firebase vid återställning —
  localStorage-kollen räcker för routern.
- `completeOnboarding(name)` sätter `simaja_onboarding` + `simaja_username`.
- `VITE_APP_PASSWORD` används INTE i koden (arv) — men `deploy.yml` skriver det
  fortfarande från secrets till `.env` vid CI-bygge.

### Dataflöde (stores/sims.js)

```
initializeData(): fetchProfiles → Promise.all(fetch{Worlds,Houses,Sims,Relationships,DiaryEntries})
                  ALLT hämtas i minnet vid start (getDocs, ingen onSnapshot/pagination)
CRUD: addDoc/updateDoc → lokal state uppdateras parallellt
deleteWorld/deleteHouse/deleteSim: writeBatch med KASKAD (relationer + dagbok + barn)
Profil-isolering: varje doc får profileId; matchesProfile() filtrerar,
                  'default' = saknar profileId eller === 'default'
switchProfile(): sätter localStorage simaja_profile + refetchar allt
uploadImage(file, path): Storage uploadBytes → getDownloadURL
```

### OCR-flöde (ScreenshotImportForm → ocrService)

```
processScreenshot(image) → tesseract eng+swe (dynamisk import, ~2MB undviks i main bundle)
  → parseSimData(): fuzzyMatch (Levenshtein) mot sims4Data.js-listor
    → name/age/traits (max 3)/aspiration/career/skills med confidence + sv-översättning
  → validateOcrResult(): kräver minst ett giltigt fynd, annars felmeddelande på svenska
```

## Data & tillstånd

### Firestore-samlingar + krav enligt firestore.rules

| Samling | Create kräver (`request.auth != null` + hasAll) | Läs/Uppdatera/Radera |
|---|---|---|
| `worlds` | `name`, `createdAt` (name är string) | inloggad |
| `houses` | `name`, `worldId`, `createdAt` | inloggad |
| `sims` | `name`, `createdAt` | inloggad |
| `relationships` | `sim1Id`, `sim2Id`, `type` (type är string) | inloggad |
| `diary` | `simId`, `text`, `date` (text är string) | inloggad |
| `profiles` | `name`, `createdAt` | inloggad |

Alla create-regler kräver även `request.auth != null` (hårdnat 2026-09-25).
Reglerna deployas separat: `npx firebase deploy --only firestore:rules,storage:rules`
— ändring i rules-filerna slår igenom FÖRST efter deploy, inte vid `npm run build`.

Dokumentfält i koden: sim har status ('planned' | övrigt), traits, aspiration,
career, skills, houseId, bild-URL; world har order (sortering).

### localStorage-nycklar (fullständigt, verifierat)

`simaja_session` (ID-token), `simaja_onboarding`, `simaja_username`,
`simaja_profile` (aktiv profil), `simaja_filter_status`,
`simaja_filter_relations` (Dashboard-länkfilter), `simaja_music_volume`.

## Kommandon

```bash
# Lokalt
cp .env.example .env   # fyll i Firebase-keys
npm run dev            # vite, localhost:5173
npm run build          # produktion till dist/
npm run lint           # eslint src/ (finns även lint:fix, format)

# Deploy (manuell)
firebase deploy --only hosting:simaja     # live på simaja.web.app

# Fabrik (.fabrik-kommandon)
kod=opencode; server=npm run dev
deploy=git add -A && git commit -m 'uppdatering' && git push origin main
```

CI: push till `main` → GitHub Actions (Node 20, `npm ci`, `.env` från GitHub
secrets `VITE_FIREBASE_*` + `FIREBASE_SERVICE_ACCOUNT`) → Firebase Hosting.

## Gotchas (verifierade mot koden)

- **Inga tester** — ingen testramverk konfigurerad. Lint är enda grinden.
- **sims.js är monolitisk** (532 rader): all CRUD för alla 6 samlingar i en
  Pinia-store. Ny samling = ändra här + firestore.rules + regler-deploy.
- **Inte PWA**: ingen manifest/service-worker — bygg inte in påståenden om offline.
- **Storage `read: if true`** — alla uppladdade bilder är publikt läsbara.
- **Session återställs utan Firebase-validering**: `checkSession()` litar på
  localStorage (`simaja_session`) — routern blockar bara UI, Firestore-reglerna
  är den egentliga säkerheten.
- **Repo-rotens MP3 (57 MB) används ej** av appen; `public/sims-music.mp3` är
  den som spelas. Lägg aldrig in fler stora mediafiler — git-historiken blir tung.
- **deploy.yml ↔ .env.example mismatch**: workflown skriver `VITE_APP_PASSWORD`
  som .env.example saknar. Odådligt men ofarligt (koden använder bara Firebase-Auth).
- **Kaskad-radering bygger på in-memory state**: deleteWorld/House/Sim hittar
  barn via ref-arrayerna — data måste vara fetchad först (initializeData).
- **OCR-flödet har worker-livscykel**: `initWorker(onProgress)` / `terminateWorker()`
  i ocrService — Tesseract-worker skapas vid behov, dödas efter import.
- **auth.js har död import**: `onAuthStateChanged` importeras men anropas aldrig
  (inget lyssnar på auth-tillstånd — sessionen styrs enbart av localStorage +
  checkSession i App.vue onMounted).
- **docs/ (PRD/ROADMAP/AUDIT/NEXT_STEPS) är stale** (feb 2026, före floor plan) —
  planeringsdokument, läs inte som sanning om koden (t.ex. "YouTube IFrame API" i
  MusicPlayer är FALSKT: det är en HTML `<audio>` med lokal MP3; ROADMAP:s
  "v3.0 Firebase Auth" är redan SHIPPAD).
