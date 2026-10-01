import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { Fragment, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
} & Omit<HTMLMotionProps<'div'>, 'children'>;

export function Reveal({ children, delay = 0, y = 40, className, as = 'div', ...rest }: Props) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </M>
  );
}

const wordV: Variants = {
  hidden: { y: '110%' },
  show: (i: number) => ({ y: '0%', transition: { duration: 0.9, delay: i, ease: [0.16, 1, 0.3, 1] } }),
};

/**
 * Splits a headline into words that rise one after another.
 * The in-view trigger sits on the (unclipped) wrapper — the words themselves
 * start hidden inside overflow:hidden masks, so they can't observe themselves.
 */
export function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <motion.span className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-word" aria-hidden>
            <motion.span style={{ display: 'inline-block' }} variants={wordV} custom={delay + i * 0.06}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </motion.span>
  );
}

const charV: Variants = {
  hidden: { y: '100%', rotateX: -90, opacity: 0 },
  show: (d: number) => ({ y: '0%', rotateX: 0, opacity: 1, transition: { duration: 1, delay: d, ease: [0.16, 1, 0.3, 1] } }),
};

// 2D rise for gradient (background-clip: text) letters — 3D flips leave paint ghosts there
const charFlatV: Variants = {
  hidden: { y: '45%', opacity: 0 },
  show: (d: number) => ({ y: '0%', opacity: 1, transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] } }),
};

/** Letter-by-letter 3D flip-up reveal (or a flat rise with `flat`); words never break mid-word. Plays on mount. */
export function CharText({ text, className, delay = 0, stagger = 0.028, flat = false }: { text: string; className?: string; delay?: number; stagger?: number; flat?: boolean }) {
  let n = 0;
  const total = text.replace(/ /g, '').length;
  return (
    <motion.span className={`chartext ${className ?? ''}`} aria-label={text} initial="hidden" animate="show">
      {text.split(' ').map((word, wi, arr) => (
        <Fragment key={wi}>
          <span className="chartext-word" aria-hidden>
            {[...word].map((ch, ci) => (
              <motion.span key={ci} className="chartext-char" variants={flat ? charFlatV : charV} custom={delay + n * stagger} style={{ ['--i' as string]: n++, ['--n' as string]: total }}>
                {ch}
              </motion.span>
            ))}
          </span>
          {wi < arr.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </motion.span>
  );
}
