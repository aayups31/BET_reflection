import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CHAPTERS, chapterIndex } from '../lib/chapters';

export function Atmosphere() {
  const light = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const { pathname } = useLocation();
  const chapter = CHAPTERS[chapterIndex(pathname)];

  useEffect(() => {
    const root = document.documentElement;
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    root.dataset.route = pathname === '/' ? 'arrival' : pathname.slice(1);

    const onPointerMove = (event: PointerEvent) => {
      if (!light.current || coarsePointer.matches || frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        if (!light.current) return;
        light.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [pathname]);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__base" />
      <div className="atmosphere__orb atmosphere__orb--one" />
      <div className="atmosphere__orb atmosphere__orb--two" />
      <svg className="atmosphere__contours" viewBox="0 0 1600 1000" preserveAspectRatio="none">
        <path d="M-80 770C180 520 420 900 690 620S1220 260 1690 490" />
        <path d="M-120 820C160 560 430 940 720 665S1260 315 1730 540" />
        <path d="M-140 875C160 620 450 980 760 725S1320 380 1750 610" />
      </svg>
      <div className="atmosphere__route-word" key={chapter.path}>{chapter.label}</div>
      <div className="atmosphere__horizon" />
      <div className="atmosphere__light" ref={light} />
      <div className="atmosphere__vignette" />
    </div>
  );
}
