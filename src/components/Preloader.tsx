import { AnimatePresence, motion } from 'framer-motion';
import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function Count() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, 100, { duration: 1.8, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, []);
  return (
    <>
      <span>{String(n).padStart(3, '0')}</span>
      <span className="preloader-bar">
        <i style={{ transform: `scaleX(${n / 100})` }} />
      </span>
    </>
  );
}

/** Cinematic brand intro — plays once per browser session. */
export function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('willett-intro');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem('willett-intro', '1');
      } catch {
        /* ignore */
      }
    }, 2100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-inner">
            <motion.div
              className="preloader-screen"
              initial={{ scaleX: 0.004, scaleY: 0.004, opacity: 1 }}
              animate={{ scaleX: [0.004, 1, 1], scaleY: [0.004, 0.004, 1] }}
              transition={{ duration: 1.1, times: [0, 0.45, 1], ease: 'easeInOut' }}
            />
            <motion.span
              className="preloader-word"
              initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(12px)' }}
              animate={{ opacity: 1, letterSpacing: '0.02em', filter: 'blur(0px)' }}
              transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Willett
            </motion.span>
            <motion.span
              className="preloader-sub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              भारत का अपना TV
            </motion.span>
          </div>
          <div className="preloader-count" aria-hidden>
            <Count />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Seconds the first-visit intro covers the page; hero animations wait this long. */
export const INTRO_DELAY = (() => {
  try {
    return sessionStorage.getItem('willett-intro') ? 0 : 2.4;
  } catch {
    return 0;
  }
})();
