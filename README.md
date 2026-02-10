# Simaja 🎮

> Din personliga app för att hålla koll på dina Sims, deras världar och relationer.

![Simaja](https://img.shields.io/badge/Made%20for-Maja-green?style=for-the-badge)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vuedotjs)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## ✨ Funktioner

- 🌍 **Världar** - Organisera dina Sims i olika världar (Willow Creek, Oasis Springs, etc.)
- 🏠 **Hus** - Skapa hus och tomter i varje värld
- 👤 **Simar** - Registrera alla dina Simar med:
  - Namn, ålder, kön
  - Personlighetsdrag och aspirations
  - Utseende (hårfärg, ögonfärg, klädstil)
  - Karriär och färdigheter
  - Bilder
- 💕 **Relationer** - Koppla ihop Simar med olika relationstyper:
  - Familj (förälder, barn, syskon)
  - Romantiska (partner, ex)
  - Sociala (vän, fiende, roommate, mentor)
- 🌳 **Släktträd** - Interaktiv visualisering av alla relationer med Cytoscape.js
- 📖 **Dagbok** - Dokumentera viktiga händelser för varje Sim
- 📸 **Export** - Exportera släktträdet som bild

## 🚀 Kom igång

### Förutsättningar

- Node.js 18+ 
- npm eller yarn
- Firebase-projekt (gratis)

### Installation

1. **Klona repot**
   ```bash
   git clone https://github.com/din-användare/simaja.git
   cd simaja
   ```

2. **Installera beroenden**
   ```bash
   npm install
   ```

3. **Konfigurera miljövariabler**
   ```bash
   cp .env.example .env
   ```
   Redigera `.env` och fyll i dina Firebase-uppgifter och lösenord.

4. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```

5. Öppna http://localhost:5173 i webbläsaren

### Firebase-setup

1. Skapa ett nytt projekt på [Firebase Console](https://console.firebase.google.com/)
2. Aktivera Firestore Database
3. Aktivera Storage
4. Kopiera konfigurationen till `.env`
5. Deploya Firestore-regler:
   ```bash
   npx firebase deploy --only firestore:rules,storage:rules
   ```

## 📦 Deployment

### Automatisk (GitHub Actions)

1. Lägg till följande secrets i ditt GitHub-repo:
   - `VITE_APP_PASSWORD` - Lösenordet för appen (t.ex. "maja")
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT` - JSON-nyckel för Firebase-tjänstkonto

2. Push till `main`-branchen för att trigga deployment

### Manuell

```bash
npm run build
npx firebase deploy
```

## 🎨 Tech Stack

- **Frontend:** Vue 3 + Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **Styling:** Tailwind CSS
- **Visualisering:** Cytoscape.js
- **Backend:** Firebase (Firestore + Storage)
- **Hosting:** Firebase Hosting

## 📁 Projektstruktur

```
simaja/
├── src/
│   ├── components/       # Vue-komponenter
│   │   ├── forms/        # Formulär för världar, simar, etc.
│   │   └── icons/        # Ikoner (Plumbob)
│   ├── views/            # Sidkomponenter
│   ├── stores/           # Pinia stores
│   ├── services/         # Firebase-tjänster
│   ├── router/           # Vue Router
│   └── style.css         # Global CSS
├── public/               # Statiska filer
├── .env.example          # Mall för miljövariabler
├── firebase.json         # Firebase-konfiguration
├── firestore.rules       # Säkerhetsregler för Firestore
└── storage.rules         # Säkerhetsregler för Storage
```

## 🔐 Säkerhet

- Lösenordet lagras i miljövariabel, inte i koden
- Session sparas i webbläsarens localStorage
- Firestore-regler kan konfigureras för extra säkerhet

## 📝 Licens

MIT © Maja

---

*Gjord med 💚 för The Sims-entusiaster*
