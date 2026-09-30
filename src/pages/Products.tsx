import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Wifi } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SCENE_GLOW, ScreenShow, TV3D } from '../components/TV3D';
import { PRODUCTS, priceLabel, type Product } from '../data/products';

type TypeFilter = 'all' | 'smart' | 'standard';
type SeriesFilter = 'all' | 'Willett' | 'Eagle';
type Sort = 'featured' | 'price-asc' | 'price-desc' | 'size';

const SIZES = [...new Set(PRODUCTS.map((p) => p.size))].sort((a, b) => a - b);

export default function Products() {
  const [params, setParams] = useSearchParams();
  const type = (params.get('type') as TypeFilter) || 'all';
  const series = (params.get('series') as SeriesFilter) || 'all';
  const size = params.get('size') ? Number(params.get('size')) : null;
  const sort = (params.get('sort') as Sort) || 'featured';

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v === null || v === 'all' || v === 'featured') next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    let l = PRODUCTS.filter(
      (p) =>
        (type === 'all' || (type === 'smart' ? p.smart : !p.smart)) &&
        (series === 'all' || p.series === series) &&
        (size === null || p.size === size),
    );
    const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
    if (sort === 'price-asc') l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === 'price-desc') l = [...l].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === 'size') l = [...l].sort((a, b) => a.size - b.size);
    return l;
  }, [type, series, size, sort]);

  return (
    <>
      <PageHero arts={['rose', 'sunset', 'lagoon', 'nebula', 'aurora']}
        crumb="Products"
        eyebrow="The collection"
        title="Every size."
        accent="Every room."
        sub="From a 24-inch kitchen companion to our 55-inch flagship — find the Willett that fits your wall, your room and your budget."
      />

      <section className="section section--tight">
        <div className="container">
          <div className="filters">
            <Segmented
              label="Type"
              value={type}
              options={[
                ['all', 'All'],
                ['smart', 'Smart'],
                ['standard', 'Standard'],
              ]}
              onChange={(v) => set('type', v)}
              id="type"
            />
            <Segmented
              label="Series"
              value={series}
              options={[
                ['all', 'All'],
                ['Willett', 'Willett'],
                ['Eagle', 'Eagle'],
              ]}
              onChange={(v) => set('series', v)}
              id="series"
            />
            <div className="filter-group">
              <span className="filter-label">Sort</span>
              <select className="select" value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="size">Screen size</option>
              </select>
            </div>
          </div>

          <div className="size-row" role="group" aria-label="Filter by screen size">
            <button className={`size-tag ${size === null ? 'size-tag--on' : ''}`} onClick={() => set('size', null)}>
              All sizes
            </button>
            {SIZES.map((s) => (
              <button key={s} className={`size-tag ${size === s ? 'size-tag--on' : ''}`} onClick={() => set('size', size === s ? null : String(s))}>
                {s}"
              </button>
            ))}
            <span className="result-count" aria-live="polite">
              {list.length} {list.length === 1 ? 'TV' : 'TVs'}
            </span>
          </div>

          <motion.div layout className="product-grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProductCard key={p.slug} p={p} i={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {list.length === 0 && (
            <motion.div className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p>No TVs match these filters.</p>
              <button className="text-link" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

function Segmented({ label, value, options, onChange, id }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void; id: string }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={v} role="radio" aria-checked={value === v} className={`seg ${value === v ? 'seg--on' : ''}`} onClick={() => onChange(v)}>
            {value === v && <motion.span layoutId={`seg-${id}`} className="seg-pill" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
            <span className="seg-text">{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  return (
    <motion.article
      layout
      className="product-card"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
    >
      <Link to={`/products/${p.slug}`} className="product-card-link">
        <div className="product-card-spot" aria-hidden />
        <div className="product-card-top">
          <span className="series-tag">{p.series}</span>
          {p.smart && (
            <span className="smart-tag">
              <Wifi size={12} /> Smart
            </span>
          )}
        </div>
        <div className="product-card-tv">
          <CardTV p={p} />
        </div>
        <div className="product-card-body">
          <div>
            <h3 className="product-card-name">{p.name}</h3>
            <p className="product-card-line">{p.headline}</p>
          </div>
          <div className="product-card-foot">
            <span className={`product-price ${p.price === null ? 'product-price--req' : ''}`}>{priceLabel(p)}</span>
            <span className="round-link" aria-hidden>
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/** Card TV: angled at rest, swings to face you on hover with a colour glow. */
function CardTV({ p }: { p: Product }) {
  const ry = useSpring(-18, { stiffness: 120, damping: 16 });
  const rx = useSpring(6, { stiffness: 120, damping: 16 });
  const [on, setOn] = useState(false);
  return (
    <div
      className="card-tv"
      onPointerEnter={() => {
        ry.set(0);
        rx.set(0);
        setOn(true);
      }}
      onPointerLeave={() => {
        ry.set(-18);
        rx.set(6);
        setOn(false);
      }}
    >
      <motion.div className="card-tv-glow" style={{ background: SCENE_GLOW[p.art] }} animate={{ opacity: on ? 0.75 : 0.25, scale: on ? 1.1 : 0.9 }} aria-hidden />
      <TV3D rotateX={rx} rotateY={ry}>
        <ScreenShow art={p.art} />
      </TV3D>
    </div>
  );
}
