# Simaja — Next Steps Implementation Plan

**Date:** 2026-02-25  
**Based on:** Developer Audit (AUDIT.md)  
**Approach:** Fix critical issues first, then ship user-facing features  

---

## Priority Matrix (Impact vs. Effort)

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │  🔴 CRITICAL      │  🟡 STRATEGIC     │
    │  (Do immediately) │  (Plan carefully) │
    │                   │                   │
    │  ✅ Lock Firestore│  • Firebase Auth  │
    │  ✅ Cascade delete │  ✅ Profile system│
    │  ✅ 404 route     │  • Real-time sync │
    │  ✅ .env.example  │  • PWA + offline  │
    │  ✅ Remove dist/  │  • Timeline view  │
LOW ├───────────────────┼───────────────────┤ HIGH
EFF │                   │                   │ EFFORT
    │  🟢 QUICK WINS    │  🔵 NICE TO HAVE  │
    │  (Do in passing)  │  (Backlog)        │
    │                   │                   │
    │  ✅ Fix Vite alias│  • TypeScript     │
    │  ✅ Add ESLint    │  • Full test suite│
    │  ✅ Error boundary│  • Image gallery  │
    │  ✅ Font preload  │  • Bulk operations│
    │  ✅ Remove onSnap │  • Notifications  │
    │    import          │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT
```

---

## Immediate Actions (Can Do Right Now)

### 1. Lock Firestore Rules (5 min) — ✅ DONE

Firestore rules tightened to per-collection data validation. Each collection requires specific fields on create.

### 2. Cascade Deletes — ✅ DONE

`deleteWorld()`, `deleteHouse()`, and `deleteSim()` all use Firestore `writeBatch` for atomic cascade deletes including relationships and diary entries.

### 3. Error Handler + 404 Route — ✅ DONE

Global error handler added in `main.js`. 404 catch-all route added with `NotFoundView.vue`.

### 4. Fix Vite Config — ✅ DONE

Alias changed to `fileURLToPath(new URL('./src', import.meta.url))`.

### 5. Add 404 Route — ✅ DONE

Catch-all route redirects to a friendly "not found" page.

### 6. Create .env.example — ✅ DONE

`.env.example` created with all required `VITE_` variables documented.

### 7. Add ESLint + Prettier — ✅ DONE

ESLint 9 flat config (`eslint.config.js`) with `eslint-plugin-vue` and Prettier integration. Scripts: `lint`, `lint:fix`, `format`.

### 8. Dynamic Tesseract.js Import — ✅ DONE

Converted from static `import { createWorker }` to `await import('tesseract.js')` inside `initWorker()`, saving ~2 MB from the main bundle.

### 9. README Translated to English — ✅ DONE

Full rewrite from Swedish to English reflecting v2.0 features (profiles, music, planned sims, OCR).

### 10. Profiles Firestore Rule — ✅ DONE

Added `match /profiles/{profileId}` to `firestore.rules` — profiles CRUD was denied in production without this.

---

## Implementation Priority (What to build next in code)

Based on the audit + Maja's feature requests + technical debt, here's the optimal order:

| Order | Item | Status |
|-------|------|--------|
| **1** | Cascade deletes in store | ✅ Done — writeBatch atomic operations |
| **2** | Planned Sims (store + views) | ✅ Done — Active/Planned tabs, concept/interests |
| **3** | Music Player | ✅ Done — Floating YouTube player, 10 tracks |
| **4** | Quick wins (404 route, Vite fix, error handler) | ✅ Done |
| **5** | Profile system | ✅ Done — ProfilePicker, profileId isolation |
| **6** | Firebase Auth | 📋 Next priority — requires Firebase console setup |

---

## What "Next Level" Looks Like

### From MVP to Production App

| Aspect | Current State | Next Level |
|--------|--------------|------------|
| **Security** | Password in JS bundle, rules tightened | Firebase Auth + locked rules |
| **Reliability** | ✅ Cascade deletes, error handling | Backups, undo/redo |
| **Performance** | ✅ Dynamic imports (Tesseract, routes) | Pagination, lazy loading |
| **Quality** | ✅ ESLint 9 + Prettier | Unit tests for store, E2E for flows |
| **Operations** | Manual deploy | GitHub Actions CI/CD, Sentry error tracking |
| **Mobile** | Responsive web | Installable PWA with offline mode |
| **Data** | ✅ Multi-profile, profileId isolation | JSON export/import, backups |

### The "Wow" Features That Set Simaja Apart

1. **Planned Sims board** — Kanban-style "concept → in-game → retired" workflow
2. **Sims music ambient player** — Stays playing across all pages, creates mood
3. **Smart insights** — "You have 5 Sims without any relationships" + action links
4. **Screenshot-to-Sim pipeline** — Already built, just needs polish
5. **Family tree export** — Share beautiful family tree images on social media

---

## Files Modified / Created (Implementation Map)

```
Priority 1 — Cascade Deletes: ✅ DONE
  src/stores/sims.js          → writeBatch cascade deletes

Priority 2 — Planned Sims: ✅ DONE
  src/stores/sims.js          → activeSims/plannedSims getters
  src/views/SimsView.vue      → Active/Planned tabs with counts
  src/views/SimDetailView.vue  → Status badge, concept/interests display
  src/views/DashboardView.vue  → Planned Sims insight link

Priority 3 — Music Player: ✅ DONE
  src/components/MusicPlayer.vue  → NEW: YouTube IFrame API, 10 tracks
  src/App.vue                     → MusicPlayer (auth-gated, persistent)

Priority 4 — Quick Wins: ✅ DONE
  src/router/index.js          → 404 catch-all
  src/views/NotFoundView.vue   → NEW: 404 page
  src/main.js                  → Global error handler
  vite.config.js               → fileURLToPath alias
  firestore.rules              → Per-collection validation

Priority 5 — Profile System: ✅ DONE
  src/stores/sims.js               → profileId on all CRUD, profile methods
  src/components/ProfilePicker.vue → NEW: dropdown with create/switch/delete
  src/components/AppHeader.vue     → ProfilePicker added

Priority 6 — Firebase Auth: 📋 NEXT
  Enable Firebase Auth in console
  Add Firebase Auth SDK
  Replace password gate
  Lock Firestore/Storage rules to auth.uid
```
