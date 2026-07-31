import { ChapterIntro } from '../components/ChapterIntro';
import { Body, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

const TRAITS = ['GRIT', 'RISK APPETITE', 'EXECUTION', 'OPEN-MINDEDNESS', 'LOVE OF THE GAME'];

export function Traits() {
  return (
    <PageShell chapter={5} title="The player">
      <ChapterIntro
        number="05"
        label="The player"
        title={<>There is no single founder type. There is <em>pressure</em>—and how you respond to it.</>}
      />

      <section className="trait-river" aria-label="Entrepreneurial traits">
        {TRAITS.map((trait, index) => (
          <p key={trait} data-trait-index={index}>
            {trait}
          </p>
        ))}
      </section>

      <section className="reading-grid reading-grid--reverse">
        <div className="reading-grid__aside"><p className="margin-word">PRESSURE</p></div>
        <div className="reading-grid__copy">
          <Reveal><Body>I do not believe there is one definitive list of traits that makes someone an entrepreneur.</Body></Reveal>
          <Reveal delay={0.05}><Body>For me, the most important combination is grit, a willingness to take calculated risks, an obsession with execution, openness to being wrong, and genuine love for the process.</Body></Reveal>
          <Reveal delay={0.1}><Body>I see those qualities in myself, although I am still building confidence in my ability to execute consistently at a high level.</Body></Reveal>
          <Reveal delay={0.15}><Body>Some tendencies may begin as personality traits, but they do not become useful without development. A person does not discover their grit while everything is working. They discover it through pressure, failure, repetition, and recovery.</Body></Reveal>
          <Reveal delay={0.2}><Body>Many of these traits came from sports. Sports taught me to compete without believing I am entitled to win, to take risks while remaining humble, and to return after failure without pretending it did not happen. Entrepreneurship feels similar: confidence matters, but so does accepting that the market may prove you wrong.</Body></Reveal>
        </div>
      </section>

      <section className="quote-stage">
        <Reveal><PullQuote>The traits may exist internally. Pressure is what makes them visible.</PullQuote></Reveal>
      </section>
    </PageShell>
  );
}
