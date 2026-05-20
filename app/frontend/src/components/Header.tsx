import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSiteContent } from "@/data/siteContent";
import { resolveImageUrl } from "@/utils/storage";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const params = useParams();
  const siteContent = useSiteContent();
  const [logoUrl, setLogoUrl] = useState<string>("/logo.jpg");

  // Detect landing mode from URL
  const landingSlug = params.landingSlug || params.slug || null;
  const isLandingMode = Boolean(landingSlug) && location.pathname.startsWith("/landing/");

  // Resolve logo URL when site content changes
  useEffect(() => {
    const logo = siteContent.about.logo || "/logo.jpg";
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:") || logo === "/logo.jpg") {
      setLogoUrl(logo);
    } else if (logo.startsWith("storage://")) {
      resolveImageUrl(logo).then((url) => {
        setLogoUrl(url || "/logo.jpg");
      });
    } else {
      setLogoUrl(logo);
    }
  }, [siteContent.about.logo]);

  // Home link resolves to current origin (stays on same domain)
  const homeLink = isLandingMode && landingSlug
    ? `http://${window.location.host}/landing/${landingSlug}`
    : "/";
  
  const brandText = isLandingMode ? landingSlug?.toUpperCase().replace(/-/g, " ") : "1000 АРОМАТОВ";
  const brandSubtext = isLandingMode ? "КАТАЛОГ" : "ПАРФЮМ НА РАСПИВ";

  const navLinks = isLandingMode && landingSlug
    ? [
        { name: "Каталог", path: `/landing/${landingSlug}?tab=catalogue` },
        { name: "О нас", path: `/landing/${landingSlug}#about` },
      ]
    : [
        { name: "Каталог", path: "/catalogue" },
        { name: "Бренды", path: "/catalogue?tab=brands" },
        { name: "О нас", path: "/#about" },
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

          {/* Logo - context-aware: resolves to current domain */}
          <a href={homeLink} className="flex items-center gap-3 shrink-0">
            <img
              src={logoUrl}
              alt={isLandingMode ? landingSlug : "1000 АРОМАТОВ"}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <div className="text-[#C69B56] text-lg font-semibold tracking-[0.2em] leading-tight">
                {brandText}
              </div>
              <div className="text-[#C69B56]/60 text-[10px] tracking-[0.15em] leading-tight">
                {brandSubtext}
              </div>
            </div>
          </a>

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
          </nav>
        </div>
      )}
    </header>
  );
}
