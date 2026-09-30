import { motion } from 'framer-motion';
import { TV } from '../components/TV';
import { MagneticButton } from '../components/MagneticButton';

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container notfound-inner">
        <motion.div className="notfound-tv" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <TV art="nebula">
            <div className="static" aria-hidden />
            <div className="notfound-code">404</div>
          </TV>
        </motion.div>
        <h1 className="display section-title">
          No signal on <span className="serif-accent">this channel.</span>
        </h1>
        <p className="lead">The page you’re looking for has moved or doesn’t exist.</p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <MagneticButton to="/">Go home</MagneticButton>
          <MagneticButton to="/products" variant="ghost">
            Browse TVs
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
