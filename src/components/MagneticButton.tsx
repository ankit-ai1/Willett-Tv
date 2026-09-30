import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

/** Button that gently follows the cursor — a "magnetic" feel. */
export function MagneticButton({ children, to, href, variant = 'primary', onClick, type = 'button', disabled }: Props) {
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span className="btn-fill" aria-hidden />
      <span className="btn-label">{children}</span>
    </>
  );
  const cls = `btn btn--${variant}`;

  return (
    <motion.span style={{ x, y, display: 'inline-flex' }} onPointerMove={move} onPointerLeave={leave}>
      {to ? (
        <Link to={to} className={cls}>
          {inner}
        </Link>
      ) : href ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <button type={type} className={cls} onClick={onClick} disabled={disabled}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
