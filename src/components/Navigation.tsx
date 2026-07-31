import { Link, useLocation } from 'react-router-dom';
import { CHAPTERS, chapterIndex } from '../lib/chapters';
import { useExperience } from '../context/ExperienceContext';

export function Navigation() {
  const { pathname } = useLocation();
  const active = chapterIndex(pathname);
  const { reducedMotion, toggleMotion } = useExperience();
  const progress = ((active + 1) / CHAPTERS.length) * 100;

  return (
    <>
      <header className="site-header">
        <Link className="site-mark" to="/" aria-label="Return to the opening">
          <span>AAYU</span>
          <span>BET REFLECTION</span>
        </Link>
        <div className="site-progress" aria-label={`Chapter ${active + 1} of ${CHAPTERS.length}`}>
          <span>{String(active + 1).padStart(2, '0')}</span>
          <div className="site-progress__track">
            <div className="site-progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{String(CHAPTERS.length).padStart(2, '0')}</span>
        </div>
        <button className="motion-toggle" type="button" onClick={toggleMotion}>
          Motion&nbsp; {reducedMotion ? 'calm' : 'full'}
        </button>
      </header>

      <nav className="chapter-nav" aria-label="Reflection chapters">
        {CHAPTERS.map((chapter, index) => (
          <Link
            key={chapter.path}
            to={chapter.path}
            className={index === active ? 'chapter-nav__item is-active' : 'chapter-nav__item'}
            aria-current={index === active ? 'page' : undefined}
          >
            <span>{chapter.number}</span>
            <span>{chapter.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
