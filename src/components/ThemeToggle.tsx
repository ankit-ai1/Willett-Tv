import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light mode' : 'Dark mode'}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <span className="theme-toggle-track" data-on={dark}>
        <motion.span className="theme-toggle-knob" layout transition={{ type: 'spring', stiffness: 500, damping: 32 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', placeItems: 'center' }}
            >
              {dark ? <Moon size={13} strokeWidth={2.4} /> : <Sun size={14} strokeWidth={2.4} />}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
    </button>
  );
}
