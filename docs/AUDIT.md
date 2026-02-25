# Simaja — Developer Audit Report

**Date:** 2026-02-25  
**Auditor Perspective:** Professional App Developer  
**Scope:** Full codebase review — architecture, security, performance, UX, code quality  

---

## Overall Grade: **B** (Solid v2.0 with remaining security gaps)

Simaja is an impressive personal project that ships real value — it solves a genuine problem for Sims players with a purpose-built, visually polished UI. The architecture follows modern best practices (Vue 3 Composition API, Pinia, Vite, Tailwind, Firebase). However, several production-readiness issues must be addressed before this can be considered a "real" app.

---

## Scorecard

| Category | Score | Grade | Notes |
|----------|-------|-------|-------|
| **Feature Completeness** | 8.5/10 | A | Covers the full Sim lifecycle: worlds → houses → sims → relationships → diary → family tree. OCR import is a standout feature. |
| **UI/UX Design** | 8/10 | A- | Beautiful Sims-themed design with Nunito font, gradients, emoji-rich UI. Responsive Tailwind layout. Onboarding flow is smooth. |
| **Code Architecture** | 7/10 | B | Clean separation (store/services/views/components), proper Composition API usage. But: single monolithic store, no TypeScript, no error boundaries. |
| **Security** | 3/10 | D | Firestore rules tightened to per-collection validation. Password still in client bundle. Session token still forgeable. No Firebase Auth yet. |
| **Performance** | 6/10 | C+ | Lazy-loaded routes are good. But: all data fetched on startup (no pagination), heavy libs (Tesseract, Cytoscape) not optimally lazy-loaded, no caching strategy. |
| **Data Integrity** | 7/10 | B | ✅ CASCADE DELETES FIXED. writeBatch used for atomic multi-doc operations. Profile isolation via `profileId` filtering. Missing: undo, backups. |
| **Testing** | 0/10 | F | Zero tests. No unit, integration, or E2E tests. No test framework configured. |
| **Developer Experience** | 6/10 | C+ | No ESLint/Prettier or TypeScript. But: global error handler added, 404 route added, Vite alias fixed, clean file structure. |
| **Accessibility** | 4/10 | D | No ARIA labels, no keyboard navigation support, no focus management, no screen reader testing. Color contrast likely fine (Tailwind defaults). |
| **Mobile Experience** | 7/10 | B | Tailwind responsive grid works well. But: no PWA, no offline, some touch targets may be too small. |

**Weighted Average: 6.4/10**

---

## Detailed Findings

### What Simaja Does Well

#### 1. Feature Design (Score: 8.5)
The feature set is thoughtfully designed around actual Sims player workflows:

- **World → House → Sim hierarchy** mirrors the game's structure perfectly
- **9 relationship types** cover all meaningful Sims connections
- **Diary templates** (romance, marriage, baby, death, etc.) reduce friction for common events
- **OCR screenshot import** is genuinely innovative — a "wow" feature
- **Family tree visualization** with Cytoscape.js is interactive and useful
- **Quick Add Sim** shows understanding of "I'm in the middle of gameplay" moments

**Verdict:** The product thinking is strong. Features are scoped well and serve real needs.

#### 2. UI/UX (Score: 8)
- Sims-themed design language (plumbob favicon, purple/green gradients, emoji icons) creates an immersive feel
- Nunito font is warm and approachable
- Modal-based forms keep users in context
- Dashboard provides useful at-a-glance stats and insights
- Onboarding flow is simple and effective (3 steps, personalized greeting)
- Filter system on SimsView is well-designed (primary + expandable advanced)

**Verdict:** The UI punches well above "personal project" weight. Feels like a real product.

#### 3. Component Architecture (Score: 7)
- Clean Composition API `<script setup>` throughout
- Proper separation: forms as reusable components, views for pages
- `sims4Data.js` centralizes game data with bilingual support
- Services layer (`firebase.js`, `ocrService.js`) isolates infrastructure
- Lazy-loaded routes for code splitting

**Verdict:** Good architectural instincts. Code is readable and maintainable.

---

### What Needs Improvement

#### 4. Security (Score: 3) — **IMPROVED but still needs Firebase Auth**

Firestore rules have been tightened from fully open to per-collection data validation (require specific fields on create). However, the app still has **no real authentication**:

| Issue | Severity | Status |
|-------|----------|--------|
| Firestore rules: per-collection validation | **IMPROVED** | ✅ Rules now require correct fields on create |
| Storage rules: no auth check | **HIGH** | ❌ Still open |
| Password in client bundle | **CRITICAL** | ❌ `VITE_APP_PASSWORD` inlined by Vite |
| Session token: `btoa(Date.now())` | **HIGH** | ❌ Any base64 string passes |
| No Firebase Auth SDK | **HIGH** | ❌ Auth is client-side only |

**Risk:** If someone discovers the Firebase project ID (it's in the deployed bundle), they can use the Firebase SDK to directly:
- Read all of Maja's Sims data
- Delete everything
- Upload arbitrary files to storage
- Write any data to Firestore

**Recommendation:** Implement Firebase Auth before any public-facing deployment. Lock Firestore and Storage rules to authenticated users immediately.

#### 5. Data Integrity (Score: 7) — **SIGNIFICANTLY IMPROVED**

| Issue | Status |
|-------|--------|
| `deleteWorld()` cascade to houses/sims/relationships/diary | ✅ Fixed — uses writeBatch |
| `deleteSim()` cascade to relationships + diary in Firestore | ✅ Fixed — uses writeBatch |
| `deleteHouse()` cascade to sims + relationships + diary | ✅ Fixed — uses writeBatch |
| Firestore transactions for multi-doc operations | ✅ Fixed — writeBatch for atomic commits |
| Profile isolation via `profileId` field | ✅ Implemented |
| No backup mechanism | ❌ Still missing |
| No undo/redo | ❌ Still missing |

#### 6. Performance (Score: 6)

| Issue | Impact |
|-------|--------|
| All 5 collections fetched entirely on startup | Slow on large datasets. O(n) for everything. |
| No pagination or lazy loading of data | Memory grows linearly with data |
| Tesseract.js WASM (~2MB) potentially in main bundle | Increases initial load |
| Cytoscape.js + dagre are large (~500KB) | Family tree page loads slowly |
| No Firestore indexes configured | Complex queries may fail or be slow |
| Google Fonts loaded synchronously | Blocks first paint |
| No image optimization (srcset, lazy loading, WebP) | Images load at full resolution always |

#### 7. Code Quality Gaps (Score: 5)

| Gap | Impact |
|-----|--------|
| No TypeScript | No compile-time type safety for 3000+ lines of code |
| No ESLint/Prettier | Inconsistent code style, no static analysis |
| No tests (0% coverage) | No regression protection for any of the 20+ components |
| Single monolithic Pinia store (~500 lines) | All entities in one file; harder to maintain as app grows |
| Vite alias | ✅ Fixed — uses `fileURLToPath` |
| `dist/` potentially committed to repo | Repository bloat, stale builds |
| Global error handler | ✅ Added in main.js |
| 404 catch-all route | ✅ Added (NotFoundView) |

---

## Feature Gap Analysis

| Expected Feature | Status | Impact |
|-----------------|--------|--------|
| Multi-save-file support | ✅ Done | Profile system with `profileId` isolation |
| Offline access | ❌ Missing | Can't reference Sims while game is using internet |
| Data backup/export | ❌ Missing | Single point of failure |
| Undo/redo | ❌ Missing | Accidental deletes are permanent |
| Search across all entities | ❌ Missing | Can't find a Sim by trait, career, etc. |
| Bulk operations | ❌ Missing | Can't move multiple Sims between houses |
| Image gallery per Sim | ❌ Missing | Only 1 image per Sim |
| Sim status/life stage tracking | ✅ Done | Active/Planned with concept & interests |
| Ambient music | ✅ Done | Floating YouTube player with Sims 2/4 soundtrack |
| Mobile installable (PWA) | ❌ Missing | Can't "install" on phone |
| Notifications/reminders | ❌ Missing | "Don't forget X's birthday" |

---

## Comparison to Industry Standards

### vs. Production Web Apps

| Standard | Simaja | Industry |
|----------|--------|----------|
| Authentication | Client-side password | OAuth2 / Firebase Auth / Auth0 |
| Authorization | None | Role-based, per-document rules |
| Testing | 0% | 70-80% coverage minimum |
| CI/CD | None | Automated build/test/deploy |
| Monitoring | None | Error tracking (Sentry), analytics |
| Security headers | None | CSP, CORS, HSTS configured |
| API rate limiting | None | Firebase App Check or equivalent |
| Data validation | Client-only | Server-side (Security Rules or Cloud Functions) |

### vs. Other Tracker Apps (Notion, Trello, etc.)

| Feature | Simaja | Notion |
|---------|--------|--------|
| Domain-specific UX | ✅ Excellent | ❌ Generic |
| Visual design | ✅ Polished | ✅ Polished |
| Offline support | ❌ | ✅ |
| Collaboration | ❌ | ✅ |
| Data export | ❌ | ✅ |
| Mobile app | ❌ (responsive web) | ✅ Native |
| API/integrations | ❌ | ✅ |
| Free tier | ✅ Firebase free | ✅ Freemium |

---

## Summary Verdict

**Simaja is a well-designed v2.0 app** that demonstrates strong product thinking and solid frontend engineering. It effectively serves its core use case: tracking Sims characters, worlds, and relationships with a game-themed UI.

**Since the initial audit, significant improvements have been made:**
1. **Data integrity fixed** — cascade deletes with writeBatch, profile isolation
2. **Firestore rules tightened** — per-collection data validation
3. **Error handling added** — global error handler, 404 route
4. **Features shipped** — planned Sims, music player, profile system

**Remaining priorities for production readiness:**
1. **Security** — Firebase Auth is the #1 priority
2. **No tests** — every change is a gamble
3. **No operational tooling** — no monitoring, CI/CD, or backups

**The path from here to a real product is clear and achievable.** The codebase is clean, the architecture is sound, and the design system is strong. It needs security, reliability, and operational maturity — all solvable with focused engineering sprints.

**Bottom line:** This is the best possible starting point for a v2.0 push.
