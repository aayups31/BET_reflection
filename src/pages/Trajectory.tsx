import { ChapterIntro } from '../components/ChapterIntro';
import { Body, Eyebrow, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

export function Trajectory() {
  return (
    <PageShell chapter={2} title="Trajectory">
      <ChapterIntro
        number="02"
        label="Trajectory"
        title={<>Two possible careers. One <em>non-negotiable</em> need.</>}
        align="right"
      />

      <section className="trajectory-field">
        <div className="trajectory-line trajectory-line--left" />
        <div className="trajectory-line trajectory-line--right" />
        <div className="trajectory-field__path trajectory-field__path--left">
          <Reveal><Eyebrow>Path one</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2>F1 simulation engineer</h2></Reveal>
          <Reveal delay={0.1}><p>Precision. Vehicle dynamics. Speed. Technical mastery.</p></Reveal>
        </div>
        <div className="trajectory-field__centre">
          <Reveal delay={0.2}><span>LIBERTY<br />TO CREATE</span></Reveal>
        </div>
        <div className="trajectory-field__path trajectory-field__path--right">
          <Reveal><Eyebrow>Path two</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2>Founder or early startup builder</h2></Reveal>
          <Reveal delay={0.1}><p>Ownership. Uncertainty. Product. People. Rapid iteration.</p></Reveal>
        </div>
      </section>

      <section className="reading-grid reading-grid--reverse">
        <div className="reading-grid__aside"><p className="margin-number">02</p></div>
        <div className="reading-grid__copy">
          <Reveal><Body>I am still uncertain whether my future lies in becoming an F1 simulation engineer, founding a company, or joining an early-stage startup where I can have meaningful ownership.</Body></Reveal>
          <Reveal delay={0.05}><Body>What I understand much more clearly is the common thread between those paths: I need the liberty to create.</Body></Reveal>
          <Reveal delay={0.1}><Body>I love making things—especially experiences that feel cinematic, visual, and memorable. I do not want to produce work that is technically functional but emotionally forgettable. I want people to remember what I create.</Body></Reveal>
          <Reveal delay={0.15}><Body>Entrepreneurship appeals to me because it combines creativity, technical execution, competition, risk, psychology, and ownership. I want to begin as soon as possible, and I would seriously consider any opportunity that gives me a real chance to build.</Body></Reveal>
        </div>
      </section>

      <section className="quote-stage">
        <Reveal><PullQuote>I may not know the final destination. I now know the direction.</PullQuote></Reveal>
      </section>
    </PageShell>
  );
}
