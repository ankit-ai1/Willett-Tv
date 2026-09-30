import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { BackToTop, ScrollProgress, ScrollToTopOnRoute } from './components/Scroll';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Support = lazy(() => import('./pages/Support'));
const Installation = lazy(() => import('./pages/Installation'));
const Contact = lazy(() => import('./pages/Contact'));
const EWaste = lazy(() => import('./pages/EWaste'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

const TITLES: Record<string, string> = {
  '/': 'Willett — Experience Reality Beyond Imagination',
  '/about': 'About — Willett',
  '/products': 'Smart & LED TVs — Willett',
  '/support': 'Support — Willett',
  '/installation': 'Request Installation — Willett',
  '/contact': 'Contact — Willett',
  '/e-waste': 'E-waste Management — Willett',
  '/privacy': 'Privacy Policy — Willett',
};

const BARS = 5;

/** Each page brings its own curtain: bars sweep away on enter and close over it on exit. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.main
        id="main"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 } }}
        exit={{ opacity: 1, transition: { duration: 0.7 } }}
      >
        {children}
      </motion.main>
      <div className="curtain" aria-hidden>
        {Array.from({ length: BARS }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 1, transformOrigin: '50% 0%' }}
            animate={{ scaleY: 0, transformOrigin: '50% 0%', transition: { duration: 0.6, delay: 0.05 + i * 0.05, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ scaleY: 1, transformOrigin: '50% 100%', transition: { duration: 0.5, delay: i * 0.05, ease: [0.76, 0, 0.24, 1] } }}
          />
        ))}
      </div>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const top = '/' + (location.pathname.split('/')[1] ?? '');
  useEffect(() => {
    if (location.pathname.startsWith('/products/')) return; // ProductDetail sets its own title
    document.title = TITLES[top] ?? 'Page not found — Willett';
  }, [location.pathname, top]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <ScrollToTopOnRoute />
      <div className="noise" aria-hidden />
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="route-loading" />} key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/products" element={<Page><Products /></Page>} />
            <Route path="/products/:slug" element={<Page><ProductDetail /></Page>} />
            <Route path="/support" element={<Page><Support /></Page>} />
            <Route path="/installation" element={<Page><Installation /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            <Route path="/e-waste" element={<Page><EWaste /></Page>} />
            <Route path="/privacy" element={<Page><Privacy /></Page>} />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </MotionConfig>
  );
}
