import { ChapterIntro } from '../components/ChapterIntro';
import { Body, Eyebrow, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

export function People() {
  return (
    <PageShell chapter={7} title="Signals">
      <ChapterIntro
        number="07"
        label="Signals"
        title={<>Two conversations made the path feel <em>more real.</em></>}
      />

      <section className="people-section people-section--rob">
        <div className="people-section__name" aria-hidden="true">ROB</div>
        <div className="people-section__copy">
          <Reveal><Eyebrow>Signal 01 / the professor</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2>Meeting you was one of the most meaningful parts of the course.</h2></Reveal>
          <Reveal delay={0.1}><Body>Learning that you had already built a successful startup and were now launching another company involving AI voice agents made entrepreneurship feel less abstract. Booking a meeting with you, exchanging ideas, and being treated like someone whose ideas were worth seriously discussing gave me an enormous boost in confidence.</Body></Reveal>
          <Reveal delay={0.15}><Body>That conversation helped me recognize that my ambitions were not unrealistic simply because I was still a student. They needed development, stronger execution, and experience—but they deserved to be acted on.</Body></Reveal>
          <Reveal delay={0.2}><Body>I would genuinely take any course you teach. I hope to remain connected, and I would always be open to an opportunity to build or work with you.</Body></Reveal>
        </div>
      </section>

      <section className="people-section people-section--roger">
        <div className="people-section__name" aria-hidden="true">ROGER</div>
        <div className="people-section__copy">
          <Reveal><Eyebrow>Signal 02 / guest speaker connection</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2>One of the best professional experiences I have had at university.</h2></Reveal>
          <Reveal delay={0.1}><Body>Visiting Roger Kirkness in his office did not feel like a formal conversation between a CEO and a student. It felt like speaking with a mentor.</Body></Reveal>
          <Reveal delay={0.15}><Body>Roger listened carefully to the UniMarket vision, challenged parts of it, offered practical insight, and reassured me that the direction I was taking made sense. We approached creativity, ambition, and building in surprisingly similar ways, which made the conversation especially memorable.</Body></Reveal>
          <Reveal delay={0.2}><Body>His openness showed me that strong founders do not need to manufacture distance or status. They can be direct, curious, generous, and genuinely interested in the person across from them.</Body></Reveal>
        </div>
      </section>

      <section className="quote-stage">
        <Reveal><PullQuote>Confidence sometimes grows when someone further along the path treats you as though you belong on it.</PullQuote></Reveal>
      </section>
    </PageShell>
  );
}
