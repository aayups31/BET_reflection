import { ChapterIntro } from '../components/ChapterIntro';
import { Body, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

export function Expectation() {
  return (
    <PageShell chapter={1} title="Expectation">
      <ChapterIntro
        number="01"
        label="Expectation"
        title={<>The lightest course became the one with the most <em>weight.</em></>}
      />

      <section className="reading-grid">
        <div className="reading-grid__aside">
<p className="margin-word">SURPRISE</p>
        </div>
        <div className="reading-grid__copy">
          <Reveal><Body>I had already taken two BET courses. I enrolled expecting one class a week, interesting discussions, a chance to make friends outside computer science, and a relatively relaxed course beside two mathematics and two CS courses.</Body></Reveal>
          <Reveal delay={0.05}><Body>Instead, this became my favourite course I have taken at university so far.</Body></Reveal>
          <Reveal delay={0.1}><Body>What surprised me was not simply how much I learned. It was how personally relevant the course became. It stopped feeling like a class about entrepreneurs and began forcing me to decide what I want to build, how soon I want to begin, and what kind of working life would actually make me feel fulfilled.</Body></Reveal>
        </div>
      </section>

      <section className="quote-stage">
        <Reveal>
          <PullQuote>The course did not give me a new ambition. It helped me recognize one that was already there.</PullQuote>
        </Reveal>
      </section>
    </PageShell>
  );
}
