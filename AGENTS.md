# AGENTS.md — Simaja

**Läs `CONTEXT.md` först** innan du ändrar något.

## Kontrakt

- Ändrar du struktur, data eller Firestore-schema: **uppdatera `CONTEXT.md`
  i samma commit**.
- Vue 3 + Vite + Pinia + Tailwind. Fel som ofta görs här:
  - **Inga PWA/offline-funktioner** finns i verkligheten — bygg inte värre.
  - Firestore-reglerna tillåter bara inloggad skrivning; utöka INTE med bara
    `auth != null` utan att granska vad samlingarna kräver.
  - `VITE_APP_PASSWORD` är ett oanvänt arv — behåll i `.env.example` men
    förändra inte Auth-flödet utan knuff.
- Lägg aldrig in fler stora mediafiler (MP3/bilder) — de gör repo-historiken
  och kloningen tung.
- Lokalt: `cp .env.example .env && npm run dev`. Test/deploy via
  `npm run build` + Firebase.