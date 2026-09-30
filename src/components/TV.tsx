import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ScreenArt } from '../data/products';

const SILHOUETTE: Partial<Record<ScreenArt, string>> = {
  sunset: 'M0 70 L12 58 L22 64 L34 48 L46 60 L58 50 L70 62 L82 54 L100 66 L100 100 L0 100Z',
  glacier: 'M0 72 L10 52 L18 60 L30 36 L42 58 L50 48 L62 62 L74 40 L88 60 L100 54 L100 100 L0 100Z',
  dunes: 'M0 78 Q20 60 40 74 T80 70 T100 72 L100 100 L0 100Z',
  forest: 'M0 80 L4 64 L8 80 L12 58 L16 80 L22 62 L27 80 L33 54 L38 80 L45 66 L50 80 L57 56 L62 80 L70 64 L75 80 L82 58 L87 80 L94 66 L100 80 L100 100 L0 100Z',
  lagoon: 'M0 66 L16 60 L30 64 L48 56 L64 62 L82 58 L100 62 L100 100 L0 100Z',
  aurora: 'M0 78 L14 66 L26 72 L40 60 L54 72 L70 64 L86 74 L100 68 L100 100 L0 100Z',
  ember: 'M0 76 L20 70 L36 74 L52 66 L70 72 L86 68 L100 74 L100 100 L0 100Z',
};

export function Screen({ art, children }: { art: ScreenArt; children?: ReactNode }) {
  const sil = SILHOUETTE[art];
  return (
    <div className={`screen screen--${art}`}>
      <div className="screen-orb" />
      <div className="screen-orb screen-orb--2" />
      {sil && (
        <svg className="screen-sil" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path d={sil} />
        </svg>
      )}
      <div className="screen-glare" />
      {children}
    </div>
  );
}

type TVProps = {
  art: ScreenArt;
  tilt?: boolean;
  stand?: 'legs' | 'none';
  className?: string;
  label?: string;
  children?: ReactNode;
};

export function TV({ art, tilt = false, stand = 'legs', className = '', label, children }: TVProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 18 });

  return (
    <motion.div
      className={`tv ${className}`}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 1400 } : undefined}
      onPointerMove={
        tilt
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - r.left) / r.width - 0.5);
              my.set((e.clientY - r.top) / r.height - 0.5);
            }
          : undefined
      }
      onPointerLeave={tilt ? () => { mx.set(0); my.set(0); } : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <div className="tv-bezel">
        <Screen art={art}>{children}</Screen>
        <span className="tv-brand">Willett</span>
      </div>
      {stand === 'legs' && (
        <div className="tv-legs" aria-hidden>
          <span />
          <span />
        </div>
      )}
    </motion.div>
  );
}
