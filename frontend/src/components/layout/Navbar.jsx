import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  { label: 'Tracks', path: '/tracks' },
  { label: 'Labs', path: '/labs' },
  { label: 'Vision', path: '/vision' },
];

const AUTH_NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { themeKey, themes, themeKeys, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-20 bg-surface border-b-2 border-ink"
         style={{ boxShadow: 'var(--shadow-brutal)' }}>
      {/* Left: Hamburger (Mobile) + Logo + Nav Links (Desktop) */}
      <div className="flex items-center gap-4 md:gap-8">
        <button
          className="md:!hidden brutalist-badge bg-canvas text-ink cursor-pointer hover:bg-border-light transition-colors p-2 mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Logo to="/tracks" />

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-2">
          {[...NAV_LINKS, ...(user ? AUTH_NAV_LINKS : [])].map(({ label, path }) => {
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
      <div className="flex items-center gap-2 md:gap-3">
        {user && (
          <>
            <div className="brutalist-badge bg-flame-light text-flame hidden md:flex" title="Daily Streak">
              <span>🔥</span>
              <span>{user.streak || 0}</span>
            </div>

          </>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="brutalist-badge bg-canvas text-ink cursor-pointer hover:bg-border-light transition-colors p-2"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Theme Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="brutalist-badge bg-canvas text-ink cursor-pointer hover:bg-border-light transition-colors"
            title="Switch Theme"
          >
            <span>{themes[themeKey].icon}</span>
            <span className="hidden lg:inline">{themes[themeKey].label}</span>
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

        {/* Logout Button */}
        {user && (
          <button
            onClick={logout}
            className="brutalist-badge bg-red-100 text-red-700 cursor-pointer hover:bg-red-200 transition-colors p-2 hidden md:flex"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden absolute top-20 left-0 w-full bg-surface border-b-2 border-ink shadow-[var(--shadow-brutal)] flex flex-col z-40"
        >
          {[...NAV_LINKS, ...(user ? AUTH_NAV_LINKS : [])].map(({ label, path }) => {
            const isActive = path === '/tracks'
              ? location.pathname === '/tracks' || location.pathname.startsWith('/track')
              : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`label-mono px-6 py-4 border-b border-border-light last:border-b-0 no-underline transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-ink hover:bg-canvas'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
