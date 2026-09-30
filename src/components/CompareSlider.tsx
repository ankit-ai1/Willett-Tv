import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Screen } from './TV';

/** Drag to compare "ordinary TV" vs "Willett Active Image". Sweeps by itself until touched. */
export function CompareSlider() {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inView = useInView(ref, { margin: '-80px' });

  useEffect(() => {
    if (!inView || touched) return;
    const c = animate(50, [50, 16, 84, 50], {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.8,
      onUpdate: (v) => setPos(v),
    });
    return () => c.stop();
  }, [inView, touched]);

  const update = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="compare"
      data-cursor="Drag"
      onPointerDown={(e) => {
        dragging.current = true;
        setTouched(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="compare-layer compare-layer--vivid">
        <Screen art="sunset" />
      </div>
      <div className="compare-layer compare-layer--dull" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Screen art="sunset" />
      </div>
      <span className="compare-tag compare-tag--l">Ordinary TV</span>
      <span className="compare-tag compare-tag--r">Willett Active Image</span>
      <div className="compare-handle" style={{ left: `${pos}%` }}>
        <span className="compare-line" />
        <button
          className="compare-knob"
          aria-label="Drag to compare picture quality"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            setTouched(true);
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 4));
            if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 4));
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
