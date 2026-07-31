import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { Eyebrow, Reveal } from '../components/Reveal';

const COURSES = ['MATH', 'MATH', 'COMPUTER SCIENCE', 'COMPUTER SCIENCE'];

export function Opening() {
  return (
    <PageShell chapter={0} title="The Course I Almost Underestimated" hideNext>
      <section className="opening opening--load" data-opening-sequence>
        <Reveal>
          <Eyebrow>Term load / before the course began</Eyebrow>
        </Reveal>
        <div className="course-stack" aria-label="Term course load">
          {COURSES.map((course, index) => (
            <p key={`${course}-${index}`} data-opening-row>{course}</p>
          ))}
          <p className="course-stack__bet" data-opening-row>
            BET <span>one class / meet people / probably chill</span>
          </p>
        </div>
        <a className="scroll-cue" href="#assumption">
          <span>Keep reading</span>
          <ArrowDown aria-hidden="true" />
        </a>
      </section>

      <section className="opening opening--assumption" id="assumption">
        <div className="opening__assumption-copy">
          <Reveal>
            <p className="opening__thought">I thought this would be my</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="opening__bird" data-text="bird course.">bird course.</h1>
          </Reveal>
          <div className="opening__strike" />
          <Reveal delay={0.22} className="opening__correction">
            <p>I was completely wrong.</p>
          </Reveal>
        </div>
      </section>

      <section className="opening opening--title">
        <Reveal>
          <Eyebrow>A five-minute self-reflection / BET / July 31, 2026</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2>
            The course I
            <span> almost </span>
            underestimated.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="opening__summary">
            I entered looking for balance. I left with momentum—and a much clearer picture of the
            kind of work, risk, and creative freedom I want from my life.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <Link className="primary-link" to="/expectation">
            Enter the reflection <ArrowRight aria-hidden="true" />
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
