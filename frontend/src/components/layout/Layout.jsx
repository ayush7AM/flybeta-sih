import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import OracleWidget from './OracleWidget';
import { useTheme } from '../../context/ThemeContext';

// ── Per-theme background images ──────────────────────────────────────────
const THEME_BACKGROUNDS = {
  'doraemon-blue': '/doremon-theme/doremon_flybeta.png',
  'shinchan':      '/shinchan-theme/shinchan-theme-bg.png',
  'princess':      '/disney-princess-thene/bg-theme.jpeg',
  'anime':         '/anime-theme/anime-theme.jpeg',
};

export default function Layout() {
  const { themeKey } = useTheme();
  const bgImage = THEME_BACKGROUNDS[themeKey];
  const hasThemedBg = !!bgImage;

  return (
    <div
      className={`min-h-screen ${hasThemedBg ? '' : 'grid-bg'}`}
      style={
        hasThemedBg
          ? {
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      {/* Cream readability overlay — only rendered for themed backgrounds */}
      {hasThemedBg && (
        <div
          className="fixed inset-0"
          style={{ background: '#F9F8F6', opacity: 0.8, zIndex: 0 }}
        />
      )}

      {/* All content sits above the overlay */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="max-w-[1440px] mx-auto px-4 md:px-12 pt-28 pb-16">
          <Outlet />
        </main>
        <OracleWidget />
      </div>
    </div>
  );
}
