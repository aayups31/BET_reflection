import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { EXPERIENCE_START_EVENT } from './LoadingScreen';

type Track = {
  title: string;
  artist: string;
  file: string;
};

const TRACKS: Track[] = [
  { title: 'Can You Hear The Music', artist: 'Hans Zimmer', file: '/audio/can-you-hear-the-music.mp3' },
  { title: 'Cornfield Chase', artist: 'Hans Zimmer', file: '/audio/cornfield-chase.mp3' },
  { title: 'Time', artist: 'Hans Zimmer', file: '/audio/time.mp3' },
  { title: 'No Time for Caution', artist: 'Hans Zimmer', file: '/audio/no-time-for-caution.mp3' },
];

export function Soundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const continuePlaying = useRef(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('Press play once; music continues across chapters.');

  const track = TRACKS[index];

  useEffect(() => {
    const startWithExperience = () => {
      const audio = audioRef.current;
      if (!audio) return;
      continuePlaying.current = true;
      void audio.play().then(() => {
        setPlaying(true);
        setMessage('Playing the bundled soundtrack across every chapter.');
      }).catch(() => {
        continuePlaying.current = false;
        setPlaying(false);
        setMessage('Press play to start the bundled soundtrack.');
      });
    };

    window.addEventListener(EXPERIENCE_START_EVENT, startWithExperience);
    return () => window.removeEventListener(EXPERIENCE_START_EVENT, startWithExperience);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    if (!continuePlaying.current) {
      setPlaying(false);
      return;
    }
    void audio.play().catch(() => {
      continuePlaying.current = false;
      setPlaying(false);
      setMessage('Press play to continue the bundled soundtrack.');
    });
  }, [index]);

  const title = useMemo(() => `${track.title} — ${track.artist}`, [track]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      continuePlaying.current = false;
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      continuePlaying.current = true;
      await audio.play();
      setPlaying(true);
      setMessage('Playing the bundled soundtrack across every chapter.');
    } catch {
      continuePlaying.current = false;
      setOpen(true);
      setMessage('The bundled audio could not be played in this browser.');
    }
  }

  function move(direction: number) {
    setIndex((current) => (current + direction + TRACKS.length) % TRACKS.length);
  }

  return (
    <div className={`soundtrack ${open ? 'is-open' : ''}`}>
      <audio
        ref={audioRef}
        src={track.file}
        preload="metadata"
        onEnded={() => move(1)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          continuePlaying.current = false;
          setPlaying(false);
          setMessage(`Could not load ${track.file}.`);
        }}
      />

      <button
        className="soundtrack__master"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Close soundtrack controls' : 'Open soundtrack controls'}
      >
        {playing ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        <span>Soundtrack</span>
      </button>

      <div className="soundtrack__panel" aria-hidden={!open}>
        <div className="soundtrack__now">
          <Music2 aria-hidden="true" />
          <div>
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
          </div>
          <button
            className="soundtrack__minimize"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimize soundtrack controls"
          >
            <Minimize2 aria-hidden="true" />
          </button>
        </div>

        <div className="soundtrack__controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous soundtrack">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={togglePlayback} aria-label={playing ? `Pause ${title}` : `Play ${title}`}>
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next soundtrack">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <p>{message}</p>
      </div>
    </div>
  );
}
