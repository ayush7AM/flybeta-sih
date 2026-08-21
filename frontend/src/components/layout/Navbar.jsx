import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Tracks', path: '/' },
  { label: 'Labs', path: '/labs' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-20 bg-white border-b-2 border-ink"
         style={{ boxShadow: 'var(--shadow-brutal)' }}>
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="heading-md border-2 border-ink px-3 py-1 no-underline text-ink hover:bg-primary hover:text-white transition-colors">
          FlyBeta
        </Link>
        <div className="hidden md:flex gap-2">
          {NAV_LINKS.map(({ label, path }) => {
            const isActive = location.pathname === path ||
              (path === '/' && location.pathname.startsWith('/track'));
            return (
              <Link
                key={path}
                to={path}
                className={`label-mono px-4 py-2 no-underline border-2 transition-all ${
                  isActive
                    ? 'bg-primary text-white border-ink'
                    : 'text-muted border-transparent hover:border-ink hover:bg-canvas'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: Gamification Stats */}
      <div className="flex items-center gap-3">
        <div className="brutalist-badge bg-flame-light text-flame">
          <span>🔥</span>
          <span>0</span>
        </div>
        <div className="brutalist-badge bg-gold-light text-gold">
          <span>💰</span>
          <span>0</span>
        </div>
        <div className="brutalist-badge bg-cobalt-light text-cobalt">
          <span>⚡</span>
          <span>0 XP</span>
        </div>
      </div>
    </nav>
  );
}
