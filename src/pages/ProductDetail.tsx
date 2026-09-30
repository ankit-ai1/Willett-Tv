import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Phone, ShieldCheck, Sparkles, Volume2, Wrench } from 'lucide-react';
import { TV } from '../components/TV';
import { ProductViewer } from '../components/ProductViewer';
import { Reveal } from '../components/Reveal';
import { MagneticButton } from '../components/MagneticButton';
import { PRODUCTS, getProduct, priceLabel, specsFor } from '../data/products';
import { SITE, formatPhone, telHref } from '../data/site';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const p = getProduct(slug);
  useEffect(() => {
    document.title = p ? `${p.name} — Willett` : 'Page not found — Willett';
  }, [p]);
  if (!p) return <NotFound />;

  const siblings = PRODUCTS.filter((x) => x.series === p.series);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug)
    .sort((a, b) => Math.abs(a.size - p.size) - Math.abs(b.size - p.size))
    .slice(0, 3);

  return (
    <>
      <section className="pd-hero">
        <div className="page-hero-glow" aria-hidden />
        <div className="container pd-grid">
          <ProductViewer key={p.slug} p={p} />

          <div className="pd-info">
            <Link to="/products" className="back-link">
              <ArrowLeft size={16} /> All TVs
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="pd-tags">
                <span className="series-tag">{p.series} series</span>
                {p.smart && <span className="smart-tag">Smart TV</span>}
              </div>
              <h1 className="display pd-title">{p.name}</h1>
              <p className="lead">{p.headline}</p>
              <p className={`pd-price ${p.price === null ? 'product-price--req' : ''}`}>{priceLabel(p)}</p>
              {p.price !== null && <p className="muted small">Listed price. Final price may vary by retailer and region.</p>}
            </motion.div>

            <motion.div className="pd-sizes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="filter-label">Size</span>
              <div className="size-row size-row--flush">
                {siblings.map((s) => (
                  <Link key={s.slug} to={`/products/${s.slug}`} className={`size-tag ${s.slug === p.slug ? 'size-tag--on' : ''}`}>
                    {s.size}"{s.smart ? ' Smart' : ''}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div className="pd-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <MagneticButton to={`/contact?product=${p.slug}`}>
                {p.price === null ? 'Get a quote' : 'Enquire to buy'} <ArrowUpRight size={18} />
              </MagneticButton>
              <MagneticButton href={telHref(SITE.phones[0])} variant="ghost">
                <Phone size={16} /> {formatPhone(SITE.phones[0])}
              </MagneticButton>
            </motion.div>

            <motion.ul className="pd-perks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <li>
                <ShieldCheck size={18} /> 36-month warranty
              </li>
              <li>
                <Wrench size={18} /> Installation on request
              </li>
              <li>
                <Volume2 size={18} /> Pro-Audio speakers
              </li>
              <li>
                <Sparkles size={18} /> Active Image
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <h2 className="display section-title section-title--sm">Specifications</h2>
          </Reveal>
          <div className="spec-table">
            {specsFor(p).map((s, i) => (
              <Reveal key={s.label} className="spec-row" delay={i * 0.03} y={16}>
                <span className="spec-label">{s.label}</span>
                <span className="spec-value">{s.value}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <Reveal>
              <h2 className="display section-title section-title--sm">You might also like</h2>
            </Reveal>
            <div className="related">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.08}>
                  <Link to={`/products/${r.slug}`} className="related-card">
                    <TV art={r.art} />
                    <div className="related-foot">
                      <span>{r.name}</span>
                      <span className="muted">{priceLabel(r)}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
