import { ChapterIntro } from '../components/ChapterIntro';
import { Body, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

export function Ideas() {
  return (
    <PageShell chapter={6} title="Ideas and execution">
      <ChapterIntro
        number="06"
        label="25 / 75"
        title={<>Ideas create possibility. <em>Execution</em> introduces reality.</>}
        align="right"
      />

      <section className="ratio-stage">
        <div className="ratio-stage__ideas">
          <span>25</span>
          <p>IDEA</p>
        </div>
        <div className="ratio-stage__execution">
          <span>75</span>
          <p>EXECUTION</p>
        </div>
      </section>

      <section className="reading-grid">
        <div className="reading-grid__aside"><p className="margin-number">25<br />75</p></div>
        <div className="reading-grid__copy">
          <Reveal><Body>Ideas matter, but I currently see them as approximately twenty-five percent of the equation. Execution is the remaining seventy-five percent.</Body></Reveal>
          <Reveal delay={0.05}><Body>Ideas arrive freely. They can feel perfect because they still exist in the environment imagined by their creator. They contain assumptions, personal biases, and no resistance from reality.</Body></Reveal>
          <Reveal delay={0.1}><Body>Execution is where the real work begins. It exposes the idea to users, time, money, disagreement, technical limitations, and the possibility that nobody cares.</Body></Reveal>
          <Reveal delay={0.15}><Body>My view changed because I experienced that difference directly through UniMarket. The initial concept was valuable, but the learning came from attempting to make it real.</Body></Reveal>
        </div>
      </section>

      <section className="quote-stage">
        <Reveal><PullQuote>An idea can make you feel like an entrepreneur. Execution is what tests the claim.</PullQuote></Reveal>
      </section>
    </PageShell>
  );
}
