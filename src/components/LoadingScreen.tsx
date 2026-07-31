import { useEffect, useRef, useState } from 'react';
import { Headphones } from 'lucide-react';

export const EXPERIENCE_START_EVENT = 'bet:experience-start';

const AUDIO_FILES = [
  '/audio/time.mp3',
  '/audio/no-time-for-caution.mp3',
  '/audio/cornfield-chase.mp3',
];

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
      <div className="loading-screen__content">
        <p className="loading-screen__mark">AAYU / BET REFLECTION</p>
        <div className="loading-screen__status">
          <span>{ready ? 'READY' : 'PREPARING EXPERIENCE'}</span>
          <span>{String(progress).padStart(3, '0')}%</span>
        </div>
        <div className="loading-screen__track" aria-label={`Loading ${progress}%`}>
          <div className="loading-screen__fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <p className="loading-screen__headphones">
          <Headphones aria-hidden="true" />
          Use headphones for the best experience
        </p>
        <button type="button" onClick={enterExperience} disabled={!ready}>
          {ready ? 'Enter with soundtrack' : 'Loading…'}
        </button>
      </div>
    </div>
  );
}
