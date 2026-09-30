import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Cable, Factory, Tv, Flag, Target, Eye } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal, SplitText } from '../components/Reveal';
import { Counter } from '../components/Counter';
import { Turntable } from '../components/TV3D';
import { MagneticButton } from '../components/MagneticButton';

const timeline = [
  {
    icon: <Cable size={20} />,
    tag: 'The beginning',
    title: 'Coaxial cable',
    text: 'Willett Communications started out manufacturing coaxial cable for India’s growing cable-TV networks.',
  },
  {
    icon: <Factory size={20} />,
    tag: 'Scale',
    title: 'CATV fibre leader',
    text: 'Capacity grew to 8,000 km a month and 1,00,000 km a year — the highest production capacity of CATV fibre in the country.',
  },
  {
    icon: <Flag size={20} />,
    tag: '2013',
    title: 'STB Technologies is born',
    text: 'After an overwhelming response in the fibre-optic industry, STB Technologies Pvt. Ltd. was founded as an offshoot of Willett Communications.',
  },
  {
    icon: <Tv size={20} />,
    tag: 'Today',
    title: 'Willett LED TV',
    text: 'The same engineering discipline now builds Smart LED TVs — made in India, for the way India watches.',
  },
];

export default function About() {
  return (
    <>
      <PageHero arts={['aurora', 'forest', 'glacier']}
        crumb="About"
        eyebrow="About Willett"
        title="From the cable in your wall"
        accent="to the screen on it."
        sub="Willett is an indigenous Make in India brand by STB Technologies — built on more than a decade of making the cables that carry India’s television."
      />

      <Timeline />

      <section className="section">
        <div className="container mv-grid">
          <Reveal className="mv-card" id="mission">
            <span className="mv-icon">
              <Target size={22} />
            </span>
            <p className="eyebrow">Our mission</p>
            <h3 className="display mv-title">Make the ordinary feel extraordinary.</h3>
            <p className="muted">
              The average Willett LED TV is a high-definition television with a virtual surround sound system and a fast, smart user interface. Our mission is simple: give customers
              the finest digital television experience, and keep pushing the technology that brings them the best picture and sound.
            </p>
          </Reveal>
          <Reveal className="mv-card mv-card--accent" delay={0.1} id="vision">
            <span className="mv-icon">
              <Eye size={22} />
            </span>
            <p className="eyebrow">Our vision</p>
            <h3 className="display mv-title">
              Lots of people make LED TVs. <span className="serif-accent">So what makes us different?</span>
            </h3>
            <p className="muted">
              We’re an indigenous Make in India initiative that helps Indian manufacturers find their place in the market. We want India to be known for its home-grown products —
              because we can build more, and better, on our own.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container about-split">
          <div className="about-split-visual">
            <Turntable art="aurora" />
          </div>
          <div>
            <p className="eyebrow">By the numbers</p>
            <h2 className="display section-title">
              <SplitText text="Engineering you" /> <span className="serif-accent"><SplitText text="can count on." delay={0.1} /></span>
            </h2>
            <div className="stats stats--2">
              <Reveal className="stat">
                <p className="stat-value">
                  <Counter to={8000} />
                  <span className="stat-unit">km/mo</span>
                </p>
                <p className="stat-label">CATV fibre capacity</p>
              </Reveal>
              <Reveal className="stat" delay={0.05}>
                <p className="stat-value">
                  <Counter to={100000} />
                  <span className="stat-unit">km/yr</span>
                </p>
                <p className="stat-label">Annual production</p>
              </Reveal>
              <Reveal className="stat" delay={0.1}>
                <p className="stat-value">
                  <Counter to={36} />
                  <span className="stat-unit">months</span>
                </p>
                <p className="stat-label">Warranty</p>
              </Reveal>
              <Reveal className="stat" delay={0.15}>
                <p className="stat-value">
                  <Counter to={100} suffix="%" />
                </p>
                <p className="stat-label">Made in India</p>
              </Reveal>
            </div>
            <div style={{ marginTop: 32 }}>
              <MagneticButton to="/products">See the TVs</MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="section" id="story">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">Our story</p>
          </Reveal>
          <h2 className="display section-title">
            <SplitText text="A decade of" /> <span className="serif-accent"><SplitText text="connecting India." delay={0.1} /></span>
          </h2>
        </div>
        <div ref={ref} className="timeline">
          <div className="timeline-rail" aria-hidden>
            <motion.div className="timeline-fill" style={{ height: h }} />
          </div>
          {timeline.map((t, i) => (
            <Reveal key={t.title} className={`timeline-item ${i % 2 ? 'timeline-item--r' : ''}`} delay={0.05}>
              <span className="timeline-node">{t.icon}</span>
              <div className="timeline-card">
                <p className="timeline-tag">{t.tag}</p>
                <h3>{t.title}</h3>
                <p className="muted">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
