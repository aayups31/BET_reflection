import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { EXPERIENCE_START_EVENT } from './LoadingScreen';

type Track = {
  title: string;
  artist: string;
  file: string;
};

const CROSSFADE_MS = 6000;
const CROSSFADE_SECONDS = CROSSFADE_MS / 1000;

const TRACKS: Track[] = [
  { title: 'Can You Hear The Music', artist: 'Hans Zimmer', file: '/audio/can-you-hear-the-music.mp3' },
  { title: 'Cornfield Chase', artist: 'Hans Zimmer', file: '/audio/cornfield-chase.mp3' },
  { title: 'No Time for Caution', artist: 'Hans Zimmer', file: '/audio/no-time-for-caution.mp3' },
  { title: 'Time', artist: 'Hans Zimmer', file: '/audio/time.mp3' },
];

export function Soundtrack() {
  const deckARef = useRef<HTMLAudioElement>(null);
  const deckBRef = useRef<HTMLAudioElement>(null);
  const activeDeck = useRef<0 | 1>(0);
  const deckTracks = useRef<[number, number]>([0, 1]);
  const currentIndex = useRef(0);
  const continuePlaying = useRef(false);
  const crossfading = useRef(false);
  const fadeFrame = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('Four bundled soundtracks with six-second crossfades.');

  const track = TRACKS[index];
  const title = useMemo(() => `${track.title} — ${track.artist}`, [track]);

  const getDeck = useCallback((deck: 0 | 1) => (
    deck === 0 ? deckARef.current : deckBRef.current
  ), []);

  const primeDeck = useCallback((deck: 0 | 1, trackIndex: number, volume: number) => {
    const audio = getDeck(deck);
    if (!audio) return;
    audio.pause();
    audio.src = TRACKS[trackIndex].file;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.load();
    deckTracks.current[deck] = trackIndex;
  }, [getDeck]);

  const stopFadeFrame = useCallback(() => {
    if (fadeFrame.current !== null) cancelAnimationFrame(fadeFrame.current);
    fadeFrame.current = null;
    crossfading.current = false;
  }, []);

  const selectWithoutPlayback = useCallback((nextIndex: number) => {
    stopFadeFrame();
    const selectedDeck = activeDeck.current;
    const inactiveDeck = (1 - selectedDeck) as 0 | 1;
    primeDeck(selectedDeck, nextIndex, 1);
    primeDeck(inactiveDeck, (nextIndex + 1) % TRACKS.length, 0);
    currentIndex.current = nextIndex;
    setIndex(nextIndex);
    setPlaying(false);
    setMessage(`${TRACKS[nextIndex].title} is ready.`);
  }, [primeDeck, stopFadeFrame]);

  const crossfadeTo = useCallback(async (nextIndex: number) => {
    if (crossfading.current || !continuePlaying.current) return;
    const outgoingDeck = activeDeck.current;
    const incomingDeck = (1 - outgoingDeck) as 0 | 1;
    const outgoing = getDeck(outgoingDeck);
    const incoming = getDeck(incomingDeck);
    if (!outgoing || !incoming) return;

    crossfading.current = true;
    incoming.pause();
    incoming.src = TRACKS[nextIndex].file;
    incoming.currentTime = 0;
    incoming.volume = 0;
    incoming.load();
    deckTracks.current[incomingDeck] = nextIndex;

    try {
      await incoming.play();
    } catch {
      crossfading.current = false;
      outgoing.pause();
      outgoing.src = TRACKS[nextIndex].file;
      outgoing.currentTime = 0;
      outgoing.volume = 1;
      outgoing.load();
      deckTracks.current[outgoingDeck] = nextIndex;
      currentIndex.current = nextIndex;
      setIndex(nextIndex);
      try {
        await outgoing.play();
        setPlaying(true);
        setMessage(`Playing ${TRACKS[nextIndex].title}.`);
      } catch {
        continuePlaying.current = false;
        setPlaying(false);
        setOpen(true);
        setMessage('Press play to continue the bundled soundtrack.');
      }
      return;
    }

    activeDeck.current = incomingDeck;
    currentIndex.current = nextIndex;
    setIndex(nextIndex);
    setPlaying(true);
    setMessage(`Crossfading into ${TRACKS[nextIndex].title}.`);
    const startedAt = performance.now();
    const outgoingStartVolume = outgoing.volume;

    const updateFade = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / CROSSFADE_MS);
      outgoing.volume = Math.max(0, Math.cos(progress * Math.PI * 0.5) * outgoingStartVolume);
      incoming.volume = Math.min(1, Math.sin(progress * Math.PI * 0.5));

      if (progress < 1 && continuePlaying.current) {
        fadeFrame.current = requestAnimationFrame(updateFade);
        return;
      }

      outgoing.pause();
      outgoing.volume = 0;
      incoming.volume = 1;
      fadeFrame.current = null;
      crossfading.current = false;
      primeDeck(outgoingDeck, (nextIndex + 1) % TRACKS.length, 0);
      if (continuePlaying.current) {
        setMessage('Playing with six-second crossfades across every chapter.');
      }
    };

    fadeFrame.current = requestAnimationFrame(updateFade);
  }, [getDeck, primeDeck]);

  useEffect(() => {
    primeDeck(0, 0, 1);
    primeDeck(1, 1, 0);
    return stopFadeFrame;
  }, [primeDeck, stopFadeFrame]);

  useEffect(() => {
    const startWithExperience = () => {
      const audio = getDeck(activeDeck.current);
      if (!audio) return;
      continuePlaying.current = true;
      audio.volume = 1;
      void audio.play().then(() => {
        setPlaying(true);
        setMessage('Playing with six-second crossfades across every chapter.');
      }).catch(() => {
        continuePlaying.current = false;
        setPlaying(false);
        setMessage('Press play to start the bundled soundtrack.');
      });
    };

    window.addEventListener(EXPERIENCE_START_EVENT, startWithExperience);
    return () => window.removeEventListener(EXPERIENCE_START_EVENT, startWithExperience);
  }, [getDeck]);

  async function togglePlayback() {
    const audio = getDeck(activeDeck.current);
    if (!audio) return;

    if (playing) {
      stopFadeFrame();
      continuePlaying.current = false;
      const inactiveDeck = (1 - activeDeck.current) as 0 | 1;
      const inactive = getDeck(inactiveDeck);
      audio.pause();
      audio.volume = 1;
      if (inactive) {
        inactive.pause();
        inactive.volume = 0;
      }
      setIndex(deckTracks.current[activeDeck.current]);
      currentIndex.current = deckTracks.current[activeDeck.current];
      setPlaying(false);
      setMessage('Soundtrack paused.');
      return;
    }

    try {
      continuePlaying.current = true;
      audio.volume = 1;
      await audio.play();
      setPlaying(true);
      setMessage('Playing with six-second crossfades across every chapter.');
    } catch {
      continuePlaying.current = false;
      setOpen(true);
      setMessage('The bundled audio could not be played in this browser.');
    }
  }

  function move(direction: number) {
    const nextIndex = (currentIndex.current + direction + TRACKS.length) % TRACKS.length;
    if (continuePlaying.current) void crossfadeTo(nextIndex);
    else selectWithoutPlayback(nextIndex);
  }

  function handleTimeUpdate(deck: 0 | 1) {
    if (deck !== activeDeck.current || crossfading.current || !continuePlaying.current) return;
    const audio = getDeck(deck);
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const remaining = audio.duration - audio.currentTime;
    if (remaining <= CROSSFADE_SECONDS + 0.15 && remaining > 0) {
      void crossfadeTo((currentIndex.current + 1) % TRACKS.length);
    }
  }

  function handleEnded(deck: 0 | 1) {
    if (deck === activeDeck.current && !crossfading.current && continuePlaying.current) {
      void crossfadeTo((currentIndex.current + 1) % TRACKS.length);
    }
  }

  function handleError(deck: 0 | 1) {
    if (deck !== activeDeck.current) return;
    stopFadeFrame();
    continuePlaying.current = false;
    setPlaying(false);
    setMessage(`Could not load ${TRACKS[deckTracks.current[deck]].file}.`);
  }

  return (
    <div className={`soundtrack ${open ? 'is-open' : ''}`}>
      <audio
        ref={deckARef}
        preload="auto"
        onTimeUpdate={() => handleTimeUpdate(0)}
        onEnded={() => handleEnded(0)}
        onError={() => handleError(0)}
      />
      <audio
        ref={deckBRef}
        preload="auto"
        onTimeUpdate={() => handleTimeUpdate(1)}
        onEnded={() => handleEnded(1)}
        onError={() => handleError(1)}
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
