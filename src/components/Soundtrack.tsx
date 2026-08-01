import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { EXPERIENCE_START_EVENT } from './LoadingScreen';

type Track = {
  title: string;
  artist: string;
  file: string;
  cueIn?: number;
  cueOut?: number;
};

const TRACKS: Track[] = [
  {
    title: 'Can You Hear The Music',
    artist: 'Hans Zimmer',
    file: '/audio/can-you-hear-the-music.mp3',
    
  },
  {
    title: 'Cornfield Chase',
    artist: 'Hans Zimmer',
    file: '/audio/cornfield-chase.mp3',
    cueIn: 24,
    
  },
  {
    title: 'No Time for Caution',
    artist: 'Hans Zimmer',
    file: '/audio/no-time-for-caution.mp3',
    cueIn: 30,
    
  },
  {
    title: 'Time',
    artist: 'Hans Zimmer',
    file: '/audio/time.mp3',
    cueIn: 5,
    
  },
];

export function Soundtrack() {
  const deckARef = useRef<HTMLAudioElement>(null);
  const deckBRef = useRef<HTMLAudioElement>(null);
  const activeDeck = useRef<0 | 1>(0);
  const deckTracks = useRef<[number, number]>([0, 1]);
  const currentIndex = useRef(0);
  const continuePlaying = useRef(false);
  const switchId = useRef(0);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('Four bundled soundtracks with clean, direct transitions.');

  const track = TRACKS[index];
  const title = useMemo(() => `${track.title} — ${track.artist}`, [track]);

  const getDeck = useCallback((deck: 0 | 1) => (
    deck === 0 ? deckARef.current : deckBRef.current
  ), []);

  const seekToCueIn = useCallback((audio: HTMLAudioElement, deck: 0 | 1, trackIndex: number) => {
    const seek = () => {
      if (deckTracks.current[deck] !== trackIndex) return;
      try {
        audio.currentTime = TRACKS[trackIndex].cueIn ?? 0;
      } catch {
        // The metadata listener below will retry once the browser can seek.
      }
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) seek();
    else audio.addEventListener('loadedmetadata', seek, { once: true });
  }, []);

  const primeDeck = useCallback((deck: 0 | 1, trackIndex: number, volume: number) => {
    const audio = getDeck(deck);
    if (!audio) return;
    audio.pause();
    audio.src = TRACKS[trackIndex].file;
    audio.volume = volume;
    deckTracks.current[deck] = trackIndex;
    audio.load();
    seekToCueIn(audio, deck, trackIndex);
  }, [getDeck, seekToCueIn]);

  const selectWithoutPlayback = useCallback((nextIndex: number) => {
    switchId.current += 1;
    const selectedDeck = activeDeck.current;
    const inactiveDeck = (1 - selectedDeck) as 0 | 1;
    primeDeck(selectedDeck, nextIndex, 1);
    primeDeck(inactiveDeck, (nextIndex + 1) % TRACKS.length, 0);
    currentIndex.current = nextIndex;
    setIndex(nextIndex);
    setPlaying(false);
    setMessage(`${TRACKS[nextIndex].title} is ready.`);
  }, [primeDeck]);

  const switchTo = useCallback(async (nextIndex: number) => {
    if (!continuePlaying.current) {
      selectWithoutPlayback(nextIndex);
      return;
    }

    const transition = switchId.current + 1;
    switchId.current = transition;
    const outgoingDeck = activeDeck.current;
    const incomingDeck = (1 - outgoingDeck) as 0 | 1;
    const outgoing = getDeck(outgoingDeck);
    const incoming = getDeck(incomingDeck);
    if (!outgoing || !incoming) return;

    const alreadyPreloaded = deckTracks.current[incomingDeck] === nextIndex
      && incoming.src.endsWith(TRACKS[nextIndex].file);

    outgoing.pause();
    outgoing.volume = 0;
    incoming.pause();
    if (!alreadyPreloaded) {
      incoming.src = TRACKS[nextIndex].file;
      incoming.load();
    }
    deckTracks.current[incomingDeck] = nextIndex;
    seekToCueIn(incoming, incomingDeck, nextIndex);
    incoming.volume = 1;
    activeDeck.current = incomingDeck;
    currentIndex.current = nextIndex;
    setIndex(nextIndex);
    setMessage(`Playing ${TRACKS[nextIndex].title}.`);

    try {
      await incoming.play();
    } catch {
      if (transition !== switchId.current) return;
      continuePlaying.current = false;
      setPlaying(false);
      setOpen(true);
      setMessage('Press play to continue the bundled soundtrack.');
      return;
    }

    if (transition !== switchId.current) return;
    setPlaying(true);
    primeDeck(outgoingDeck, (nextIndex + 1) % TRACKS.length, 0);
  }, [getDeck, primeDeck, seekToCueIn, selectWithoutPlayback]);

  useEffect(() => {
    primeDeck(0, 0, 1);
    primeDeck(1, 1, 0);
    return () => {
      switchId.current += 1;
    };
  }, [primeDeck]);

  useEffect(() => {
    const startWithExperience = () => {
      const audio = getDeck(activeDeck.current);
      if (!audio) return;
      continuePlaying.current = true;
      audio.volume = 1;
      void audio.play().then(() => {
        setPlaying(true);
        setMessage('Playing continuously across every chapter.');
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
      switchId.current += 1;
      continuePlaying.current = false;
      audio.pause();
      setPlaying(false);
      setMessage('Soundtrack paused.');
      return;
    }

    try {
      continuePlaying.current = true;
      audio.volume = 1;
      await audio.play();
      setPlaying(true);
      setMessage('Playing continuously across every chapter.');
    } catch {
      continuePlaying.current = false;
      setOpen(true);
      setMessage('The bundled audio could not be played in this browser.');
    }
  }

  function move(direction: number) {
    const nextIndex = (currentIndex.current + direction + TRACKS.length) % TRACKS.length;
    void switchTo(nextIndex);
  }

  function handleTimeUpdate(deck: 0 | 1) {
    if (deck !== activeDeck.current || !continuePlaying.current) return;
    const audio = getDeck(deck);
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const trackEnd = Math.min(TRACKS[deckTracks.current[deck]].cueOut ?? audio.duration, audio.duration);
    if (audio.currentTime >= trackEnd) {
      void switchTo((currentIndex.current + 1) % TRACKS.length);
    }
  }

  function handleEnded(deck: 0 | 1) {
    if (deck === activeDeck.current && continuePlaying.current) {
      void switchTo((currentIndex.current + 1) % TRACKS.length);
    }
  }

  function handleError(deck: 0 | 1) {
    if (deck !== activeDeck.current) return;
    switchId.current += 1;
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
