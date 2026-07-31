import { useEffect, useRef, useState } from 'react';
import { Headphones } from 'lucide-react';

export const EXPERIENCE_START_EVENT = 'bet:experience-start';

const AUDIO_FILES = [
  '/audio/can-you-hear-the-music.mp3',
  '/audio/cornfield-chase.mp3',
  '/audio/time.mp3',
  '/audio/no-time-for-caution.mp3',
];

type WirePoint = { x: number; y: number };

function LoadingWires() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!canvas || reducedMotion || !finePointer) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const wireCount = 3;
    const pointCount = 34;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastMove = 0;
    let hasPointer = false;
    const target = { x: 0, y: 0 };
    const wires: WirePoint[][] = Array.from({ length: wireCount }, () => []);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const seedWires = (x: number, y: number) => {
      wires.forEach((wire, wireIndex) => {
        const offset = (wireIndex - 1) * 6;
        wire.length = 0;
        for (let index = 0; index < pointCount; index += 1) {
          wire.push({ x: x - index * 6.5, y: y + offset });
        }
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      lastMove = performance.now();
      if (!hasPointer) {
        hasPointer = true;
        seedWires(target.x, target.y);
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    function draw(time: number) {
      frame = 0;
      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';
      const idle = time - lastMove;
      const opacity = idle < 200 ? 1 : Math.max(0, 1 - (idle - 200) / 600);
      if (!hasPointer || opacity <= 0) return;

      wires.forEach((wire, wireIndex) => {
        const offset = (wireIndex - 1) * 7;
        const head = wire[0];
        head.x += (target.x - head.x) * 0.3;
        head.y += (target.y + offset - head.y) * 0.3;

        for (let index = 1; index < wire.length; index += 1) {
          const point = wire[index];
          const previous = wire[index - 1];
          const follow = Math.max(0.12, 0.265 - index * 0.0043);
          point.x += (previous.x - point.x) * follow;
          point.y += (previous.y - point.y) * follow;
        }

        const tail = wire[wire.length - 1];
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        for (let index = wire.length - 2; index > 0; index -= 1) {
          const point = wire[index];
          const next = wire[index - 1];
          context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
        }
        context.lineTo(head.x, head.y);

        const halo = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        halo.addColorStop(0, 'rgba(188, 134, 50, 0)');
        halo.addColorStop(0.34, `rgba(205, 151, 61, ${0.018 * opacity})`);
        halo.addColorStop(0.76, `rgba(224, 178, 90, ${0.065 * opacity})`);
        halo.addColorStop(1, `rgba(255, 215, 135, ${0.14 * opacity})`);
        context.lineWidth = 28;
        context.strokeStyle = halo;
        context.stroke();

        const glow = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        glow.addColorStop(0, 'rgba(200, 154, 75, 0)');
        glow.addColorStop(0.34, `rgba(219, 174, 88, ${0.045 * opacity})`);
        glow.addColorStop(0.76, `rgba(239, 198, 118, ${0.2 * opacity})`);
        glow.addColorStop(1, `rgba(255, 225, 159, ${0.42 * opacity})`);
        context.lineWidth = 8;
        context.strokeStyle = glow;
        context.stroke();

        const core = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        core.addColorStop(0, 'rgba(219, 177, 97, 0)');
        core.addColorStop(0.28, `rgba(224, 181, 101, ${0.11 * opacity})`);
        core.addColorStop(0.72, `rgba(242, 206, 136, ${0.58 * opacity})`);
        core.addColorStop(1, `rgba(255, 235, 190, ${0.94 * opacity})`);
        context.lineWidth = 1.45;
        context.strokeStyle = core;
        context.stroke();

        for (let index = 4; index < wire.length - 2; index += 6) {
          const point = wire[index];
          const fade = (1 - index / wire.length) * opacity;
          context.beginPath();
          context.arc(point.x, point.y, 1.45, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 229, 169, ${0.72 * fade})`;
          context.fill();
        }
      });

      for (let loop = 0; loop < 3; loop += 1) {
        const rotation = time * 0.0012 * (loop % 2 === 0 ? 1 : -1) + loop * 0.9;
        context.beginPath();
        context.ellipse(target.x, target.y, 15 + loop * 7, 6 + loop * 3.2, rotation, 0.2, Math.PI * 1.82);
        context.lineWidth = 20;
        context.strokeStyle = `rgba(211, 157, 65, ${0.055 * opacity})`;
        context.stroke();
        context.lineWidth = 6;
        context.strokeStyle = `rgba(238, 193, 111, ${0.18 * opacity})`;
        context.stroke();
        context.lineWidth = 1.35;
        context.strokeStyle = `rgba(255, 229, 168, ${(0.66 - loop * 0.12) * opacity})`;
        context.stroke();
      }

      frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas className="loading-screen__wires" ref={canvasRef} aria-hidden="true" />;
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progressByFile = useRef(AUDIO_FILES.map(() => 0));

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const updateProgress = () => {
      if (!active) return;
      const audioProgress = progressByFile.current.reduce((sum, value) => sum + value, 0) / AUDIO_FILES.length;
      setProgress(Math.min(99, Math.round(12 + audioProgress * 87)));
    };

    async function preloadAudio(url: string, index: number) {
      try {
        const response = await fetch(url, { cache: 'force-cache', signal: controller.signal });
        if (!response.ok) throw new Error(`Unable to preload ${url}`);
        const total = Number(response.headers.get('content-length')) || 0;
        const reader = response.body?.getReader();
        if (!reader) {
          await response.blob();
          progressByFile.current[index] = 1;
          updateProgress();
          return;
        }

        let loaded = 0;
        let complete = false;
        while (!complete) {
          const { done, value } = await reader.read();
          complete = done;
          if (complete) break;
          loaded += value.byteLength;
          progressByFile.current[index] = total ? Math.min(1, loaded / total) : 0.5;
          updateProgress();
        }
      } catch {
        // A missing optional track should not trap the visitor on the loader.
      } finally {
        progressByFile.current[index] = 1;
        updateProgress();
      }
    }

    async function prepareExperience() {
      setProgress(4);
      if ('fonts' in document) await document.fonts.ready;
      if (!active) return;
      setProgress(12);
      await Promise.all(AUDIO_FILES.map(preloadAudio));
      if (!active) return;
      setProgress(100);
      setReady(true);
    }

    void prepareExperience();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  function enterExperience() {
    if (!ready || leaving) return;
    document.documentElement.setAttribute('data-experience-started', 'true');
    window.dispatchEvent(new Event(EXPERIENCE_START_EVENT));
    setLeaving(true);
    window.setTimeout(() => setHidden(true), 650);
  }

  if (hidden) return null;

  return (
    <div className={`loading-screen ${leaving ? 'is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Preparing the reflection">
      <LoadingWires />
      <div className="loading-screen__content">
        <div className="loading-screen__intro">
          <p className="loading-screen__mark">AAYU / BET REFLECTION</p>
          
        </div>
        <div className="loading-screen__hero">
          <p className="loading-screen__promise">04 cinematic soundtracks</p>
          <h1>
            <span>A reflection</span>
            <em>experience</em>
            <span>like no other.</span>
          </h1>
        </div>
        <div className="loading-screen__dock">
          <div className="loading-screen__status">
            <span>{ready ? 'READY' : 'PREPARING EXPERIENCE'}</span>
            <span>{String(progress).padStart(3, '0')}%</span>
          </div>
          <div className="loading-screen__track" aria-label={`Loading ${progress}%`}>
            <div className="loading-screen__fill" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <div className="loading-screen__actions">
            <p className="loading-screen__headphones">
              <Headphones aria-hidden="true" />
              Use headphones for the best experience
            </p>
            <button type="button" onClick={enterExperience} disabled={!ready}>
              {ready ? 'Enter with soundtrack' : 'Loading…'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
