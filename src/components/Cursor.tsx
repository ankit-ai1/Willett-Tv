import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Desktop-only cursor ring that grows over interactive elements and labels drag targets. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<{ hover: boolean; label: string }>({ hover: false, label: '' });
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const lab = t?.closest<HTMLElement>('[data-cursor]');
      const inter = t?.closest('a, button, select, input, textarea, label, [role="slider"]');
      setState((s) => {
        const label = lab?.dataset.cursor ?? '';
        const hover = !!inter || !!lab;
        return s.label === label && s.hover === hover ? s : { hover, label };
      });
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', d);
    window.addEventListener('pointerup', u);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', d);
      window.removeEventListener('pointerup', u);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = state.label ? 84 : state.hover ? 54 : 34;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden />
      <motion.div
        className={`cursor-ring ${state.label ? 'has-label' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        aria-hidden
      >
        {state.label && <span className="cursor-label">{state.label}</span>}
      </motion.div>
    </>
  );
}
