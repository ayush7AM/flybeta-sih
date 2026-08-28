import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';

export default function Logo({ to = '/', className = '' }) {
  const { isDarkMode } = useTheme();

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 no-underline ${className}`}
    >
      <img
        src={logoImg}
        alt="FlyBeta Logo"
        className="h-9 w-9 object-contain transition-all"
        style={{ filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}
      />
      <span className="font-black text-2xl tracking-tighter uppercase text-ink transition-colors">
        FLYBETA
      </span>
    </Link>
  );
}
