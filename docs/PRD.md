# Simaja — Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** 2026-02-25  
**Author:** Product & Engineering  
**Status:** Active  

---

## 1. Executive Summary

Simaja is a **personal companion web app for The Sims 4/5** that lets players track their Sims, worlds, houses, relationships, and life stories outside the game. It solves the core problem every Sims player faces: losing track of complex save files, family trees, planned characters, and narrative arcs across multiple game sessions.

**Target user:** Dedicated Sims players who maintain detailed saves and want a centralized, beautiful tracker.

**Core value proposition:** _"Your Sims journal — organized, visual, and always available."_

---

## 2. Problem Statement

### User Pain Points

| Pain Point | Severity | Current Workaround |
|-----------|----------|-------------------|
| Losing track of Sims across multiple worlds/saves | High | Spreadsheets, Notion, paper notes |
| Forgetting relationships and family trees | High | Screenshots, memory |
| No way to plan future Sims before creating them in-game | Medium | Notes apps |
| Can't visualize the full family tree across worlds | High | Manual diagramming |
| Switching between game and tracker is clunky | Medium | Alt-tab to browser/phone |
| No ambient game music while planning | Low | YouTube in a separate tab |

### Market Context

- No dominant "Sims tracker" app exists on the market
- Community alternatives: spreadsheets, Notion templates, Plumbella's trackers (PDF)
- Opportunity for a dedicated, purpose-built web app with Sims-specific UX

---

## 3. Product Vision

### North Star Metric
**Weekly Active Sessions** — How many times per week a user opens Simaja to check, update, or plan their Sims world.

### Vision Statement
Simaja becomes the indispensable companion every Sims player keeps open alongside their game — a living journal of their Sims universe that's as fun to use as the game itself.

### Design Principles

1. **Game-feel first** — UI should feel like a Sims menu, not a spreadsheet
2. **Zero friction** — Adding a Sim should be faster than creating one in CAS
3. **Visual storytelling** — Images, timelines, and trees over tables and forms
4. **Always in sync** — Real-time updates, works on phone while gaming on PC
5. **Delightful details** — Plumbob animations, Sims-themed colors, ambient music

---

## 4. User Personas

### Persona 1: "Maja" (Primary)
- **Age:** 22  
- **Play style:** Deep narrative player with 3-5 active saves
- **Behavior:** Creates detailed backstories, plans multi-generational families  
- **Needs:** Track relationships across worlds, plan future Sims, diary entries
- **Device:** MacBook (gaming) + iPhone (reference)
- **Quote:** _"I have 47 Sims across 3 saves and I can't remember who's married to who"_

### Persona 2: "Casual Builder"
- **Age:** 18-30  
- **Play style:** Build-focused, fewer Sims but detailed houses  
- **Needs:** Track houses, lots, world layouts
- **Device:** PC + mobile

### Persona 3: "Legacy Player"
- **Age:** 20-35  
- **Play style:** Multi-generational legacy challenges  
- **Needs:** Family tree visualization, generation tracking, milestone diary
- **Device:** Dual monitor (game + Simaja)

---

## 5. Feature Specification

### 5.1 Core Features (v1.0 — Shipped)

| Feature | Description | Status |
|---------|-------------|--------|
| **World Management** | CRUD for game worlds with images and descriptions | ✅ Shipped |
| **House Management** | Houses within worlds, with images, addresses, descriptions | ✅ Shipped |
| **Sim Profiles** | Full character sheets: name, age, gender, traits, aspiration, appearance, career, skills, notes | ✅ Shipped |
| **Relationship Tracking** | 9 relationship types between any two Sims (parent, child, sibling, spouse, ex, friend, enemy, roommate, mentor) | ✅ Shipped |
| **Diary / Journal** | Timestamped entries per Sim with event template buttons (romance, marriage, baby, birthday, job, move, death, achievement) that pre-fill starter text | ✅ Shipped |
| **Family Tree Visualization** | Interactive Cytoscape.js graph with filters, search, zoom, and image export | ✅ Shipped |
| **Screenshot OCR Import** | Tesseract.js-powered screenshot parser that extracts Sim data from Simology panel | ✅ Shipped |
| **Quick Add Sim** | Minimal form for rapid Sim creation (name + house only) | ✅ Shipped |
| **Dashboard** | Overview with stats, quick actions, and insights | ✅ Shipped |
| **Password Protection** | Simple password gate to prevent casual access | ✅ Shipped |
| **Onboarding** | 3-step welcome flow for first-time users | ✅ Shipped |

### 5.2 v2.0 Features (Shipped 2026-02-25)

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| **English UI** | Full English translation of all UI strings and data helpers | P0 | ✅ Done |
| **Image Upload Bug Fix** | Error feedback, 5MB validation, disabled submit for oversized files on all forms | P0 | ✅ Done |
| **Planned Sims** | Create Sims without assigning a house — "concept" characters with interests and backstory. Active/Planned tabs in Sims list, status badge on detail view. | P1 | ✅ Done |
| **Sims Music Player** | Floating YouTube player with 10-track Sims 2/4 soundtrack, playlist, volume control. Renders for authenticated users. | P2 | ✅ Done |
| **Profile / Save File System** | Multiple save file profiles with isolated data via `profileId` on every document. Profile picker in header. | P1 | ✅ Done |

### 5.3 v3.0 Features (Future)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Firebase Auth** | Replace password gate with proper Google/email auth | P0 |
| **Real-time Sync** | Firestore `onSnapshot` listeners for live updates across devices | P1 |
| **Mobile PWA** | Installable Progressive Web App with offline support | P1 |
| **Generation Tracker** | Legacy challenge support — track generations, heir selection, family goals | P2 |
| **Lot/Build Tracker** | Dedicated lot management with room-by-room notes | P2 |
| **Timeline View** | Chronological diary entries across all Sims in one timeline | P2 |
| **Export/Import** | JSON export/import for backup and sharing | P2 |
| **Sim Comparison** | Side-by-side Sim comparison for trait/skill planning | P3 |
| **Challenge Templates** | Built-in rules for popular challenges (Legacy, Not So Berry, Rags to Riches) | P3 |

---

## 6. Technical Architecture

### Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Vue 3 (Composition API) + Vite 5 | SPA framework & build |
| State | Pinia | Reactive state management |
| Routing | Vue Router 4 | SPA navigation with lazy loading |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Database | Firebase Firestore | NoSQL document store |
| Storage | Firebase Storage | Image uploads (5MB limit) |
| OCR | Tesseract.js 5 | Screenshot text extraction |
| Visualization | Cytoscape.js + dagre | Family tree graph rendering |
| Hosting | Firebase Hosting | CDN-backed static hosting |

### Data Model

```
Firestore Collections:
├── profiles/        {name, createdAt}
├── worlds/          {name, description, imageUrl, order, profileId, createdAt}
├── houses/          {name, address, description, imageUrl, worldId, profileId, createdAt}
├── sims/            {name, age, gender, houseId, traits[], aspiration, hairColor,
│                     eyeColor, style, career, skills[], notes, imageUrl,
│                     status, concept, interests, profileId, createdAt}
├── relationships/   {sim1Id, sim2Id, type, profileId, createdAt}
└── diary/           {simId, date, text, profileId, createdAt}
```

### Hosting
| Environment | URL |
|------------|-----|
| Production | `https://simaja.web.app` |
| Firebase Console | `https://console.firebase.google.com/project/maja-e0953` |

---

## 7. Non-Functional Requirements

| Requirement | Target | Current |
|------------|--------|---------|
| First Contentful Paint | < 1.5s | ~2.0s (Tesseract lazy-loaded) |
| Time to Interactive | < 3.0s | ~3.5s |
| Lighthouse Performance | > 90 | ~75 (large bundles) |
| Bundle Size (gzipped) | < 500KB initial | ~350KB initial |
| Image Upload Limit | 5MB | 5MB ✅ |
| Supported Browsers | Chrome, Safari, Firefox (latest 2) | ✅ |
| Mobile Responsive | Full responsive layout | ✅ (Tailwind) |
| Offline Support | Read-only cache | ❌ Not implemented |
| Accessibility | WCAG 2.1 AA | Partial |

---

## 8. Success Metrics

| Metric | Target (v2.0) | Measurement |
|--------|--------------|-------------|
| Active Sims tracked | 50+ per profile | Firestore count |
| Session frequency | 3+ times/week | Analytics (future) |
| Feature adoption: Family Tree | 60% of sessions | Route analytics |
| Feature adoption: Diary | 40% of Sims have entries | Computed |
| Bug reports | < 2/month | User feedback |
| Image upload success rate | > 95% | Error logging |

---

## 9. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Open Firestore rules exploited | Data loss/corruption | Medium | Implement Firebase Auth (v3.0 P0) |
| Firebase free tier exceeded | Service disruption | Low | Monitor usage, set budget alerts |
| Tesseract.js accuracy too low | Feature abandonment | Medium | Offer manual correction, improve preprocessing |
| Single point of failure (one Firebase project) | Total data loss | Low | Weekly automated backups via Cloud Functions |
| EA/Maxis IP concerns | Takedown request | Very Low | No copyrighted assets, user-generated content only |

---

## 10. Release Plan

| Release | Date | Scope |
|---------|------|-------|
| v1.0 | 2025-02 | Core features (worlds, houses, Sims, relationships, diary, family tree, OCR) |
| v1.1 | 2025-02 | Bug fixes, Swedish UI |
| v2.0 | 2026-02-25 | English UI, image bug fix, planned Sims, music player, profile system |
| v3.0 | 2026-Q2 | Firebase Auth, real-time sync, PWA, timeline view |
| v3.1 | 2026-Q3 | Generation tracker, export/import, challenge templates |

---

## Appendix A: Competitive Landscape

| Solution | Type | Pros | Cons |
|----------|------|------|------|
| Notion templates | Generic tool | Flexible, free | Not Sims-specific, no visualization |
| Plumbella's Legacy Tracker | PDF | Popular community resource | Static, no interactivity |
| Sims 4 in-game family tree | Built-in | Always available | Limited, no cross-save, no custom data |
| Spreadsheets | Generic | Familiar | Ugly, no images, no graph |
| **Simaja** | **Purpose-built web app** | **Sims-specific UX, visual, interactive, multi-profile** | **No mobile app yet, password auth only** |

## Appendix B: User Stories

```
As a Sims player, I want to...
├── Track all my Sims across multiple worlds, so I don't forget anyone
├── See my family tree visually, so I understand relationships at a glance
├── Add diary entries for life events, so I can replay my Sims' stories
├── Plan Sims before creating them in-game, so I start CAS with a clear vision
├── Import Sim data from screenshots, so I don't have to type everything
├── Listen to Sims music while planning, so I stay in the mood
├── Switch between save file profiles, so each save has its own data
├── Quick-add a Sim with minimal info, so it doesn't interrupt my gameplay
└── Export my data, so I have a backup and can share with friends
```
