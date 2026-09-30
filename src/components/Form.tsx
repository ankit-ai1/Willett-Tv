import { motion } from 'framer-motion';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type Base = { label: string; error?: string; hint?: string };

export function Field({ label, error, hint, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field-label">{label}</span>
      <input className="field-input" aria-invalid={!!error} {...rest} />
      <FieldMsg error={error} hint={hint} />
    </label>
  );
}

export function SelectField({ label, error, hint, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field-label">{label}</span>
      <select className="field-input" aria-invalid={!!error} {...rest}>
        {children}
      </select>
      <FieldMsg error={error} hint={hint} />
    </label>
  );
}

export function TextArea({ label, error, hint, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field-label">{label}</span>
      <textarea className="field-input field-textarea" aria-invalid={!!error} {...rest} />
      <FieldMsg error={error} hint={hint} />
    </label>
  );
}

function FieldMsg({ error, hint }: { error?: string; hint?: string }) {
  if (error)
    return (
      <motion.span className="field-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert">
        {error}
      </motion.span>
    );
  if (hint) return <span className="field-hint">{hint}</span>;
  return null;
}

export function SuccessMark() {
  return (
    <svg className="success-mark" viewBox="0 0 80 80" aria-hidden>
      <motion.circle cx="40" cy="40" r="36" fill="none" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
      <motion.path d="M25 41 l10 10 l20 -22" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55, duration: 0.45, ease: 'easeOut' }} />
    </svg>
  );
}
