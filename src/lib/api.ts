/**
 * Form submission stubs.
 *
 * The site ships without a backend. Replace the body of `submitForm`
 * with a real call (your own API, Formspree, EmailJS, Google Apps Script,
 * or the existing installation portal) before going live.
 */
export type FormKind = 'installation' | 'contact';

export async function submitForm(kind: FormKind, data: Record<string, string>): Promise<{ ok: true; ref: string }> {
  // Example:
  // const res = await fetch(import.meta.env.VITE_FORM_ENDPOINT, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ kind, ...data }),
  // });
  // if (!res.ok) throw new Error('Submission failed');
  void data;
  await new Promise((r) => setTimeout(r, 1200));
  const ref = `${kind === 'installation' ? 'WIN' : 'WCT'}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return { ok: true, ref };
}

export const isPhone = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10)) && v.replace(/\D/g, '').length >= 10;
export const isPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());
export const isEmail = (v: string) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
