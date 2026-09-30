import { SITE } from '../data/site';

const paths = {
  facebook: 'M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z',
  twitter: 'M4 4l7.3 9.7L4.3 20H6l6.1-5.5L16.5 20H20l-7.6-10.2L18.9 4h-1.7l-5.6 5.1L7.5 4H4z',
  linkedin:
    'M6.5 8.5A1.75 1.75 0 1 0 6.5 5a1.75 1.75 0 0 0 0 3.5zM5 10h3v9H5zm5.5 0h2.9v1.3c.4-.8 1.5-1.5 3-1.5 3 0 3.6 2 3.6 4.5V19h-3v-4.2c0-1-.1-2.3-1.5-2.3s-1.8 1.1-1.8 2.2V19h-3.2z',
  instagram:
    'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8zm4 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM17.3 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
} as const;

export function SocialIcons() {
  return (
    <div className="socials">
      {(Object.keys(paths) as (keyof typeof paths)[]).map((k) => (
        <a key={k} href={SITE.socials[k]} target="_blank" rel="noreferrer" aria-label={k} className="social">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d={paths[k]} />
          </svg>
        </a>
      ))}
    </div>
  );
}
