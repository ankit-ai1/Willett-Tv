import { Link } from 'react-router-dom';
import { ArrowUpRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { SITE, formatPhone, telHref } from '../data/site';
import { SocialIcons } from './SocialIcons';
import { MagneticButton } from './MagneticButton';

const cols = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About Willett' },
      { to: '/products', label: 'All TVs' },
      { to: '/products?type=smart', label: 'Smart TVs' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/support', label: 'Help centre' },
      { to: '/support#warranty', label: '36-month warranty' },
      { to: '/installation', label: 'Request installation' },
      { to: '/contact', label: 'Contact us' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/e-waste', label: 'E-waste management' },
      { to: '/privacy', label: 'Privacy policy' },
      { to: '/about#story', label: 'Our story' },
      { to: '/about#vision', label: 'Make in India' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="display footer-cta-title">
              Bring the cinema <span className="serif-accent">home.</span>
            </h2>
          </div>
          <div className="footer-cta-actions">
            <MagneticButton to="/products">Browse TVs</MagneticButton>
            <MagneticButton to="/contact" variant="ghost">
              Talk to us
            </MagneticButton>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-about">
              Willett LED TVs are designed and made in India by {SITE.company}, an offshoot of Willett Communications — the fibre-optic cable makers.
            </p>
            <div className="footer-phones">
              {SITE.phones.map((p) => (
                <a key={p} href={telHref(p)} className="footer-phone">
                  <Phone size={15} /> {formatPhone(p)}
                </a>
              ))}
            </div>
            <SocialIcons />
          </div>
          {cols.map((c) => (
            <div key={c.title} className="footer-col">
              <p className="footer-col-title">{c.title}</p>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer-link">
                      {l.label}
                      <ArrowUpRight size={13} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-col">
            <p className="footer-col-title">Also on</p>
            <ul className="footer-market">
              {SITE.marketplaces.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          className="footer-giant"
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          Willett
        </motion.div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.company}. All rights reserved.</span>
          <span className="footer-made">
            <span className="tricolor-dot" aria-hidden /> Proudly made in India
          </span>
        </div>
      </div>
    </footer>
  );
}
