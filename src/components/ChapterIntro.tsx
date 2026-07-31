import type { ReactNode } from 'react';
import { Reveal, Eyebrow } from './Reveal';

export function ChapterIntro({
  number,
  label,
  title,
  align = 'left',
}: {
  number: string;
  label: string;
  title: ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <section className={`chapter-intro chapter-intro--${align}`}>
      <Reveal>
        <Eyebrow>{number} / {label}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h1>{title}</h1>
      </Reveal>
    </section>
  );
}
