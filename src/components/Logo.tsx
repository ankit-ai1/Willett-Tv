import { Link } from 'react-router-dom';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="logo" aria-label="Willett — home">
      <span className="logo-word">
        Willett<sup>®</sup>
      </span>
      {!compact && (
        <span className="logo-tag">
          भारत में निर्मित, भारत का अपना TV
          <span className="logo-tricolor" aria-hidden />
        </span>
      )}
    </Link>
  );
}
