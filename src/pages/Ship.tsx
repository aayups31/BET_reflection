import { ChapterIntro } from '../components/ChapterIntro';
import { Body, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

const STEPS = ['IDEA', 'CONVERSATION', 'PROTOTYPE', 'REACTION', 'REVISION', 'PRODUCT'];

export function Ship() {
  return (
    <PageShell chapter={3} title="Ship">
      <ChapterIntro
        number="03"
        label="Ship"
        title={<>An idea becomes real only after it <em>leaves your head.</em></>}
      />

      <section className="process-line" aria-label="UniMarket development process">
        {STEPS.map((step, index) => (
          <Reveal key={step} delay={index * 0.035}>
            <div className="process-line__step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="reading-grid">
        <div className="reading-grid__aside"><p className="margin-word">SHIP</p></div>
        <div className="reading-grid__copy">
          <Reveal><Body>The greatest value of this course was that it forced me to ship UniMarket.</Body></Reveal>
          <Reveal delay={0.05}><Body>I had the idea of creating a verified marketplace for university students, beginning at Waterloo. Without the course, it would have been easy to keep discussing the concept, redesigning it, or waiting for the perfect version.</Body></Reveal>
          <Reveal delay={0.1}><Body>Instead, I had to turn it into something testable. I spoke with potential users, heard stories about scams and stolen items, confronted uninterested buyers, built the product, and had to explain why it should exist beside Facebook Marketplace and Kijiji.</Body></Reveal>
          <Reveal delay={0.15}><Body>That changed my relationship with the idea. UniMarket is no longer simply a class project. It is something I intend to continue after the course, with a much larger long-term vision.</Body></Reveal>
        </div>
      </section>

      <section className="word-horizon" aria-hidden="true">
        <span>UNIMARKET</span>
        <span>UNIMARKET</span>
      </section>

      <section className="quote-stage">
        <Reveal><PullQuote>The course made continuation harder to avoid than starting.</PullQuote></Reveal>
      </section>
    </PageShell>
  );
}
