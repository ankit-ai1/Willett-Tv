import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/** Scroll to top on route change, or to #hash targets when present. */
export function ScrollToTopOnRoute() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const initial = first.current;
    first.current = false;
    if (hash) {
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1100);
      return () => clearTimeout(t);
    }
    // wait until the closing curtain covers the old page before jumping
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), initial ? 0 : 680);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <motion.button
      className="back-to-top"
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20, pointerEvents: show ? 'auto' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp size={18} />
    </motion.button>
  );
}
