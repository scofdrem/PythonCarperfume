import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, X, Menu, LogIn } from "lucide-react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Каталог", path: "/catalogue" },
    { name: "Бренды", path: "/catalogue?tab=brands" },
    { name: "О нас", path: "/#about" },
    { name: "Админ", path: "/admin" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#C69B56]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu button */}
          <button
            className="sm:hidden text-[#C69B56] p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.jpg"
              alt="1000 АРОМАТОВ"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <div className="text-[#C69B56] text-lg font-semibold tracking-[0.2em] leading-tight">
                1000 АРОМАТОВ
              </div>
              <div className="text-[#C69B56]/60 text-[10px] tracking-[0.15em] leading-tight">
                ПАРФЮМ НА РАСПИВ
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-[0.1em] uppercase transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-[#C69B56]"
                    : "text-white/70 hover:text-[#C69B56]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search + Login */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Search size={16} className="text-[#C69B56]" />
                <input
                  type="text"
                  placeholder="Поиск ароматов..."
                  className="bg-transparent text-white text-sm outline-none w-32 sm:w-48 placeholder:text-white/40"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X size={16} className="text-white/50 hover:text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/70 hover:text-[#C69B56] transition-colors p-1"
              >
                <Search size={20} />
              </button>
            )}

            <Link
              to="/auth/callback"
              className="flex items-center gap-2 px-4 py-2 border border-[#C69B56]/40 text-[#C69B56] text-xs tracking-[0.1em] uppercase hover:bg-[#C69B56]/10 hover:border-[#C69B56] transition-colors"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Войти</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-black border-t border-[#C69B56]/20">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-sm tracking-[0.1em] uppercase text-white/70 hover:text-[#C69B56] hover:bg-white/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/auth/callback"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-6 py-3 text-sm tracking-[0.1em] uppercase text-[#C69B56] hover:bg-[#C69B56]/10 transition-colors"
            >
              <LogIn size={14} />
              Войти
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}