import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight, BadgeCheck, BookOpen, Headset, Phone, Plus, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Reveal, SplitText } from '../components/Reveal';
import { SITE, formatPhone, telHref } from '../data/site';

const faqs = [
  {
    q: 'How long is the warranty on a Willett TV?',
    a: 'Every Willett LED TV comes with a 36-month warranty. Keep your invoice handy — our support team will ask for it when you raise a request.',
  },
  {
    q: 'How do I book installation or a wall mount?',
    a: 'Use the Request Installation page, or call us on either support number. Every Willett TV supports both table-top and wall mounting.',
  },
  {
    q: 'My TV has a problem. What should I do?',
    a: `Call ${formatPhone(SITE.phones[0])} or ${formatPhone(SITE.phones[1])} with your model and invoice details. You can also send us a message from the Contact page and we’ll call you back.`,
  },
  {
    q: 'Where can I buy a Willett TV online?',
    a: 'Willett TVs are also available on Amazon, Paytm and Snapdeal. You can also enquire directly from any product page and our team will help you order.',
  },
  {
    q: 'How do I dispose of an old TV responsibly?',
    a: 'We run an e-waste management programme. Visit the E-waste page for how to hand over old electronics for safe recycling.',
  },
];

export default function Support() {
  return (
    <>
      <PageHero arts={['ocean', 'aurora', 'glacier']}
        crumb="Support"
        eyebrow="Support centre"
        title="How can we"
        accent="help you today?"
        sub="Warranty, installation, catalogues or a quick question — we’re a phone call away."
      />

      <section className="section section--tight" id="warranty">
        <div className="container support-cards">
          <SupportCard icon={<BadgeCheck size={26} />} kicker="36 months" title="Warranty & service" text="Raise a service request for your Willett TV. We’ll guide you through it step by step." cta="Get support" to="/contact?topic=support" />
          <SupportCard icon={<BookOpen size={26} />} kicker="Catalogue" title="Product catalogue" text="Full range, sizes and features in one place. Ask and we’ll send the latest edition." cta="Request catalogue" to="/contact?topic=catalogue" delay={0.08} />
          <SupportCard icon={<Wrench size={26} />} kicker="Installation" title="Book an installation" text="Wall mount or table top — schedule a technician visit at your convenience." cta="Request installation" to="/installation" delay={0.16} />
        </div>
      </section>

      <section className="feature-strip">
        <div className="container feature-strip-inner">
          {[
            ['High Pitched', 'Transparent sound'],
            ['Active Image', 'Enhanced visual experience'],
            ['Low Frequency', 'Featuring low distortion'],
            ['Pro-Audio', 'High power speakers'],
          ].map(([a, b], i) => (
            <Reveal key={a} className="feature-strip-item" delay={i * 0.06}>
              <p className="feature-strip-title">{a}</p>
              <p className="feature-strip-sub">{b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container faq-grid">
          <div>
            <Reveal>
              <p className="eyebrow">FAQ</p>
            </Reveal>
            <h2 className="display section-title">
              <SplitText text="Quick" /> <span className="serif-accent"><SplitText text="answers." delay={0.1} /></span>
            </h2>
            <Reveal delay={0.1}>
              <p className="lead">Can’t find what you need? Our team picks up the phone.</p>
            </Reveal>
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <Faq key={f.q} {...f} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="call-card">
            <div className="call-card-glow" aria-hidden />
            <span className="call-icon">
              <Headset size={28} />
            </span>
            <div>
              <p className="eyebrow">Requests & complaints</p>
              <h2 className="display call-title">Talk to a real person.</h2>
            </div>
            <div className="call-numbers">
              {SITE.phones.map((p) => (
                <a key={p} href={telHref(p)} className="call-number">
                  <Phone size={18} />
                  {formatPhone(p)}
                  <ArrowUpRight size={16} className="call-arrow" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function SupportCard({ icon, kicker, title, text, cta, to, delay = 0 }: { icon: React.ReactNode; kicker: string; title: string; text: string; cta: string; to: string; delay?: number }) {
  return (
    <Reveal className="support-card" delay={delay}>
      <span className="support-icon">{icon}</span>
      <p className="support-kicker">{kicker}</p>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      <Link to={to} className="text-link">
        {cta} <ArrowUpRight size={15} />
      </Link>
    </Reveal>
  );
}

function Faq({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-q" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {q}
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="faq-plus">
          <Plus size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
            <p className="faq-a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
