import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Loader2, Mail, Phone, Send } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Field, SelectField, SuccessMark, TextArea } from '../components/Form';
import { MagneticButton } from '../components/MagneticButton';
import { SocialIcons } from '../components/SocialIcons';
import { Reveal } from '../components/Reveal';
import { PRODUCTS, getProduct } from '../data/products';
import { SITE, formatPhone, telHref } from '../data/site';
import { isEmail, isPhone, submitForm } from '../lib/api';

const TOPICS: Record<string, string> = {
  buy: 'Buying a TV',
  support: 'Service / warranty',
  catalogue: 'Product catalogue',
  dealer: 'Dealership enquiry',
  other: 'Something else',
};

export default function Contact() {
  const [params] = useSearchParams();
  const pre = getProduct(params.get('product') ?? '');
  const topicParam = params.get('topic') ?? '';
  const [f, setF] = useState({
    name: '',
    phone: '',
    email: '',
    topic: pre ? 'buy' : TOPICS[topicParam] ? topicParam : 'buy',
    product: pre?.name ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  useEffect(() => {
    if (status !== 'done') return;
    const t = setTimeout(() => document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, [status]);

  const up = (k: keyof typeof f, v: string) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = 'Please enter your name';
    if (!isPhone(f.phone)) er.phone = 'Enter a valid 10-digit mobile number';
    if (!isEmail(f.email)) er.email = 'That email doesn’t look right';
    if (f.message.trim().length < 5) er.message = 'Tell us a little more';
    setErrors(er);
    if (Object.values(er).some(Boolean)) return;
    setStatus('sending');
    await submitForm('contact', { ...f, topic: TOPICS[f.topic] });
    setStatus('done');
  };

  return (
    <>
      <PageHero arts={['nebula', 'rose', 'ocean']} crumb="Contact" eyebrow="Contact us" title="Let’s talk" accent="television." sub="Buying, service, dealership or just a question — drop us a line or call directly." />

      <section className="section section--tight">
        <div className="container contact-grid">
          <Reveal className="contact-side">
            <div className="contact-block">
              <p className="filter-label">Call us</p>
              {SITE.phones.map((p) => (
                <a key={p} href={telHref(p)} className="contact-big">
                  <Phone size={20} /> {formatPhone(p)}
                  <ArrowUpRight size={18} className="call-arrow" />
                </a>
              ))}
              <p className="muted small">For requests and complaints.</p>
            </div>
            <div className="contact-block">
              <p className="filter-label">Follow Willett</p>
              <SocialIcons />
            </div>
            <div className="contact-block">
              <p className="filter-label">Also available on</p>
              <div className="market-pills">
                {SITE.marketplaces.map((m) => (
                  <span key={m} className="market-pill">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="ok" className="form-card success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <SuccessMark />
                  <h2 className="display section-title section-title--sm">Message sent</h2>
                  <p className="lead">Thanks, {f.name.split(' ')[0]}. We’ll get back to you on {f.phone} shortly.</p>
                  <MagneticButton to="/products">Browse TVs</MagneticButton>
                </motion.div>
              ) : (
                <motion.form key="form" className="form-card" onSubmit={submit} noValidate exit={{ opacity: 0, y: -20 }}>
                  <div className="form-grid">
                    <Field label="Your name *" autoComplete="name" value={f.name} onChange={(e) => up('name', e.target.value)} error={errors.name} />
                    <Field label="Mobile number *" type="tel" inputMode="numeric" autoComplete="tel" value={f.phone} onChange={(e) => up('phone', e.target.value)} error={errors.phone} />
                    <Field label="Email" type="email" autoComplete="email" placeholder="Optional" value={f.email} onChange={(e) => up('email', e.target.value)} error={errors.email} />
                    <SelectField label="Topic" value={f.topic} onChange={(e) => up('topic', e.target.value)}>
                      {Object.entries(TOPICS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </SelectField>
                    <div className="span-2">
                      <SelectField label="Product (optional)" value={f.product} onChange={(e) => up('product', e.target.value)}>
                        <option value="">— None —</option>
                        {PRODUCTS.map((p) => (
                          <option key={p.slug} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </SelectField>
                    </div>
                    <div className="span-2">
                      <TextArea label="Message *" rows={5} value={f.message} onChange={(e) => up('message', e.target.value)} error={errors.message} />
                    </div>
                  </div>
                  <div className="form-nav">
                    <span className="muted small" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={14} /> Our team will get back to you.
                    </span>
                    <MagneticButton type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={16} className="spin" /> Sending…
                        </>
                      ) : (
                        <>
                          Send message <Send size={16} />
                        </>
                      )}
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </>
  );
}
