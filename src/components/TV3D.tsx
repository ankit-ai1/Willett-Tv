import { AnimatePresence, animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Screen } from './TV';
import type { ScreenArt } from '../data/products';

export const SCENE_NAME: Record<ScreenArt, string> = {
  rose: 'Blossom',
  aurora: 'Aurora',
  sunset: 'Sunset',
  ocean: 'Deep Sea',
  forest: 'Forest',
  nebula: 'Nebula',
  dunes: 'Dunes',
  glacier: 'Glacier',
  lagoon: 'Lagoon',
  ember: 'Ember',
};

export const SCENE_GLOW: Record<ScreenArt, string> = {
  rose: '#ff3d8b',
  aurora: '#2fe0a6',
  sunset: '#ff7a3d',
  ocean: '#1fb7d6',
  forest: '#7fbf4d',
  nebula: '#7c4dff',
  dunes: '#ffab5e',
  glacier: '#5fb3ff',
  lagoon: '#22d3c5',
  ember: '#ff4d1f',
};

/** Auto-advancing index; manual `go` restarts the timer. */
export function useCycle(length: number, ms = 4200, enabled = true) {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!enabled || length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % length), ms);
    return () => clearInterval(t);
  }, [length, ms, enabled, tick]);
  const go = useCallback((n: number) => {
    setI(((n % length) + length) % length);
    setTick((t) => t + 1);
  }, [length]);
  return [i, go] as const;
}

type ShowProps = {
  art: ScreenArt;
  /** delay (s) before the screen powers on; undefined = already on */
  powerOnDelay?: number;
  overlay?: ReactNode;
  showChannel?: boolean;
  channelNo?: number;
  /** 0 = screen off, 1 = fully on (for scroll-driven power) */
  power?: MotionValue<number>;
};

/** Screen with channel-change transitions, Ken Burns drift and optional power-on. */
export function ScreenShow({ art, powerOnDelay, overlay, showChannel, channelNo, power }: ShowProps) {
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);

  return (
    <div className="show">
      <AnimatePresence initial={false}>
        <motion.div
          key={art}
          className="show-scene"
          initial={{ opacity: 0, scale: 1.25, filter: 'blur(14px) saturate(2)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px) saturate(1)' }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="show-kb">
            <Screen art={art} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* channel-change static flash */}
      <AnimatePresence>
        {!first.current && (
          <motion.div key={'st' + art} className="show-static" initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.45 }} aria-hidden />
        )}
      </AnimatePresence>

      {overlay}

      {showChannel && (
        <AnimatePresence mode="wait">
          <motion.div
            key={art}
            className="show-channel"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0, 1, 1, 0.55], x: 0 }}
            transition={{ duration: 2.4, times: [0, 0.1, 0.7, 1] }}
          >
            <span className="show-channel-no">CH {String(channelNo ?? 1).padStart(2, '0')}</span>
            {SCENE_NAME[art]}
          </motion.div>
        </AnimatePresence>
      )}

      {powerOnDelay !== undefined && <PowerOn delay={powerOnDelay} />}
      {power && <PowerMask power={power} />}
      <div className="show-scanlines" aria-hidden />
    </div>
  );
}

function PowerMask({ power }: { power: MotionValue<number> }) {
  // Black panel + light line that give way as power → 1
  const black = useTransform(power, [0, 0.55, 1], [1, 1, 0]);
  const lineX = useTransform(power, [0, 0.35], [0, 1]);
  const lineY = useTransform(power, [0.35, 0.8], [0.012, 1]);
  const lineO = useTransform(power, [0, 0.05, 0.7, 1], [0, 1, 1, 0]);
  return (
    <>
      <motion.div className="power-black" style={{ opacity: black }} aria-hidden />
      <motion.div className="power-line" style={{ scaleX: lineX, scaleY: lineY, opacity: lineO }} aria-hidden />
    </>
  );
}

function PowerOn({ delay }: { delay: number }) {
  return (
    <>
      <motion.div
        className="power-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: delay + 0.55, duration: 0.5 }}
        aria-hidden
      />
      <motion.div
        className="power-line"
        initial={{ scaleX: 0, scaleY: 0.012, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], scaleY: [0.012, 0.012, 1], opacity: [1, 1, 0] }}
        transition={{ delay, duration: 0.9, times: [0, 0.4, 1], ease: 'easeInOut' }}
        aria-hidden
      />
    </>
  );
}

type TV3DProps = {
  children: ReactNode; // screen content
  rotateX?: MotionValue<number> | number;
  rotateY?: MotionValue<number> | number;
  scale?: MotionValue<number> | number;
  legs?: boolean;
  back?: ReactNode;
  className?: string;
  label?: string;
};

/** A real 3D TV: front, back panel and four edges, rotatable on any axis. */
export function TV3D({ children, rotateX = 0, rotateY = 0, scale = 1, legs = true, back, className = '', label }: TV3DProps) {
  return (
    <div className={`tv3d ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      <motion.div className="tv3d-body" style={{ rotateX, rotateY, scale }}>
        <div className="tv3d-front">
          <div className="tv3d-bezel">
            <div className="tv3d-screen">{children}</div>
            <span className="tv-brand">Willett</span>
          </div>
        </div>
        <div className="tv3d-back">{back ?? <BackPanel />}</div>
        <i className="tv3d-edge tv3d-edge--l" />
        <i className="tv3d-edge tv3d-edge--r" />
        <i className="tv3d-edge tv3d-edge--t" />
        <i className="tv3d-edge tv3d-edge--b" />
        {legs && (
          <div className="tv3d-legs" aria-hidden>
            <span />
            <span />
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function BackPanel({ labels = false }: { labels?: boolean }) {
  const ports = ['HDMI ARC', 'HDMI', 'HDMI', 'USB 3.0', 'USB 2.0', 'LAN', 'AV', 'S/PDIF'];
  return (
    <div className="backpanel">
      <div className="backpanel-hump">
        <span className="backpanel-logo">Willett</span>
        <div className="backpanel-vents" />
      </div>
      <div className="backpanel-mount" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} />
        ))}
      </div>
      <div className="backpanel-ports">
        {ports.map((p, i) => (
          <span key={i} className="bp-port">
            <span className={`bp-port-shape ${p.startsWith('HDMI') ? 'is-hdmi' : p.startsWith('USB') ? 'is-usb' : p === 'LAN' ? 'is-lan' : 'is-round'}`} />
            {labels && <span className="bp-port-label">{p}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Equalizer shown on screen during the sound demo. */
export function EqOverlay() {
  return (
    <div className="eq-overlay" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${((i * 97) % 1000) / 1000}s`, animationDuration: `${0.6 + ((i * 37) % 60) / 100}s` }} />
      ))}
    </div>
  );
}

/** Generic smart-TV home screen (invented app names, no real brands). */
export function SmartUI() {
  const apps = [
    ['Movies', 'linear-gradient(135deg,#ff5f6d,#ffc371)'],
    ['Music', 'linear-gradient(135deg,#7c6cff,#ff5fa2)'],
    ['Cricket Live', 'linear-gradient(135deg,#11998e,#38ef7d)'],
    ['News', 'linear-gradient(135deg,#2193b0,#6dd5ed)'],
    ['Kids', 'linear-gradient(135deg,#f7971e,#ffd200)'],
    ['Games', 'linear-gradient(135deg,#8e2de2,#4a00e0)'],
  ];
  return (
    <div className="smartui">
      <div className="smartui-top">
        <span className="smartui-brand">Willett Smart</span>
        <span className="smartui-icons">
          <i /> <i /> <i />
        </span>
      </div>
      <motion.div className="smartui-hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <span className="smartui-kicker">Continue watching</span>
        <span className="smartui-title">Weekend Movie Night</span>
        <span className="smartui-bar">
          <i />
        </span>
      </motion.div>
      <div className="smartui-apps">
        {apps.map(([n, g], i) => (
          <motion.span
            key={n}
            className={`smartui-app ${i === 0 ? 'is-focus' : ''}`}
            style={{ background: g }}
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
          >
            {n}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** Slow turntable: the TV sways side to side, showing its slim profile. */
export function Turntable({ art }: { art: ScreenArt }) {
  return (
    <div className="turntable">
      <motion.div className="ambilight" style={{ backgroundColor: SCENE_GLOW[art] }} aria-hidden />
      <TurntableTV art={art} />
    </div>
  );
}

function TurntableTV({ art }: { art: ScreenArt }) {
  const ry = useMotionValue(-40);
  useEffect(() => {
    const c = animate(ry, [-40, 40, -40], { duration: 12, ease: 'easeInOut', repeat: Infinity });
    return () => c.stop();
  }, [ry]);
  return (
    <TV3D rotateX={6} rotateY={ry}>
      <ScreenShow art={art} />
    </TV3D>
  );
}
