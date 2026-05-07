# Dalmatian Species Survival Game

A retro arcade-style ecology web game built for an environment outreach project. Players choose between the Apollo Butterfly and Griffon Vulture, avoid obstacles, collect Dalmatian karst stones, and learn facts about coastal and alpine ecosystems.

## Live Demo

- people.rit.edu: https://people.rit.edu/~pkb4260/
- GitHub Pages: https://pbrunson-007.github.io/damaltia_dash/

## Technologies Used

- HTML
- CSS
- Vanilla JavaScript
- HTML5 Canvas
- Vite
- GitHub Pages
- people.rit.edu deployment

## Project Purpose

This project was created as an environment outreach experience that combines arcade gameplay with ecological education. The game introduces players to species and habitats connected to Dalmatian coastal, karst, and alpine environments through a simple, replayable browser game.

## Gameplay Overview

Players select either the Apollo Butterfly or the Griffon Vulture, then navigate a retro arcade course rendered with HTML5 Canvas. The goal is to avoid hazards, collect Dalmatian karst stones, and survive long enough to earn a high score. The game includes touch-friendly controls for mobile play, sound effects, and a local leaderboard saved in the browser.

## Ecology and Education

The game uses short educational facts and species-themed play to connect the player with regional ecology. The Apollo Butterfly and Griffon Vulture represent vulnerable wildlife connected to mountain, coastal, and karst ecosystems. Collectible Dalmatian karst stones reinforce the setting while obstacles and survival mechanics create a lightweight model of environmental pressure.

## Portfolio Value

This project demonstrates:

- frontend development
- responsive design
- mobile touch interaction
- HTML5 Canvas game logic
- localStorage leaderboard
- Web Audio API sound effects
- retro arcade UI design
- educational UX
- deployment workflow

## Team Members

- Manuel Erraez Delgado — Hospitality and Tourism Management / Marketing
- Borna Škec — Web and Mobile Computing
- Prophet K.C Brunson — Web and Mobile Computing

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

## Deployment Notes

The production build is generated in `dist/`. Vite is configured with a relative base path so the bundled JavaScript and CSS load correctly from both GitHub Pages and the `people.rit.edu/~pkb4260/` subdirectory.

To deploy to people.rit.edu:

```bash
npm run build
scp -O -r dist/* pkb4260@banjo.rit.edu:~/www/
```

Do not upload the repository root for production deployment. Upload the contents of `dist/` so the built `index.html`, bundled assets, and generated CSS/JavaScript files are served together.
