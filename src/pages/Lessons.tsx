import { ChapterIntro } from '../components/ChapterIntro';
import { Body, Eyebrow, PullQuote, Reveal } from '../components/Reveal';
import { PageShell } from '../components/PageShell';

const LESSONS = [
  {
    number: '01',
    title: 'Building is not the entire business.',
    body: 'Before this course, my instinct was to focus almost entirely on building. Product development was the exciting part, so financial planning felt secondary. The course made it clear that cash flow, pricing, ownership, fundraising, costs, and runway are not administrative details around the product. They shape which products survive long enough to matter.',
  },
  {
    number: '02',
    title: 'The company is also a relationship.',
    body: 'The exercise on navigating conflict between cofounders was especially relevant because I have been dealing with something similar personally. I learned that avoiding an uncomfortable conversation does not preserve a team. It usually allows ambiguity, resentment, and unequal expectations to become more expensive.',
  },
  {
    number: '03',
    title: 'I do not believe in the founder myth.',
    body: 'I disagree with the romantic idea that entrepreneurship is mainly about having a brilliant original idea or possessing a fixed founder personality. The less glamorous abilities—communicating expectations, managing money, listening to users, recovering from failure, and continuing to execute—appear far more important.',
  },
];

export function Lessons() {
  return (
    <PageShell chapter={4} title="Re-learning">
      <ChapterIntro
        number="04"
        label="Re-learning"
        title={<>A startup is not just something you build. It is something you <em>keep alive.</em></>}
        align="right"
      />

      <section className="lesson-list">
        {LESSONS.map((lesson) => (
          <article className="lesson" key={lesson.number} data-index={lesson.number}>
            <Reveal><Eyebrow>{lesson.number} / what changed</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2>{lesson.title}</h2></Reveal>
            <Reveal delay={0.1}><Body>{lesson.body}</Body></Reveal>
          </article>
        ))}
      </section>

      <section className="quote-stage">
        <Reveal><PullQuote>A startup is a product, a financial system, a set of relationships, and a sequence of decisions—all at once.</PullQuote></Reveal>
      </section>
    </PageShell>
  );
}
