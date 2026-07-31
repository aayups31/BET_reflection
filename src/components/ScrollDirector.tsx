import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useExperience } from '../context/ExperienceContext';
import { EXPERIENCE_START_EVENT } from './LoadingScreen';

gsap.ticker.lagSmoothing(500, 33);

function lockOpeningScroll() {
  const blockedKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
  const prevent = (event: Event) => event.preventDefault();
  const preventKey = (event: KeyboardEvent) => {
    if (blockedKeys.has(event.key)) event.preventDefault();
  };

  document.documentElement.classList.add('intro-locked');
  window.scrollTo(0, 0);
  window.addEventListener('wheel', prevent, { passive: false });
  window.addEventListener('touchmove', prevent, { passive: false });
  window.addEventListener('keydown', preventKey, { passive: false });

  return () => {
    document.documentElement.classList.remove('intro-locked');
    window.removeEventListener('wheel', prevent);
    window.removeEventListener('touchmove', prevent);
    window.removeEventListener('keydown', preventKey);
  };
}

export function ScrollDirector() {
  const { pathname } = useLocation();
  const { reducedMotion } = useExperience();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) root.removeAttribute('data-motion-ready');
    else root.setAttribute('data-motion-ready', 'true');
    root.removeAttribute('data-opening-ready');

    let unlockOpening = () => undefined;
    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let setupFrame = 0;
    let progressFrame = 0;
    let horizon: HTMLElement | null = null;
    let traits: HTMLElement[] = [];
    let birdScene: HTMLElement | null = null;
    let birdHeading: HTMLElement | null = null;
    let birdStrike: HTMLElement | null = null;
    let birdCorrection: HTMLElement | null = null;

    if (!reducedMotion && pathname === '/') unlockOpening = lockOpeningScroll();

    const updateProgress = () => {
      progressFrame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      root.style.setProperty('--page-progress', progress.toFixed(4));

      const sceneProgress = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      };

      if (horizon) {
        const amount = sceneProgress(horizon);
        const x = -14 - amount * 18;
        const scale = 0.97 + amount * 0.06;
        horizon.style.transform = `translate3d(${x}vw, 0, 0) scale(${scale})`;
      }

      traits.forEach((trait, index) => {
        const amount = sceneProgress(trait);
        const direction = index % 2 === 0 ? -1 : 1;
        const x = direction * (4.5 - amount * 3.5);
        trait.style.transform = `translate3d(${x}%, 0, 0)`;
        trait.style.opacity = String(0.58 + amount * 0.42);
      });

      if (birdScene && birdHeading) {
        const amount = sceneProgress(birdScene);
        const travel = 1 - amount * 2;
        birdHeading.style.transform = `translate3d(${(travel * 3.2).toFixed(2)}vw, ${(travel * 18).toFixed(1)}px, 0) scale(${(0.965 + amount * 0.055).toFixed(4)})`;
        birdHeading.style.textShadow = `0 14px 70px rgba(0,0,0,.45), 0 0 ${(8 + amount * 32).toFixed(1)}px rgba(var(--accent-rgb), ${(0.05 + amount * 0.11).toFixed(3)})`;
        if (birdStrike) {
          const strikeProgress = Math.min(1, Math.max(0, (amount - 0.18) / 0.46));
          birdStrike.style.transform = `scaleX(${strikeProgress.toFixed(4)})`;
          birdStrike.style.opacity = String(0.35 + strikeProgress * 0.65);
        }
        if (birdCorrection) {
          const correctionProgress = Math.min(1, Math.max(0, (amount - 0.42) / 0.35));
          birdCorrection.style.transform = `translate3d(0, ${(24 - correctionProgress * 24).toFixed(1)}px, 0)`;
          birdCorrection.style.opacity = String(0.22 + correctionProgress * 0.78);
        }
      }
    };
    const queueProgressUpdate = () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', queueProgressUpdate, { passive: true });
    window.addEventListener('resize', queueProgressUpdate, { passive: true });
    updateProgress();

    const startAnimations = () => {
      if (context) return;
      context = gsap.context(() => {
        if (reducedMotion) {
          gsap.set('.reveal, [data-opening-row], .pull-quote, .next-chapter a span, .next-chapter a svg', {
            clearProps: 'all',
            opacity: 1,
          });
          root.setAttribute('data-opening-ready', 'true');
          return;
        }

        if (pathname === '/') {
          const rows = gsap.utils.toArray<HTMLElement>('[data-opening-row]');
          const eyebrow = document.querySelector<HTMLElement>('.opening--load .eyebrow');
          const cue = document.querySelector<HTMLElement>('.opening--load .scroll-cue');

          gsap.set(rows, { y: 28, opacity: 0, scale: 0.99 });
          gsap.set(eyebrow, { y: 10, opacity: 0 });
          gsap.set(cue, { opacity: 0, y: 8 });

          gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              unlockOpening();
              root.setAttribute('data-opening-ready', 'true');
              gsap.to(cue, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
            },
          })
            .to(eyebrow, { y: 0, opacity: 1, duration: 0.35 })
            .to(rows, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.075 }, 0.08);
        } else {
          root.setAttribute('data-opening-ready', 'true');
        }

        const title = document.querySelector<HTMLElement>('.chapter-intro h1');
        if (title) {
          gsap.fromTo(title, { y: 30, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.08,
            ease: 'power3.out',
          });
        }

        const reveals = gsap.utils.toArray<HTMLElement>('.reveal').filter(
          (element) => !element.closest('.opening--load, .chapter-intro, .quote-stage'),
        );
        const quotes = gsap.utils.toArray<HTMLElement>('.quote-stage .pull-quote');
        const nextSections = gsap.utils.toArray<HTMLElement>('.next-chapter');

        horizon = document.querySelector<HTMLElement>('.word-horizon');
        traits = gsap.utils.toArray<HTMLElement>('.trait-river p');
        birdScene = document.querySelector<HTMLElement>('.opening--assumption');
        birdHeading = birdScene?.querySelector<HTMLElement>('.opening__bird') ?? null;
        birdStrike = birdScene?.querySelector<HTMLElement>('.opening__strike') ?? null;
        birdCorrection = birdScene?.querySelector<HTMLElement>('.opening__correction') ?? null;
        if (horizon) horizon.style.willChange = 'transform';
        traits.forEach((trait) => {
          trait.style.willChange = 'transform, opacity';
        });
        if (birdHeading) birdHeading.style.willChange = 'transform, text-shadow';
        if (birdStrike) birdStrike.style.willChange = 'transform, opacity';
        if (birdCorrection) birdCorrection.style.willChange = 'transform, opacity';
        queueProgressUpdate();

        gsap.set(reveals, { y: 20, opacity: 0 });
        gsap.set(quotes, { y: 24, opacity: 0.35 });
        nextSections.forEach((section) => {
          gsap.set(section.querySelector('a span'), { x: -18, opacity: 0.5 });
          gsap.set(section.querySelector('a svg'), { x: -12, opacity: 0 });
        });

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            observer?.unobserve(element);

            if (element.classList.contains('next-chapter')) {
              gsap.to(element.querySelector('a span'), { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out' });
              gsap.to(element.querySelector('a svg'), { x: 0, opacity: 1, duration: 0.55, delay: 0.06, ease: 'power3.out' });
              return;
            }

            const delay = element.classList.contains('reveal')
              ? Number(element.dataset.revealDelay ?? 0)
              : 0;
            gsap.to(element, {
              y: 0,
              opacity: 1,
              duration: element.classList.contains('pull-quote') ? 0.8 : 0.62,
              delay,
              ease: 'power3.out',
              clearProps: 'transform',
            });
          });
        }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 });

        reveals.forEach((element) => observer?.observe(element));
        quotes.forEach((element) => observer?.observe(element));
        nextSections.forEach((element) => observer?.observe(element));
      });
    };

    setupFrame = requestAnimationFrame(() => {
      if (root.hasAttribute('data-experience-started')) startAnimations?.();
      else window.addEventListener(EXPERIENCE_START_EVENT, startAnimations as EventListener, { once: true });
    });

    return () => {
      cancelAnimationFrame(setupFrame);
      if (progressFrame) cancelAnimationFrame(progressFrame);
      window.removeEventListener('scroll', queueProgressUpdate);
      window.removeEventListener('resize', queueProgressUpdate);
      window.removeEventListener(EXPERIENCE_START_EVENT, startAnimations as EventListener);
      observer?.disconnect();
      if (horizon) {
        horizon.style.removeProperty('transform');
        horizon.style.removeProperty('will-change');
      }
      traits.forEach((trait) => {
        trait.style.removeProperty('transform');
        trait.style.removeProperty('opacity');
        trait.style.removeProperty('will-change');
      });
      [birdHeading, birdStrike, birdCorrection].forEach((element) => {
        element?.style.removeProperty('transform');
        element?.style.removeProperty('opacity');
        element?.style.removeProperty('text-shadow');
        element?.style.removeProperty('will-change');
      });
      unlockOpening();
      context?.revert();
      root.removeAttribute('data-motion-ready');
      root.removeAttribute('data-opening-ready');
      root.style.removeProperty('--page-progress');
    };
  }, [pathname, reducedMotion]);

  return null;
}
