# Simaja 🎮

> Your personal companion app for tracking your Sims, their worlds, and relationships.

![Simaja](https://img.shields.io/badge/Made%20for-Maja-green?style=for-the-badge)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vuedotjs)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## ✨ Features

- 🌍 **Worlds** — Organize your Sims across different worlds (Willow Creek, Oasis Springs, etc.)
- 🏠 **Houses** — Create houses and lots within each world
- 👤 **Sims** — Register all your Sims with:
  - Name, age, gender
  - Personality traits and aspirations
  - Appearance (hair color, eye color, clothing style)
  - Career and skills
  - Images
- 💭 **Planned Sims** — Create concept Sims before they exist in-game (interests, backstory)
- 💕 **Relationships** — Connect Sims with 9 relationship types:
  - Family (parent, child, sibling)
  - Romantic (spouse, ex)
  - Social (friend, enemy, roommate, mentor)
- 🌳 **Family Tree** — Interactive visualization of all relationships with Cytoscape.js
- 📖 **Diary** — Document important life events for each Sim
- 📸 **Screenshot OCR** — Import Sim data from in-game screenshots using Tesseract.js
- 🎵 **Music Player** — Ambient Sims 2/4 soundtrack while planning
- 💾 **Profiles** — Multiple save file profiles with isolated data
- 📸 **Export** — Export the family tree as an image

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (free tier)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-user/simaja.git
   cd simaja
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your Firebase credentials and password.

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Storage
4. Copy the config values to `.env`
5. Deploy Firestore rules:
   ```bash
   npx firebase deploy --only firestore:rules,storage:rules
   ```

## 📦 Deployment

### Manual

```bash
npm run build
firebase deploy --only hosting:simaja
```

The app is hosted at **https://simaja.web.app**

## 🎨 Tech Stack

- **Frontend:** Vue 3 + Vite 5
- **State Management:** Pinia
- **Routing:** Vue Router 4 (lazy-loaded routes)
- **Styling:** Tailwind CSS 3.4
- **Visualization:** Cytoscape.js + dagre
- **OCR:** Tesseract.js 5 (dynamically imported)
- **Backend:** Firebase (Firestore + Storage)
- **Hosting:** Firebase Hosting
- **Linting:** ESLint 9 + Prettier

## 📁 Project Structure

```
simaja/
├── src/
│   ├── components/       # Vue components
│   │   ├── forms/        # Forms for worlds, sims, etc.
│   │   ├── icons/        # Icons (Plumbob)
│   │   ├── MusicPlayer.vue
│   │   └── ProfilePicker.vue
│   ├── views/            # Page components
│   ├── stores/           # Pinia stores (sims, auth)
│   ├── services/         # Firebase + OCR services
│   ├── data/             # Sims 4 game data (traits, aspirations, etc.)
│   ├── router/           # Vue Router
│   └── style.css         # Global CSS
├── docs/                 # PRD, Roadmap, Audit, Next Steps
├── public/               # Static files
├── .env.example          # Environment variable template
├── eslint.config.js      # ESLint 9 flat config
├── .prettierrc           # Prettier config
├── firebase.json         # Firebase hosting config
├── firestore.rules       # Firestore security rules
└── storage.rules         # Storage security rules
```

## 🔐 Security

- Password stored in environment variable, not in source code
- Firestore rules enforce per-collection data validation on create
- Session persisted in browser localStorage
- **Note:** Firebase Auth (Google/email) planned for v3.0

## 📝 License

MIT © Maja

---

*Made with 💚 for The Sims enthusiasts*
