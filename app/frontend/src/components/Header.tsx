import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSiteContent } from "@/data/siteContent";
import { resolveImageUrl } from "@/utils/storage";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const siteContent = useSiteContent();
  const [logoUrl, setLogoUrl] = useState<string>("/logo.jpg");

  // Detect landing mode from URL
  const landingSlug = params.landingSlug || params.slug || null;
  const isLandingMode = Boolean(landingSlug) && location.pathname.startsWith("/landing/");

  // Update favicon and tab title from site content
  useEffect(() => {
    if (siteContent.header.tabTitle) {
      document.title = siteContent.header.tabTitle;
    }
    if (siteContent.header.favicon) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = siteContent.header.favicon;
    }
  }, [siteContent.header.tabTitle, siteContent.header.favicon]);

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
    ? `${window.location.origin}/landing/${landingSlug}`
    : "/";
  
  const headerSettings = siteContent.header;
  const brandText = isLandingMode
    ? landingSlug?.toUpperCase().replace(/-/g, " ")
    : headerSettings.brandLine1 || "FOETIDA MAGNA";
  const brandSubtext = isLandingMode
    ? "КАТАЛОГ"
    : headerSettings.brandLine2 || "ИЗЫСКАННЫЙ АВТОПАРФЮМ";

  const navLinks = isLandingMode && landingSlug
    ? [
        { name: "Каталог", path: `/landing/${landingSlug}?tab=catalogue` },
        { name: "О нас", path: `/landing/${landingSlug}#about` },
        ...(headerSettings.navLinks?.admin !== false ? [{ name: "Админ", path: "/admin" }] : []),
      ]
    : [
        ...(headerSettings.navLinks?.catalogue !== false ? [{ name: "Каталог", path: "/catalogue" }] : []),
        ...(headerSettings.navLinks?.brands !== false ? [{ name: "Бренды", path: "/catalogue?tab=brands" }] : []),
        ...(headerSettings.navLinks?.about !== false ? [{ name: "О нас", path: "/#about" }] : []),
        ...(headerSettings.navLinks?.admin !== false ? [{ name: "Админ", path: "/admin" }] : []),
      ];

  // Handle hash links (e.g. "/#about") with smooth scrolling
  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const hashIndex = path.indexOf("#");
    const basePath = hashIndex >= 0 ? path.substring(0, hashIndex) : path;
    const hash = hashIndex >= 0 ? path.substring(hashIndex + 1) : "";

    setMobileMenuOpen(false);

    const isOnTargetPage =
      location.pathname === basePath ||
      (basePath === "/" && location.pathname === "/");

    if (isOnTargetPage) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(basePath);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

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
              alt={isLandingMode ? landingSlug : "FOETIDA MAGNA"}
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
            {navLinks.map((link) =>
              link.path.includes("#") ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleHashLink(e, link.path)}
                  className={`text-sm tracking-[0.1em] uppercase transition-colors duration-200 cursor-pointer ${
                    location.pathname === link.path.split("#")[0]
                      ? "text-[#C69B56]"
                      : "text-white/70 hover:text-[#C69B56]"
                  }`}
                >
                  {link.name}
                </a>
              ) : (
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
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-black border-t border-[#C69B56]/20">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) =>
              link.path.includes("#") ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleHashLink(e, link.path)}
                  className="px-6 py-3 text-sm tracking-[0.1em] uppercase text-white/70 hover:text-[#C69B56] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 text-sm tracking-[0.1em] uppercase text-white/70 hover:text-[#C69B56] hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
