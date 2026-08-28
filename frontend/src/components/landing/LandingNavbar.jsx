import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function LandingNavbar() {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="relative z-20 flex items-center justify-between w-full px-8 py-4">
      {/* Left: Logo */}
      <Logo to="/" />

      {/* Center: Marketing Links */}
      <div className="hidden md:flex items-center gap-8 font-semibold text-ink">
        <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="no-underline text-ink hover:text-[#EAB308] transition-colors uppercase tracking-wider text-sm cursor-pointer">
          Home
        </a>
        <a href="#about-us" onClick={(e) => scrollToSection(e, 'about-us')} className="no-underline text-ink hover:text-[#EAB308] transition-colors uppercase tracking-wider text-sm cursor-pointer">
          About Us
        </a>
        <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="no-underline text-ink hover:text-[#EAB308] transition-colors uppercase tracking-wider text-sm cursor-pointer">
          How it Works
        </a>
        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="no-underline text-ink hover:text-[#EAB308] transition-colors uppercase tracking-wider text-sm cursor-pointer">
          Contact
        </a>
      </div>

      {/* Right: Get Started */}
      <Link
        to="/tracks"
        className="bg-black text-white px-6 py-2.5 font-bold hover:bg-[#EAB308] hover:text-black border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider text-sm no-underline"
      >
        GET STARTED
      </Link>
    </nav>
  );
}
