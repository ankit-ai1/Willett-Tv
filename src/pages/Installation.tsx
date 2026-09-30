import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, MonitorUp, PanelTop } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Field, SelectField, SuccessMark, TextArea } from '../components/Form';
import { MagneticButton } from '../components/MagneticButton';
import { PRODUCTS } from '../data/products';
import { isPhone, isPincode, submitForm } from '../lib/api';

type Data = {
  model: string;
  invoice: string;
  purchaseDate: string;
  mount: 'wall' | 'table' | '';
  name: string;
  phone: string;
  pincode: string;
  city: string;
  address: string;
  date: string;
  slot: string;
  notes: string;
};

const EMPTY: Data = { model: '', invoice: '', purchaseDate: '', mount: '', name: '', phone: '', pincode: '', city: '', address: '', date: '', slot: 'Morning (9–12)', notes: '' };
const STEPS = ['Your TV', 'Mounting', 'Visit details'];

export default function Installation() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  useEffect(() => {
    if (status !== 'done') return;
    const t = setTimeout(() => document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    return () => clearTimeout(t);
  }, [status]);
  const [ref, setRef] = useState('');

  const up = <K extends keyof Data>(k: K, v: Data[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (s: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0 && !d.model) e.model = 'Please choose your TV model';
    if (s === 1 && !d.mount) e.mount = 'Choose wall or table top';
    if (s === 2) {
      if (d.name.trim().length < 2) e.name = 'Please enter your name';
      if (!isPhone(d.phone)) e.phone = 'Enter a valid 10-digit mobile number';
      if (!isPincode(d.pincode)) e.pincode = 'Enter a valid 6-digit PIN code';
      if (!d.city.trim()) e.city = 'City is required';
      if (d.address.trim().length < 8) e.address = 'Please add your full address';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const go = (n: number) => {
    if (n > step && !validate(step)) return;
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const submit = async () => {
    if (!validate(2)) return;
    setStatus('sending');
    const res = await submitForm('installation', d as unknown as Record<string, string>);
    setRef(res.ref);
    setStatus('done');
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHero arts={['dunes', 'sunset', 'lagoon']}
        crumb="Installation"
        eyebrow="Request installation"
        title="Unbox it."
        accent="We’ll do the rest."
        sub="Tell us about your TV and where you’d like it. A Willett technician will call to confirm your visit."
      />

      <section className="section section--tight">
        <div className="container form-shell">
          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div key="done" className="form-card success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <SuccessMark />
                <h2 className="display section-title section-title--sm">Request received</h2>
                <p className="lead">
                  Thank you, {d.name.split(' ')[0]}. Your reference is <strong className="ref">{ref}</strong>. Our team will call {d.phone} to confirm the visit.
                </p>
                <div className="hero-actions" style={{ justifyContent: 'center' }}>
                  <MagneticButton to="/">Back to home</MagneticButton>
                  <MagneticButton
                    variant="ghost"
                    onClick={() => {
                      setD(EMPTY);
                      setStep(0);
                      setStatus('idle');
                    }}
                  >
                    New request
                  </MagneticButton>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" className="form-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ol className="stepper">
                  {STEPS.map((s, i) => (
                    <li key={s} className={`stepper-item ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
                      <button type="button" onClick={() => i < step && go(i)} disabled={i > step}>
                        <span className="stepper-dot">{i < step ? <Check size={14} /> : i + 1}</span>
                        <span className="stepper-label">{s}</span>
                      </button>
                    </li>
                  ))}
                  <motion.span className="stepper-bar" animate={{ scaleX: step / (STEPS.length - 1) }} />
                </ol>

                <div className="step-viewport">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      initial={{ opacity: 0, x: 40 * dir }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 * dir }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {step === 0 && (
                        <div className="form-grid">
                          <SelectField label="TV model *" value={d.model} onChange={(e) => up('model', e.target.value)} error={errors.model}>
                            <option value="">Select your TV</option>
                            {PRODUCTS.map((p) => (
                              <option key={p.slug} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                            <option value="Other / not sure">Other / not sure</option>
                          </SelectField>
                          <Field label="Invoice number" placeholder="Optional" value={d.invoice} onChange={(e) => up('invoice', e.target.value)} />
                          <Field label="Purchase date" type="date" max={today} value={d.purchaseDate} onChange={(e) => up('purchaseDate', e.target.value)} />
                        </div>
                      )}

                      {step === 1 && (
                        <div>
                          <div className="mount-options" role="radiogroup" aria-label="Mounting type">
                            {[
                              { v: 'wall' as const, icon: <PanelTop size={28} />, t: 'Wall mount', s: 'Clean, floating look. Bracket fitted by our technician.' },
                              { v: 'table' as const, icon: <MonitorUp size={28} />, t: 'Table top', s: 'Set up on the stand with legs, on your console or cabinet.' },
                            ].map((o) => (
                              <button
                                type="button"
                                role="radio"
                                aria-checked={d.mount === o.v}
                                key={o.v}
                                className={`mount-option ${d.mount === o.v ? 'mount-option--on' : ''}`}
                                onClick={() => up('mount', o.v)}
                              >
                                <span className="mount-option-icon">{o.icon}</span>
                                <span className="mount-option-title">{o.t}</span>
                                <span className="muted small">{o.s}</span>
                                <span className="mount-option-check">
                                  <Check size={14} />
                                </span>
                              </button>
                            ))}
                          </div>
                          {errors.mount && <p className="field-error" role="alert">{errors.mount}</p>}
                        </div>
                      )}

                      {step === 2 && (
                        <div className="form-grid">
                          <Field label="Full name *" autoComplete="name" value={d.name} onChange={(e) => up('name', e.target.value)} error={errors.name} />
                          <Field label="Mobile number *" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" value={d.phone} onChange={(e) => up('phone', e.target.value)} error={errors.phone} />
                          <Field label="PIN code *" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={d.pincode} onChange={(e) => up('pincode', e.target.value.replace(/\D/g, ''))} error={errors.pincode} />
                          <Field label="City *" autoComplete="address-level2" value={d.city} onChange={(e) => up('city', e.target.value)} error={errors.city} />
                          <div className="span-2">
                            <TextArea label="Full address *" rows={3} autoComplete="street-address" value={d.address} onChange={(e) => up('address', e.target.value)} error={errors.address} />
                          </div>
                          <Field label="Preferred date" type="date" min={today} value={d.date} onChange={(e) => up('date', e.target.value)} />
                          <SelectField label="Preferred time" value={d.slot} onChange={(e) => up('slot', e.target.value)}>
                            <option>Morning (9–12)</option>
                            <option>Afternoon (12–4)</option>
                            <option>Evening (4–7)</option>
                          </SelectField>
                          <div className="span-2">
                            <TextArea label="Anything else?" rows={2} placeholder="Floor, lift access, wall type…" value={d.notes} onChange={(e) => up('notes', e.target.value)} />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="form-nav">
                  <button type="button" className="btn-plain" onClick={() => go(step - 1)} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <MagneticButton onClick={() => go(step + 1)}>
                      Continue <ArrowRight size={16} />
                    </MagneticButton>
                  ) : (
                    <MagneticButton onClick={submit} disabled={status === 'sending'}>
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={16} className="spin" /> Sending…
                        </>
                      ) : (
                        <>
                          Submit request <Check size={16} />
                        </>
                      )}
                    </MagneticButton>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
