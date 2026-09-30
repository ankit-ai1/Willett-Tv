import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function Counter({ to, suffix = '', prefix = '', duration = 2, plain = false }: { to: number; suffix?: string; prefix?: string; duration?: number; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(v) });
    return () => c.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {plain ? Math.round(val) : Math.round(val).toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
