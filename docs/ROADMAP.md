# Simaja — Product Roadmap

**Last Updated:** 2026-02-25  
**Planning Horizon:** 6 months (Q1-Q2 2026)  

---

## Roadmap Overview

```
Q1 2026 (Jan-Mar)                    Q2 2026 (Apr-Jun)
─────────────────                    ─────────────────
v2.0 Foundation ✅ SHIPPED            v3.0 Scale & Security
├─ ✅ English UI                     ├─ Firebase Auth
├─ ✅ Image upload bug fix           ├─ Real-time sync (onSnapshot)
├─ ✅ Planned Sims                   ├─ PWA + offline mode
├─ ✅ Music player                   ├─ Timeline view
├─ ✅ Profile system                 ├─ Generation tracker
└─ ✅ Critical fixes & deploy        └─ Export / Import

Q3 2026 (Jul-Sep)
─────────────────
v3.1 Community
├─ Challenge templates
├─ Sim comparison tool
├─ Lot/Build tracker
├─ Performance optimization
└─ Accessibility audit
```

---

## Sprint Plan (2-week sprints)

### Sprint 1: v2.0 Core (Feb 17 - Mar 2) ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Translate all UI components to English | ✅ Done | 16+ files translated |
| Switch sims4Data.js helpers to `.en` | ✅ Done | Aspirations categories also translated |
| Fix image upload error handling (3 forms) | ✅ Done | Error display, 5MB validation, disabled submit |
| Update index.html lang + title + meta | ✅ Done | `lang="en"`, meta description added |
| Configure simaja.web.app hosting | ✅ Done | `.firebaserc` + `firebase.json` updated |

### Sprint 2: Planned Sims + Music (Feb 25) ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Update Pinia store for `activeSims`/`plannedSims` getters | ✅ Done | Computed getters filter by status field |
| Add Active/Planned tabs in SimsView | ✅ Done | Tabs with counts, planned badge on cards |
| Show planned Sim details in SimDetailView | ✅ Done | Status badge, concept/interests display |
| Add planned Sims insight to Dashboard | ✅ Done | Link passes filter via localStorage |
| Create MusicPlayer.vue (YouTube IFrame API) | ✅ Done | Floating player, 10 tracks, volume, playlist |
| Add MusicPlayer to App.vue (auth-gated) | ✅ Done | Persistent across routes |

### Sprint 3: Profile System (Feb 25) ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Add `profiles` collection + CRUD in store | ✅ Done | fetchProfiles, addProfile, deleteProfile |
| Add `profileId` to all add/fetch operations | ✅ Done | Every collection writes & filters profileId |
| Build ProfilePicker.vue component | ✅ Done | Dropdown with create/switch/delete |
| Add profile picker to AppHeader | ✅ Done | Shown next to nav links |
| Default profile for existing data | ✅ Done | `matchesProfile()` treats missing as 'default' |

### Sprint 4: Polish & Deploy v2.0 (Feb 25) ✅ DONE

| Task | Status | Notes |
|------|--------|-------|
| Cascade deletes (world → houses → sims) | ✅ Done | writeBatch for atomic operations |
| Tighten Firestore rules (per-collection validation) | ✅ Done | Data structure checks on create |
| Fix Vite alias (fileURLToPath) | ✅ Done | — |
| Add 404 catch-all route | ✅ Done | NotFoundView.vue |
| Add global error handler | ✅ Done | app.config.errorHandler |
| Remove redundant auth check in App.vue | ✅ Done | Router guard handles it |
| Deploy to simaja.web.app | ✅ Done | Live at https://simaja.web.app |

---

### Sprint 5: Security Foundation (Apr 14 - Apr 27)

| Task | Estimate | Dependencies |
|------|----------|-------------|
| Initialize Firebase Auth SDK | 1h | — |
| Implement Google Sign-In flow | 3h | — |
| Replace password gate with Firebase Auth | 2h | — |
| Update Firestore rules: `request.auth != null` | 1h | Auth implemented |
| Update Storage rules: auth check | 1h | Auth implemented |
| Scope all queries by `userId` | 3h | Auth implemented |
| Remove hardcoded password from .env/bundle | 1h | — |
| Migrate existing data to user-scoped structure | 2h | — |
| **Sprint Total** | **14h** | |

### Sprint 6: Real-time & Offline (Apr 28 - May 11)

| Task | Estimate | Dependencies |
|------|----------|-------------|
| Replace `getDocs` with `onSnapshot` listeners | 4h | — |
| Add connection status indicator | 1h | — |
| Implement Firestore persistence (offline cache) | 2h | — |
| Configure PWA manifest + service worker | 3h | — |
| Add install prompt UI | 1h | PWA configured |
| Test offline read/write behavior | 3h | — |
| **Sprint Total** | **14h** | |

### Sprint 7-8: Timeline & Generations (May 12 - Jun 7)

| Task | Estimate | Dependencies |
|------|----------|-------------|
| Timeline view: all diary entries chronologically | 4h | — |
| Timeline filtering (by Sim, world, event type) | 3h | Timeline view |
| Generation tracker data model | 2h | — |
| Generation UI: heir selection, generation counter | 4h | Data model |
| Export to JSON (full save backup) | 3h | — |
| Import from JSON | 3h | Export working |
| **Sprint Total** | **19h** | |

---

## Milestones

| Milestone | Target Date | Status | Success Criteria |
|-----------|------------|--------|------------------|
| **v2.0 GA** | ~~2026-04-13~~ **2026-02-25** | ✅ Shipped | English UI, planned Sims, music player, profiles, deployed to simaja.web.app |
| **v3.0 Security** | 2026-04-27 | 📋 Planned | Firebase Auth, locked Firestore/Storage rules, no exposed credentials |
| **v3.0 PWA** | 2026-05-11 | 📋 Planned | Installable, offline-capable, real-time sync |
| **v3.1 Features** | 2026-06-07 | 📋 Planned | Timeline, generations, export/import |

---

## Technical Debt Backlog

| Item | Priority | Status |
|------|----------|--------|
| Cascade deletes (world → houses → sims) | P1 | ✅ Done (writeBatch) |
| Remove redundant auth check in App.vue | P2 | ✅ Done |
| Fix Vite alias to use `fileURLToPath` | P2 | ✅ Done |
| Add 404 catch-all route | P2 | ✅ Done |
| Error boundary / global error handler | P3 | ✅ Done |
| Add ESLint + Prettier config | P2 | 📋 Backlog |
| Dynamic import for Tesseract.js (lazy load) | P2 | 📋 Sprint 6 |
| Dynamic import for Cytoscape.js (lazy load) | P2 | 📋 Sprint 6 |
| Firestore composite indexes for filtered queries | P3 | 📋 Sprint 6 |
| Remove `dist/` from repo, gitignore it | P1 | 📋 Backlog |

---

## Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Open Firestore exploited before v3.0 | Medium | Critical | Fast-track Sprint 5; add IP allowlist as stopgap | Engineering |
| Profile migration corrupts existing data | Low | High | Backup before migration; reversible migration script | Engineering |
| YouTube embed blocked by user's ad blocker | Medium | Low | Graceful fallback message; consider self-hosted audio | Engineering |
| Firebase free tier limits exceeded | Low | Medium | Monitor dashboard; set billing alerts at $5 | Product |
| Scope creep delays v2.0 | Medium | Medium | Strict sprint scope; defer non-essential to backlog | Product |

---

## Dependencies

| Dependency | Type | Status | Action Required |
|-----------|------|--------|----------------|
| Firebase Hosting site "simaja" | Infrastructure | ✅ Done | Created and deployed |
| Firebase Auth activation | Infrastructure | Not started | Enable in Firebase console before Sprint 5 |
| Sims 2 soundtrack video IDs | Content | ✅ Done | 10 tracks curated in MusicPlayer.vue |
| Google Fonts (Nunito) | External CDN | ✅ Active | — |
| Tesseract.js WASM worker | External CDN | ✅ Active | Consider self-hosting for offline support |
