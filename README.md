# The Course I Almost Underestimated

A typography-first, multi-page interactive reflection built with React, TypeScript, Vite, GSAP ScrollTrigger, and CSS.

## What changed in this build

- Replaced the previous Google-font pairing with a local, system-native Helvetica/SF/Avenir stack.
- Removed Framer Motion so one GSAP system controls entrances, scroll depth, and typography.
- Added a locked opening sequence: the page cannot scroll until MATH, MATH, COMPUTER SCIENCE, COMPUTER SCIENCE, and BET have all resolved.
- Rebuilt scroll movement as restrained 3D camera dollies using transform-only animation.
- Removed expensive continuous blur, animated noise, and oversized repainting layers.
- Increased display line-height and safe padding so letters, punctuation, and descenders are not clipped.
- Simplified route transitions into GPU-composited vertical panels.
- Added a soundtrack controller for Time, No Time for Caution, and Cornfield Chase using licensed local audio.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The generated production files are written to `dist/`.

## Soundtrack

The site plays the bundled files in `public/audio/`:

- `time.mp3`
- `no-time-for-caution.mp3`
- `cornfield-chase.mp3`
- `can-you-hear-the-music.mp3`

The soundtrack begins when the visitor enters the experience and continues across chapter navigation. Browsers require that initial visitor interaction before audio can begin.

## Structure

- `src/pages/` — the nine reflection chapters
- `src/components/ScrollDirector.tsx` — opening lock, reveals, scroll camera, and chapter motion
- `src/components/Soundtrack.tsx` — local/licensed soundtrack controller
- `src/components/Atmosphere.tsx` — lightweight route atmosphere
- `src/lib/chapters.ts` — chapter labels and route order
- `src/index.css` — visual system, responsive behaviour, typography, and spacing fixes
- `public/audio/tracks.json` — soundtrack metadata

## Motion and accessibility

- The top-right motion toggle switches between full and calm motion.
- System-level reduced-motion preferences are respected automatically.
- Mobile avoids desktop 3D camera transforms.
- Navigation and soundtrack controls are keyboard accessible.
- The opening scroll lock is brief and automatically released after the course labels finish.

## Deployment

The included `vercel.json` rewrites nested routes to `/index.html`, so the repository can be imported directly into Vercel with the Vite preset and default build settings.
