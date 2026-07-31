import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ChapterIntro } from '../components/ChapterIntro';
import { Body, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

export function ContinuePage() {
  return (
    <PageShell chapter={8} title="Continue" hideNext>
      <ChapterIntro
        number="∞"
        label="Not the end"
        title={<>I entered expecting balance. I left with <em>momentum.</em></>}
        align="right"
      />

      <section className="reading-grid">
        <div className="reading-grid__aside"><p className="margin-word">FORWARD</p></div>
        <div className="reading-grid__copy">
          <Reveal><Body>I want to become an entrepreneur, although I am still discovering exactly what form that will take. It may be venture-scale. It may begin by joining a startup and learning from inside one. It may exist alongside technical work in simulation, artificial intelligence, or visual technology.</Body></Reveal>
          <Reveal delay={0.05}><Body>I do know that I want to begin early, create with ownership, and pursue work that leaves a memory.</Body></Reveal>
          <Reveal delay={0.1}><Body>This course helped me understand that entrepreneurship is not defined by announcing the intention. It is defined by repeatedly choosing to act despite uncertainty.</Body></Reveal>
          <Reveal delay={0.15}><Body>UniMarket is the first continuation point, not the final destination. I will keep you and Roger updated as it develops.</Body></Reveal>
        </div>
      </section>

      <section className="final-statement">
        <Reveal><p>I thought I was adding an easy course.</p></Reveal>
        <Reveal delay={0.16}><PullQuote>I may have changed my trajectory.</PullQuote></Reveal>
      </section>

      <section className="closing">
        <Reveal>
          <p className="closing__line">THE WORK CONTINUES AFTER THE SUBMISSION.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link className="primary-link" to="/">
            Return to the beginning <ArrowUpRight aria-hidden="true" />
          </Link>
        </Reveal>
        <p className="closing__meta">Reflection submitted July 31, 2026 / University of Waterloo</p>
      </section>
    </PageShell>
  );
}
