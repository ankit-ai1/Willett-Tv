import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Bluetooth,
  Cable,
  Cpu,
  Headphones,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Volume2,
  Waves,
  Wifi,
  Zap,
} from 'lucide-react';
import { BackPanel, EqOverlay, SCENE_GLOW, ScreenShow, SmartUI, TV3D, useCycle } from '../components/TV3D';
import { CharText, Reveal, SplitText } from '../components/Reveal';
import { MagneticButton } from '../components/MagneticButton';
import { Marquee } from '../components/Marquee';
import { CompareSlider } from '../components/CompareSlider';
import { Counter } from '../components/Counter';
import { Particles } from '../components/Particles';
import { Tilt } from '../components/Tilt';
import { INTRO_DELAY } from '../components/Preloader';
import { PRODUCTS, priceLabel, type Product, type ScreenArt } from '../data/products';

export default function Home() {
  return (
    <>
      <Hero />
      <section className="marquees" aria-label="Highlights">
        <Marquee items={['Smart LED TV', 'Pro-Audio Speakers', 'Active Image', 'Bluetooth 4.2', 'Dual-band Wi-Fi', '36-Month Warranty']} speed={3} />
        <Marquee items={['Made in India', 'भारत का अपना TV', '24" to 55"', 'Wall or table top', 'Ultra-fast processor']} speed={2.4} outline reverse />
      </section>
      <TVStory />
      <PictureSection />
      <FeatureBento />
      <LineupScroll />
      <RoomSection />
      <StatsSection />
    </>
  );
}

/* ═════════════════════════ HERO ═════════════════════════ */

const HERO_ARTS: ScreenArt[] = ['rose', 'aurora', 'sunset', 'ocean', 'nebula'];

function Hero() {
  const D = INTRO_DELAY;
  const ref = useRef<HTMLElement>(null);
  const [i, go] = useCycle(HERO_ARTS.length, 4200);
  const art = HERO_ARTS[i];

  // 1) intro fly-in
  const introY = useMotionValue(-68);
  const introX = useMotionValue(26);
  const introS = useMotionValue(0.55);
  useEffect(() => {
    const o = { type: 'spring' as const, stiffness: 34, damping: 13, delay: 0.3 + D };
    const a = [animate(introY, -18, o), animate(introX, 6, o), animate(introS, 1, o)];
    return () => a.forEach((x) => x.stop());
  }, [introY, introX, introS]);

  // 2) cursor parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 15 });
  const smy = useSpring(my, { stiffness: 50, damping: 15 });

  // 3) scroll — TV swings round to face you and grows
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sRy = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const sRx = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const sS = useTransform(scrollYProgress, [0, 1], [0, 0.3]);

  const ry = useTransform([introY, smx, sRy] as MotionValue<number>[], ([a, b, c]: number[]) => a + b * 18 + c);
  const rx = useTransform([introX, smy, sRx] as MotionValue<number>[], ([a, b, c]: number[]) => a - b * 10 + c);
  const sc = useTransform([introS, sS] as MotionValue<number>[], ([a, b]: number[]) => a + b);
  const visY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="hero"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
        e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
      }}
    >
      <div className="hero-mesh" aria-hidden>
        <span className="mesh-blob mesh-blob--1" />
        <span className="mesh-blob mesh-blob--2" />
        <span className="mesh-blob mesh-blob--3" />
      </div>
      <div className="grid-lines" aria-hidden />
      <div className="hero-spot" aria-hidden />
      <Particles count={80} />

      <div className="container hero-inner">
        <motion.div className="hero-copy" style={{ y: textY, opacity: fade }}>
          <motion.p className="hero-badge" initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: D + 0.2, duration: 0.8 }}>
            <span className="pulse-dot" /> New season · Smart LED range
          </motion.p>
          <h1 className="display hero-title">
            <CharText text="Experience reality" delay={D + 0.3} />
            <span className="serif-accent shimmer hero-title-accent">
              <CharText text="beyond imagination." delay={D + 0.75} stagger={0.03} flat />
            </span>
          </h1>
          <motion.p className="lead hero-lead" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 1.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            Cinematic colour, Pro-Audio sound and a 36-month promise — Smart LED TVs designed and built in India, for Indian homes.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <MagneticButton to="/products">
              Explore the range <ArrowRight size={18} />
            </MagneticButton>
            <MagneticButton to="/installation" variant="ghost">
              Book installation
            </MagneticButton>
          </motion.div>
          <motion.div className="hero-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 1.8 }}>
            <span>
              <strong>24"–55"</strong> sizes
            </span>
            <span>
              <strong>36</strong> months warranty
            </span>
            <span>
              <strong>100%</strong> made in India
            </span>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" style={{ y: visY }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: D + 0.2 }}>
          <motion.div className="ambilight" animate={{ backgroundColor: SCENE_GLOW[art] }} transition={{ duration: 1.4 }} aria-hidden />
          <TV3D rotateX={rx} rotateY={ry} scale={sc} label="Willett 55 inch Smart LED TV">
            <ScreenShow art={art} powerOnDelay={D + 1.2} showChannel channelNo={i + 1} overlay={<div className="hero-screen-size">55"</div>} />
          </TV3D>
          <motion.div className="floor-reflect" animate={{ backgroundColor: SCENE_GLOW[art] }} transition={{ duration: 1.4 }} aria-hidden />

          <FloatChip className="chip--a" delay={D + 2.2} from={-40} icon={<Volume2 size={15} />}>
            Pro-Audio speakers
          </FloatChip>
          <FloatChip className="chip--b" delay={D + 2.4} from={40} icon={<ShieldCheck size={15} />}>
            36-month warranty
          </FloatChip>
          <FloatChip className="chip--c" delay={D + 2.6} from={-40} icon={<Wifi size={15} />}>
            2.4 / 5 GHz Wi-Fi
          </FloatChip>

          <motion.div className="scene-dots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 2.3 }} role="tablist" aria-label="Screen demo scenes">
            {HERO_ARTS.map((a, k) => (
              <button key={a} role="tab" aria-selected={k === i} aria-label={`Show scene ${k + 1}`} className={`scene-dot ${k === i ? 'is-on' : ''}`} onClick={() => go(k)}>
                {k === i && <motion.span className="scene-dot-fill" style={{ background: SCENE_GLOW[a] }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.2, ease: 'linear' }} />}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="scroll-cue" style={{ opacity: fade }} aria-hidden>
        <span>Scroll</span>
        <span className="scroll-cue-line" />
      </motion.div>
    </section>
  );
}

function FloatChip({ children, icon, className, delay, from }: { children: ReactNode; icon: ReactNode; className: string; delay: number; from: number }) {
  return (
    <motion.div className={`float-chip ${className}`} initial={{ opacity: 0, x: from, scale: 0.7, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }} transition={{ delay, type: 'spring', stiffness: 160, damping: 16 }}>
      <span className="float-chip-icon">{icon}</span>
      {children}
    </motion.div>
  );
}

/* ═════════════════════ STICKY 3D STORY ═════════════════════ */

const STAGES: { key: string; eyebrow: string; title: string; text: string; art: ScreenArt; facts: [ReactNode, string][] }[] = [
  {
    key: 'picture',
    eyebrow: 'Picture',
    title: 'Colour you can almost touch.',
    text: 'Active Image processing lifts colour, depth and contrast from every frame — from a Sunday match to a midnight movie.',
    art: 'rose',
    facts: [
      [<SunMedium size={16} />, 'Active Image enhancement'],
      [<Sparkles size={16} />, 'High quality picture'],
      [<MonitorSmartphone size={16} />, 'Sizes from 24" to 55"'],
    ],
  },
  {
    key: 'sound',
    eyebrow: 'Sound',
    title: 'Pro-Audio. Felt in the room.',
    text: 'High power speakers with transparent highs and low-distortion bass. Dialogue stays crisp and film scores fill the room.',
    art: 'nebula',
    facts: [
      [<Volume2 size={16} />, 'High power speakers'],
      [<Waves size={16} />, 'Low frequency, low distortion'],
      [<Headphones size={16} />, 'Virtual surround sound'],
    ],
  },
  {
    key: 'ports',
    eyebrow: 'Connect',
    title: 'Every port, right where you need it.',
    text: 'Set-top box, console, soundbar or pen drive — plug it all in at the back. Ready for table top or wall mounting.',
    art: 'ocean',
    facts: [
      [<Cable size={16} />, 'HDMI ARC + 2× HDMI'],
      [<Zap size={16} />, 'USB 3.0 & USB 2.0'],
      [<Cable size={16} />, 'LAN · AV · S/PDIF · Antenna'],
    ],
  },
  {
    key: 'smart',
    eyebrow: 'Smart',
    title: 'Apps, Wi-Fi and Bluetooth. Built in.',
    text: 'On Smart models, dual-band Wi-Fi keeps streams smooth and Bluetooth 4.2 pairs your headphones in seconds.',
    art: 'aurora',
    facts: [
      [<Wifi size={16} />, 'Dual-band 2.4 / 5 GHz Wi-Fi'],
      [<Bluetooth size={16} />, 'Bluetooth 4.2 Low Energy'],
      [<Cpu size={16} />, 'Ultra-fast processor'],
    ],
  },
];

function TVStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const sp = useSpring(p, { stiffness: 90, damping: 22, mass: 0.4 });
  const ry = useTransform(sp, [0, 0.16, 0.28, 0.42, 0.53, 0.67, 0.78, 0.94], [-32, 0, 0, -62, -62, -180, -180, -360]);
  const rx = useTransform(sp, [0, 0.16, 0.42, 0.67, 0.94], [16, 3, 10, 4, 3]);
  const sc = useTransform(sp, [0, 0.16, 0.28, 0.42, 0.67, 0.94], [0.72, 1, 1.05, 0.95, 1, 1]);
  const [stage, setStage] = useState(0);

  useMotionValueEvent(p, 'change', (v) => {
    const s = v < 0.27 ? 0 : v < 0.52 ? 1 : v < 0.77 ? 2 : 3;
    setStage((prev) => (prev === s ? prev : s));
  });

  const st = STAGES[stage];

  return (
    <section ref={ref} className="story" aria-label="Inside a Willett TV">
      <div className="story-sticky">
        <motion.div className="story-bg" animate={{ backgroundColor: SCENE_GLOW[st.art] }} transition={{ duration: 1.2 }} aria-hidden />
        <div className="grid-lines" aria-hidden />
        <div className="container story-grid">
          <div className="story-copy">
            <ol className="story-steps" aria-hidden>
              {STAGES.map((s, k) => (
                <li key={s.key} className={k === stage ? 'is-on' : k < stage ? 'is-done' : ''}>
                  <span className="story-step-bar">{k === stage && <motion.span layoutId="story-bar" className="story-step-bar-fill" />}</span>
                  {s.eyebrow}
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait">
              <motion.div key={st.key} className="story-text" initial="hidden" animate="show" exit="exit">
                <h2 className="display story-title">
                  {st.title.split(' ').map((w, k) => (
                    <span key={k}>
                      <span className="split-word">
                        <motion.span style={{ display: 'inline-block' }} variants={wordUp(0.05 + k * 0.05)}>
                          {w}
                        </motion.span>
                      </span>{' '}
                    </span>
                  ))}
                </h2>
                <motion.p className="lead" variants={fadeUp(0.25)}>
                  {st.text}
                </motion.p>
                <ul className="story-facts">
                  {st.facts.map(([ic, t], k) => (
                    <motion.li key={t} variants={fadeUp(0.35 + k * 0.08)}>
                      <span className="story-fact-icon">{ic}</span>
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="story-visual">
            <motion.div className="ambilight ambilight--story" animate={{ backgroundColor: SCENE_GLOW[st.art] }} transition={{ duration: 1.2 }} aria-hidden />
            <AnimatePresence>
              {stage === 1 && (
                <motion.div className="soundwaves" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden>
                  {[0, 1, 2, 3].map((k) => (
                    <span key={'l' + k} className="wave wave--l" style={{ animationDelay: `${k * 0.45}s` }} />
                  ))}
                  {[0, 1, 2, 3].map((k) => (
                    <span key={'r' + k} className="wave wave--r" style={{ animationDelay: `${k * 0.45}s` }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <TV3D rotateX={rx} rotateY={ry} scale={sc} back={<BackPanel labels />} label="Willett TV rotating to show picture, sound, ports and smart features">
              <ScreenShow art={st.art} overlay={stage === 1 ? <EqOverlay /> : stage === 3 ? <SmartUI /> : null} />
            </TV3D>
            <motion.div className="floor-reflect" animate={{ backgroundColor: SCENE_GLOW[st.art] }} transition={{ duration: 1.2 }} aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = (d: number) => ({
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: d, duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -16, filter: 'blur(6px)', transition: { duration: 0.25 } },
});
const wordUp = (d: number) => ({
  hidden: { y: '110%' },
  show: { y: '0%', transition: { delay: d, duration: 0.8, ease: EASE } },
  exit: { y: '-110%', transition: { duration: 0.25 } },
});

/* ═════════════════════ PICTURE ═════════════════════ */

function PictureSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">Picture test</p>
          </Reveal>
          <h2 className="display section-title">
            <SplitText text="See the difference" /> <span className="serif-accent"><SplitText text="for yourself." delay={0.15} /></span>
          </h2>
          <Reveal delay={0.1}>
            <p className="lead">Left: an ordinary panel. Right: Willett Active Image. Grab the handle and drag.</p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="compare-wrap">
          <CompareSlider />
        </Reveal>
      </div>
    </section>
  );
}

/* ═════════════════════ BENTO ═════════════════════ */

function FeatureBento() {
  const ports = ['Antenna', 'S/PDIF', 'AV In', 'Network', 'HDMI ARC', 'HDMI', 'HDMI', 'USB 3.0', 'USB 2.0'];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">Inside every Willett</p>
          </Reveal>
          <h2 className="display section-title">
            <SplitText text="Smart where" /> <span className="serif-accent"><SplitText text="it counts." delay={0.1} /></span>
          </h2>
        </div>

        <div className="bento">
          <Reveal className="bento-cell bento-cell--processor">
            <Tilt className="bento-card bento-card--processor" max={6}>
              <div className="chip-visual" aria-hidden>
                <span className="chip-orbit" />
                <span className="chip-orbit chip-orbit--2" />
                {Array.from({ length: 12 }).map((_, k) => (
                  <span key={k} className="chip-trace" style={{ transform: `rotate(${k * 30}deg)`, animationDelay: `${k * 0.15}s` }} />
                ))}
                <div className="chip-core">
                  <Cpu size={40} strokeWidth={1.4} />
                </div>
              </div>
              <div className="bento-text">
                <span className="bento-icon">
                  <Zap size={18} />
                </span>
                <h3>Lightning speed</h3>
                <p>An ultra-fast processor keeps menus snappy, apps quick to open and channels switching without the wait.</p>
              </div>
            </Tilt>
          </Reveal>

          <Reveal className="bento-cell bento-cell--bt" delay={0.08}>
            <Tilt className="bento-card">
              <div className="bt-visual" aria-hidden>
                <span className="bt-ripple" />
                <span className="bt-ripple" style={{ animationDelay: '0.8s' }} />
                <span className="bt-ripple" style={{ animationDelay: '1.6s' }} />
                <Bluetooth size={46} strokeWidth={1.6} />
              </div>
              <h3>Bluetooth 4.2</h3>
              <p>Low-energy pairing for headphones and speakers.</p>
            </Tilt>
          </Reveal>

          <Reveal className="bento-cell bento-cell--wifi" delay={0.16}>
            <Tilt className="bento-card">
              <svg className="wifi-visual" viewBox="0 0 120 90" aria-hidden>
                <path className="wifi-arc wifi-arc--3" d="M10 40 Q60 -5 110 40" />
                <path className="wifi-arc wifi-arc--2" d="M28 55 Q60 22 92 55" />
                <path className="wifi-arc wifi-arc--1" d="M45 70 Q60 55 75 70" />
                <circle cx="60" cy="80" r="5" className="wifi-dot" />
              </svg>
              <h3>Dual-band Wi-Fi</h3>
              <p>2.4 GHz for reach, 5 GHz for smooth, buffer-free streaming.</p>
            </Tilt>
          </Reveal>

          <Reveal className="bento-cell bento-cell--ports" delay={0.08}>
            <Tilt className="bento-card" max={6}>
              <div className="bento-text">
                <span className="bento-icon">
                  <MonitorSmartphone size={18} />
                </span>
                <h3>Every port you need</h3>
                <p>Set-top box, console, soundbar, pen drive — plug it all in.</p>
              </div>
              <div className="ports">
                {ports.map((pt, k) => (
                  <span key={k} className="port" style={{ animationDelay: `${k * 0.18}s` }}>
                    <span className={`port-shape ${pt.startsWith('HDMI') ? 'port-shape--hdmi' : pt.startsWith('USB') ? 'port-shape--usb' : 'port-shape--round'}`} />
                    {pt}
                  </span>
                ))}
              </div>
            </Tilt>
          </Reveal>

          <Reveal className="bento-cell bento-cell--mount" delay={0.16}>
            <Tilt className="bento-card">
              <div className="mount-visual" aria-hidden>
                <span className="mount-wall" />
                <span className="mount-tv" />
              </div>
              <h3>Table top or wall</h3>
              <p>Ships ready for both. Our team can install it for you.</p>
              <Link to="/installation" className="text-link">
                Request installation <ArrowRight size={14} />
              </Link>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════ HORIZONTAL LINEUP ═════════════════════ */

function LineupScroll() {
  const lineup = PRODUCTS.filter((p) => p.series === 'Willett');
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const m = () => {
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    m();
    const ro = new ResizeObserver(m);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', m);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', m);
    };
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const xRaw = useTransform(p, [0, 1], [0, -dist]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 28, mass: 0.4 });
  const bar = useTransform(p, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="hscroll" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="hscroll-sticky">
        <div className="container hscroll-head">
          <div>
            <p className="eyebrow">The lineup</p>
            <h2 className="display section-title">
              Pick your <span className="serif-accent">perfect size.</span>
            </h2>
          </div>
          <div className="hscroll-progress" aria-hidden>
            <motion.span style={{ scaleX: bar }} />
          </div>
        </div>
        <motion.div ref={track} className="hscroll-track" style={{ x }}>
          {lineup.map((prod, k) => (
            <LineupCard key={prod.slug} p={prod} i={k} />
          ))}
          <Link to="/products" className="hscroll-end">
            <span className="hscroll-end-num">{PRODUCTS.length}</span>
            <span>models across the Willett & Eagle series</span>
            <span className="round-link">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function LineupCard({ p, i }: { p: Product; i: number }) {
  const w = 46 + ((p.size - 24) / (55 - 24)) * 50; // % of card width, proportional to screen size
  return (
    <Link to={`/products/${p.slug}`} className="lcard" style={{ ['--glow' as string]: SCENE_GLOW[p.art] }}>
      <span className="lcard-size" aria-hidden>
        {p.size}″
      </span>
      <span className="lcard-idx">0{i + 1}</span>
      <div className="lcard-stage">
        <div className="lcard-tv" style={{ width: `${w}%` }}>
          <div className="lcard-glow" aria-hidden />
          <TV3D rotateY={-10} rotateX={4}>
            <ScreenShow art={p.art} />
          </TV3D>
        </div>
      </div>
      <div className="lcard-foot">
        <div>
          <p className="lcard-name">{p.name}</p>
          <p className="muted small">{p.headline}</p>
        </div>
        <div className="lcard-price">
          {priceLabel(p)}
          <span className="round-link" aria-hidden>
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═════════════════════ ROOM: LIGHTS DOWN, SHOW ON ═════════════════════ */

function RoomSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const dark = useTransform(p, [0.3, 0.44], [0, 0.8]);
  const lamp = useTransform(p, [0.3, 0.44], [1, 0]);
  const power = useTransform(p, [0.42, 0.54], [0, 1]);
  const spill = useTransform(p, [0.48, 0.6], [0, 1]);
  const scale = useTransform(p, [0.05, 0.4], [0.86, 1]);
  const cap1 = useTransform(p, [0.28, 0.33, 0.43, 0.47], [0, 1, 1, 0]);
  const cap2 = useTransform(p, [0.52, 0.58], [0, 1]);

  return (
    <section ref={ref} className="section room-section">
      <div className="container">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">At home</p>
          </Reveal>
          <h2 className="display section-title">
            <SplitText text="Lights down." /> <span className="serif-accent"><SplitText text="Show on." delay={0.1} /></span>
          </h2>
          <Reveal delay={0.1}>
            <p className="lead">Keep scrolling and watch the room.</p>
          </Reveal>
        </div>
        <motion.div className="room" style={{ scale }}>
          <div className="room-wall" aria-hidden />
          <div className="room-floor" aria-hidden />
          <div className="room-lamp" aria-hidden>
            <motion.span className="room-lamp-glow" style={{ opacity: lamp }} />
            <span className="room-lamp-shade" />
            <span className="room-lamp-pole" />
          </div>
          <div className="room-speaker room-speaker--l" aria-hidden />
          <div className="room-speaker room-speaker--r" aria-hidden />
          <div className="room-console" aria-hidden />
          <div className="room-sofa" aria-hidden>
            <span />
          </div>
          <motion.div className="room-dark" style={{ opacity: dark }} aria-hidden />
          <motion.div className="room-spill" style={{ opacity: spill }} aria-hidden />
          <div className="room-tv">
            <TV3D legs={false} className="tv3d--wall" label="Willett TV mounted on a living room wall">
              <ScreenShow art="sunset" power={power} />
            </TV3D>
          </div>
          <motion.span className="room-cap" style={{ opacity: cap1 }}>
            Dimming the lights…
          </motion.span>
          <motion.span className="room-cap room-cap--on" style={{ opacity: cap2 }}>
            Showtime.
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════════════ STATS ═════════════════════ */

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section className="section stats-section">
      <div className="container">
        <div className="india-card" ref={ref}>
          <motion.span className="india-line" initial={{ scaleX: 0 }} animate={{ scaleX: inView ? 1 : 0 }} transition={{ duration: 1.4, ease: EASE }} aria-hidden />
          <div className="india-glow" aria-hidden />
          <div className="india-copy">
            <Reveal>
              <p className="eyebrow">
                <Sparkles size={14} /> Make in India
              </p>
            </Reveal>
            <h2 className="display section-title">
              <SplitText text="Built by the people who" />{' '}
              <span className="serif-accent">
                <SplitText text="wire India's screens." delay={0.15} />
              </span>
            </h2>
            <Reveal delay={0.1}>
              <p className="lead">
                Willett began with coaxial cable and grew into one of the country's largest CATV fibre producers. That same engineering now goes into every Willett TV.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link to="/about" className="text-link">
                Read our story <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
          <div className="stats">
            <Stat value={<Counter to={8000} />} unit="km / month" label="CATV fibre capacity" d={0} />
            <Stat value={<Counter to={100000} />} unit="km / year" label="Annual production" d={0.08} />
            <Stat value={<Counter to={36} />} unit="months" label="Warranty on every TV" d={0.16} />
            <Stat value={<Counter to={2013} duration={1.4} plain />} unit="" label="STB Technologies founded" d={0.24} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, unit, label, d }: { value: ReactNode; unit: string; label: string; d: number }) {
  return (
    <Reveal className="stat" delay={d}>
      <p className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </p>
      <p className="stat-label">{label}</p>
    </Reveal>
  );
}
