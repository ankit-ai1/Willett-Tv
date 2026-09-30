import { useEffect, useRef } from 'react';

/** Floating light dust that drifts upward and scatters away from the cursor. */
export function Particles({ count = 70, className = '' }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c6cff';
    let color = accent();

    const pts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.00025 + 0.00008),
      vx: (Math.random() - 0.5) * 0.0001,
      a: Math.random() * 0.6 + 0.2,
      tw: Math.random() * Math.PI * 2,
      ox: 0,
      oy: 0,
    }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const mo = new MutationObserver(() => (color = accent()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const p of pts) {
        if (!reduce) {
          p.y += p.vy;
          p.x += p.vx;
          if (p.y < -0.02) {
            p.y = 1.02;
            p.x = Math.random();
          }
        }
        let px = p.x * w,
          py = p.y * h;
        const dx = px - mouse.x,
          dy = py - mouse.y,
          d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) {
          const f = (1 - d / 140) * 30;
          p.ox += ((dx / d) * f - p.ox) * 0.1;
          p.oy += ((dy / d) * f - p.oy) * 0.1;
        } else {
          p.ox *= 0.94;
          p.oy *= 0.94;
        }
        px += p.ox;
        py += p.oy;
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t / 700 + p.tw));
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [count]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden />;
}
