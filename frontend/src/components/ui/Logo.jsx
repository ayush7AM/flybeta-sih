import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 no-underline ${className}`}
    >
      <img
        src={logoImg}
        alt="FlyBeta Logo"
        className="h-9 w-9 object-contain"
      />
      <span className="font-black text-2xl tracking-tighter uppercase text-black">
        FLYBETA
      </span>
    </Link>
  );
}
