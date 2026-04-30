# 🐤 Pluck the Duck

A browser-based "don't get caught" game. Sneak feathers off a Donald-style sailor duck — but stop clicking the moment it turns around, or you'll get bit.

Two complete builds in this repo:

- **`index.html`** — full 2D Canvas game (hand-drawn duck, weather, day/night, scoreboard)
- **`3d/index.html`** — full 3D Three.js port with real lighting, shadows, and raycast plucking

## Features

- 🐣 Donald-style duck with sailor hat, bow tie, sleeves and animated tail wiggle
- 🚶 Wandering AI: idle, walking, eating, suspicious, angry, attacking — each with its own visuals
- 🍞 Eating bouts where the duck is grumpier (60% chance to skip the warning)
- 📊 Danger meter that fills with rapid plucks; cross the threshold and the duck snap-bites
- ⭐ 2% golden-feather chance — full pause + popup, score doubles, duck gets permanently angrier
- 🌙 Five-minute day/night cycle with an arcing sun, rising moon, twinkling stars and a sleepy duck after dark (~30 % less aggressive)
- 🌧️ Random storms with rain, wind, lightning + thunder, and a **× 2 score** bonus while active
- 🪨 Rocks that physically roll out of the duck's way as it walks through them
- 🌿 Wind-swayed two-layer grass, drifting clouds, flying birds, atmospheric depth shading
- ⏱️ Per-game timer + best-time tracking
- 👤 Multi-user scoreboard backed by `localStorage`, mirrored to `database.json` via the included `server.js`
- 📱 Mobile-friendly: touch input, safe-area insets, dynamic rain density, audio unlock on first gesture
- 🔊 Custom audio mix: WAV/MP3 reactions for pluck/anger/bite + Web Audio synthesized alert and thunder
- ❓ Built-in **How to Play** modal explaining every system

## Run locally

The static `index.html` works straight from disk — just double-click it.

To enable persisted scores in `database.json` on your machine, start the included Node helper:

```bash
node server.js
# → http://localhost:8000
```

`server.js` is a ~80-line static file server with a single `POST /api/save-db` endpoint that overwrites `database.json` on disk. Without it, scores still persist via `localStorage`.

### 3D version

```bash
# served by the same server
open http://localhost:8000/3d/
```

Three.js loads from a CDN; no install required.

## Deploy

The simplest free deploy paths:

- **Vercel + Vercel KV** — convert `server.js` into `api/save-db.js` + `api/load-db.js` serverless functions, attach Vercel KV. Static frontend deploys automatically.
- **Cloudflare Pages + Workers KV** — most generous free tier (100 k requests/day).
- **Render Web Service** — `node server.js` runs as-is on Render's free tier; sleeps after 15 min of inactivity.
- **GitHub Pages + Firebase Firestore** — talk to Firestore directly from the browser, no backend code.

## Tech stack

- Pure HTML5 Canvas 2D for the main game
- Three.js (r149) for the 3D version, all geometry built procedurally from primitives
- Vanilla JS — no framework, no build step
- Web Audio API for synthesized SFX (alert tone, thunder rumble)
- HTMLAudio for sample-based SFX (pluck, angry quack, bite)
- Node.js standard library only (no `npm install` needed) for the local helper server

## Project layout

```
.
├── index.html          ← 2D game (one file, ~2500 lines)
├── 3d/index.html       ← 3D Three.js game
├── server.js           ← optional Node helper for persisting database.json
├── database.json       ← live scoreboard mirror (also lives in localStorage)
├── *.wav, *.mp3        ← sound effects
└── duck_serious.jpg    ← reference photo used during the duck redesign
```
