import { animate, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Hand } from 'lucide-react';
import { BackPanel, SCENE_GLOW, ScreenShow, SmartUI, TV3D } from './TV3D';
import type { Product } from '../data/products';

const VIEWS = [
  { label: 'Front', ry: -14 },
  { label: 'Side', ry: -72 },
  { label: 'Back', ry: -180 },
] as const;

/** Drag-to-rotate 360° product viewer with Front / Side / Back presets. */
export function ProductViewer({ p }: { p: Product }) {
  const ry = useMotionValue(-200);
  const sry = useSpring(ry, { stiffness: 80, damping: 18 });
  const rx = useMotionValue(6);
  const srx = useSpring(rx, { stiffness: 80, damping: 18 });
  const [view, setView] = useState(0);
  const [smartOn, setSmartOn] = useState(false);
  const dragged = useRef(false);

  useEffect(() => {
    // intro: spin in from the back to the front
    const c = animate(ry, -14, { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 });
    const t = p.smart ? setTimeout(() => setSmartOn(true), 2600) : undefined;
    return () => {
      c.stop();
      if (t) clearTimeout(t);
    };
  }, [ry, p.smart]);

  const go = (k: number) => {
    setView(k);
    // rotate the shortest way to the preset
    const cur = ry.get();
    const target = VIEWS[k].ry;
    const turns = Math.round((cur - target) / 360);
    animate(ry, target + turns * 360, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
  };

  return (
    <motion.div
      className="pd-viewer"
      data-cursor="Drag"
      onPanStart={() => (dragged.current = true)}
      onPan={(_, info) => {
        ry.set(ry.get() + info.delta.x * 0.6);
        rx.set(Math.max(-12, Math.min(20, rx.get() - info.delta.y * 0.2)));
      }}
      onPanEnd={() => {
        const norm = ((ry.get() % 360) + 360) % 360; // 0..360
        const nearest = norm > 120 && norm < 240 ? 2 : (norm > 30 && norm <= 120) || (norm >= 240 && norm < 330) ? 1 : 0;
        setView(nearest);
        animate(rx, 6, { duration: 0.8 });
      }}
    >
      <motion.div className="ambilight" animate={{ backgroundColor: SCENE_GLOW[p.art] }} aria-hidden />
      <span className="pd-hint">
        <Hand size={14} /> Drag to rotate 360°
      </span>
      <TV3D rotateX={srx} rotateY={sry} back={<BackPanel labels />} label={`${p.name} — drag to rotate`}>
        <ScreenShow art={p.art} powerOnDelay={1.5} overlay={p.smart && smartOn ? <SmartUI /> : null} />
      </TV3D>
      <motion.div className="floor-reflect" animate={{ backgroundColor: SCENE_GLOW[p.art] }} aria-hidden />
      <div className="pd-views" role="group" aria-label="View angle" onPointerDown={(e) => e.stopPropagation()}>
        {VIEWS.map((v, k) => (
          <button key={v.label} className={`pd-view ${view === k ? 'is-on' : ''}`} onClick={() => go(k)} aria-pressed={view === k}>
            {view === k && <motion.i className="pd-view-pill" layoutId="pd-view-pill" />}
            <span>{v.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
