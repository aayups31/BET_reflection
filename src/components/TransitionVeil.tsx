import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { CHAPTERS, chapterIndex } from '../lib/chapters';
import { useExperience } from '../context/ExperienceContext';

export function TransitionVeil() {
  const { pathname } = useLocation();
  const { reducedMotion } = useExperience();
  const root = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const index = chapterIndex(pathname);

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return;
    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(root.current, { autoAlpha: 0, pointerEvents: 'none' });
      return;
    }
    const panels = root.current.querySelectorAll('.transition-veil__panel');
    const label = root.current.querySelector('.transition-veil__label');
    const line = root.current.querySelector('.transition-veil__line');

    const timeline = gsap.timeline();
    timeline
      .set(root.current, { autoAlpha: 1, pointerEvents: 'auto' })
      .set(panels, { yPercent: 0, force3D: true })
      .set(line, { scaleX: 0 })
      .fromTo(label, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
      .to(line, { scaleX: 1, duration: 0.42, ease: 'power3.inOut' }, '<')
      .to(label, { y: -14, opacity: 0, duration: 0.22, ease: 'power2.in' }, '+=0.04')
      .to(line, { opacity: 0, duration: 0.16 }, '<')
      .to(panels, { yPercent: -102, duration: 0.86, stagger: 0.055, ease: 'power4.inOut', force3D: true }, '<')
      .set(root.current, { autoAlpha: 0, pointerEvents: 'none' });

    return () => timeline.kill();
  }, [pathname, reducedMotion]);

  return (
    <div className="transition-veil" ref={root} aria-hidden="true">
      <div className="transition-veil__panel transition-veil__panel--one" />
      <div className="transition-veil__panel transition-veil__panel--two" />
      <div className="transition-veil__content">
        <span className="transition-veil__label">{CHAPTERS[index].number} / {CHAPTERS[index].label}</span>
        <span className="transition-veil__line" />
      </div>
    </div>
  );
}
