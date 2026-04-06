# 🎀 For Amruta — Birthday Website V3

## Quick Start
```bash
npm install
npm run dev
# Open http://localhost:3000
# Password: amruta
```

## 🎤 Adding Your Voice Note
1. Record yourself singing Happy Birthday on your phone
2. Export as MP3
3. Rename it to: `birthday-voice.mp3`
4. Drop it into the `/public` folder
5. Done — it plays automatically when she clicks Play

## 📸 Adding Photos (Polaroid Wall)
Open `src/scenes/PolaroidWall.jsx`
Upload photos to GitHub → get Raw URL → replace `img: null`:
```js
img: 'https://raw.githubusercontent.com/USERNAME/REPO/main/photo.jpg',
```

## ✏️ Personalise Everything

| What | File | Find |
|------|------|------|
| Story panels | `OurStory.jsx` | `const PANELS` |
| Reasons | `HeartReasons.jsx` | `const REASONS` |
| Poem lines | `AIPoem.jsx` | `const LINES` |
| Final message | `GrandFinale.jsx` | `const MESSAGE` |
| Last message | `GrandFinale.jsx` | `const FINAL` |

## 🌐 Deploy Free (5 minutes)
```bash
npm run build
# Drag the dist/ folder to netlify.com
# She gets: amruta-birthday.netlify.app
```

## Scene Order
1. ❤️ Heart draws itself → beats → opens like a curtain
2. 🔐 Playful loading screen with password checkpoint
3. 🌌 8000-star galaxy with her name + Dec 13 & Apr 8 dates
4. 📖 Your story — Dec 13th told in 6 panels, tap next
5. 📸 Polaroid wall — drag, flip, see messages
6. 💗 Beating heart — tap to explode → card stack of reasons
7. 🪶 AI poem with transparency note
8. 🎤 Your voice — flower garden visualizer
9. 🎊 Grand finale → hug button → final message → pure red heart forever
