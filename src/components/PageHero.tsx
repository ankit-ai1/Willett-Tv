import { animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ScreenArt } from '../data/products';
import { SCENE_GLOW, ScreenShow, TV3D, useCycle } from './TV3D';
import { Particles } from './Particles';

type Props = { eyebrow: string; title: string; accent?: string; sub?: ReactNode; crumb: string; arts?: ScreenArt[]; overlay?: ReactNode };

export function PageHero({ eyebrow, title, accent, sub, crumb, arts, overlay }: Props) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <section
      className={`page-hero ${arts ? 'page-hero--tv' : ''}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="page-hero-glow" aria-hidden />
      <div className="grid-lines" aria-hidden />
      {arts && <Particles count={40} />}
      <div className={`container ${arts ? 'page-hero-grid' : ''}`}>
        <div>
          <motion.nav className="crumbs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span aria-current="page">{crumb}</span>
          </motion.nav>
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            {eyebrow}
          </motion.p>
          <h1 className="display page-hero-title">
            {[title, accent].filter(Boolean).map((part, pi) => (
              <span key={pi} className={pi === 1 ? 'serif-accent' : undefined} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
                <motion.span
                  style={{ display: 'inline-block', transformOrigin: '0% 100%' }}
                  initial={{ y: '110%', rotate: 4 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.1, delay: 0.55 + pi * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {part}
                </motion.span>
              </span>
            ))}
          </h1>
          {sub && (
            <motion.p className="lead page-hero-sub" initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.85, duration: 0.8 }}>
              {sub}
            </motion.p>
          )}
        </div>
        {arts && <HeroTV arts={arts} mx={mx} my={my} overlay={overlay} />}
      </div>
    </section>
  );
}

function HeroTV({ arts, mx, my, overlay }: { arts: ScreenArt[]; mx: MotionValue<number>; my: MotionValue<number>; overlay?: ReactNode }) {
  const [i] = useCycle(arts.length, 3800);
  const art = arts[i];
  const intro = useMotionValue(-95);
  useEffect(() => {
    const c = animate(intro, -16, { type: 'spring', stiffness: 30, damping: 12, delay: 0.5 });
    return () => c.stop();
  }, [intro]);
  const smx = useSpring(mx, { stiffness: 50, damping: 15 });
  const smy = useSpring(my, { stiffness: 50, damping: 15 });
  const ry = useTransform([intro, smx] as MotionValue<number>[], ([a, b]: number[]) => a + b * 26);
  const rx = useTransform(smy, (v) => 6 - v * 14);

  return (
    <motion.div className="ph-visual" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <motion.div className="ambilight" animate={{ backgroundColor: SCENE_GLOW[art] }} transition={{ duration: 1.2 }} aria-hidden />
      <div className="ph-float">
        <TV3D rotateX={rx} rotateY={ry}>
          <ScreenShow art={art} powerOnDelay={1} overlay={overlay} />
        </TV3D>
      </div>
      <motion.div className="floor-reflect" animate={{ backgroundColor: SCENE_GLOW[art] }} transition={{ duration: 1.2 }} aria-hidden />
    </motion.div>
  );
}
