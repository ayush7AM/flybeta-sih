import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  { label: 'Tracks', path: '/tracks' },
  { label: 'Labs', path: '/labs' },
  { label: 'Vision', path: '/vision' },
];

export default function Navbar() {
  const location = useLocation();
  const { user } = useUser();
  const { themeKey, themes, themeKeys, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-20 bg-surface border-b-2 border-ink"
         style={{ boxShadow: 'var(--shadow-brutal)' }}>
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-8">
        <Logo to="/tracks" />
        <div className="hidden md:flex gap-2">
          {NAV_LINKS.map(({ label, path }) => {
            const isActive = path === '/tracks'
              ? location.pathname === '/tracks' || location.pathname.startsWith('/track')
              : location.pathname.startsWith(path);
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

      {/* Right: Gamification Stats + Theme Switcher */}
      <div className="flex items-center gap-3">
        <div className="brutalist-badge bg-flame-light text-flame" title="Daily Streak">
          <span>🔥</span>
          <span>{user.streak}</span>
        </div>
        <div className="brutalist-badge bg-gold-light text-gold" title="Coins">
          <span>💰</span>
          <span>{user.coins}</span>
        </div>
        <div className="brutalist-badge bg-cobalt-light text-cobalt" title="Experience Points">
          <span>⚡</span>
          <span>{user.xp} XP</span>
        </div>

        {/* Theme Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="brutalist-badge bg-canvas text-ink cursor-pointer hover:bg-border-light transition-colors"
            title="Switch Theme"
          >
            <span>{themes[themeKey].icon}</span>
            <span className="hidden md:inline">{themes[themeKey].label}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 border-2 border-ink bg-surface z-50"
                 style={{ boxShadow: 'var(--shadow-brutal-sm)', minWidth: '180px' }}>
              {themeKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => { setTheme(key); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 label-mono flex items-center gap-2 border-b border-border-light last:border-b-0 transition-colors cursor-pointer ${
                    key === themeKey
                      ? 'bg-primary text-white'
                      : 'bg-surface text-ink hover:bg-canvas'
                  }`}
                >
                  <span>{themes[key].icon}</span>
                  <span>{themes[key].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
