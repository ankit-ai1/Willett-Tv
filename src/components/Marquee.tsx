import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Marquee that speeds up, reverses and skews with scroll velocity. */
export function Marquee({ items, speed = 3, outline = false, reverse = false }: { items: ReactNode[]; speed?: number; outline?: boolean; reverse?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smooth, [-2500, 2500], [10, -10]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(reverse ? -1 : 1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * speed * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1;
    else if (f > 0) dir.current = reverse ? -1 : 1;
    move += dir.current * Math.abs(move) * Math.abs(f);
    baseX.set(baseX.get() - move);
  });

  const row = (k: number) => (
    <div className="marquee-row" key={k} aria-hidden={k > 0}>
      {items.map((it, i) => (
        <span key={i} className="marquee-item">
          {it}
          <span className="marquee-star">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${outline ? 'marquee--outline' : ''}`}>
      <motion.div className="marquee-track" style={{ x, skewX: skew }}>
        {[0, 1, 2, 3].map(row)}
      </motion.div>
    </div>
  );
}
