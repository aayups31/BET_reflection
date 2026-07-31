import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CHAPTERS } from '../lib/chapters';

type PageShellProps = {
  chapter: number;
  title: string;
  children: React.ReactNode;
  hideNext?: boolean;
};

export function PageShell({ chapter, title, children, hideNext = false }: PageShellProps) {
  const next = CHAPTERS[chapter + 1];

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} — BET Reflection`;
  }, [title]);

  return (
    <main className="page">
      <div className="page-camera">
        {children}
        {!hideNext && next && (
          <footer className="next-chapter">
            <p>Next / {next.kicker}</p>
            <Link to={next.path}>
              <span>{next.label}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </footer>
        )}
      </div>
    </main>
  );
}
