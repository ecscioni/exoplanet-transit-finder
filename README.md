# Exoplanet Transit Finder

An interactive learning app where users explore a stylized star field, open candidate evidence dashboards, and decide whether each signal is likely an exoplanet transit.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion
- Plotly charts
- Zustand local progress state

## Run locally
```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## App flow
1. Explore stars in `/explore`.
2. Click a star to open `/candidate/[id]`.
3. Inspect raw, detrended, and folded curves.
4. Submit yes/no verdict.
5. Review feedback, progress, and history.
