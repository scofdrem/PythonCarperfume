import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDynamicBrands } from "@/data/brandsStore";
import { useSiteContent } from "@/data/siteContent";
import { resolveImageUrl } from "@/utils/storage";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C7.582 0 4 3.582 4 8c0 2.212.896 4.212 2.344 5.656L5 18l4.656-1.344A7.96 7.96 0 0 0 12 17.5c4.418 0 8-3.582 8-8s-3.582-8-8-8zm3.8 11.2c-.2.4-.9.8-1.2.8-.3 0-.6.1-2.1-.6-1.5-.7-2.5-2.2-2.6-2.3-.1-.1-.7-.9-.7-1.8 0-.9.5-1.3.6-1.5.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3.2.4.5 1.2.6 1.3.1.1.1.3 0 .4-.1.2-.1.3-.2.4-.1.1-.3.3-.4.4-.1.1-.2.3-.1.5.1.2.5.8 1.1 1.3.8.7 1.4.9 1.6 1 .2.1.3.1.4 0 .1-.1.5-.6.6-.8.2-.2.3-.2.5-.1.2.1 1.2.6 1.4.7.2.1.4.2.4.3.1.1.1.6-.1 1z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export default function Footer() {
  const content = useSiteContent();
  const { footer, about } = content;
  const { brands } = useDynamicBrands();
  const [logoUrl, setLogoUrl] = useState<string>("/logo.jpg");

  // Resolve logo URL when site content changes
  useEffect(() => {
    const logo = about.logo || "/logo.jpg";
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:") || logo === "/logo.jpg") {
      setLogoUrl(logo);
    } else if (logo.startsWith("storage://")) {
      resolveImageUrl(logo).then((url) => {
        setLogoUrl(url || "/logo.jpg");
      });
    } else {
      setLogoUrl(logo);
    }
  }, [about.logo]);

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={logoUrl}
                alt="1000 АРОМАТОВ"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="text-[#C69B56] text-sm font-semibold tracking-[0.15em]">
                  1000 АРОМАТОВ
                </div>
                <div className="text-[#C69B56]/50 text-[9px] tracking-[0.1em]">
                  ПАРФЮМ НА РАСПИВ
                </div>
              </div>
            </Link>
            <p className="text-white/30 text-xs leading-relaxed">
              {footer.brandDescription}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#C69B56] text-xs tracking-[0.15em] uppercase mb-4 font-medium">
              Навигация
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Каталог", path: "/catalogue" },
                { name: "Хиты продаж", path: "/catalogue?filter=featured" },
                { name: "Новинки", path: "/catalogue?filter=new" },
                { name: "О нас", path: "/#about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/40 text-xs hover:text-[#C69B56] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-[#C69B56] text-xs tracking-[0.15em] uppercase mb-4 font-medium">
              Бренды
            </h4>
            <ul className="space-y-2">
              {brands.slice(0, 8).map((brand) => (
                <li key={brand.slug}>
                  <Link
                    to={`/catalogue?brand=${brand.slug}`}
                    className="text-white/40 text-xs hover:text-[#C69B56] transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-[#C69B56] text-xs tracking-[0.15em] uppercase mb-4 font-medium">
              Контакты
            </h4>
            <ul className="space-y-3">
              <li className="text-white/40 text-xs">
                <span className="text-white/60">Telegram:</span>{" "}
                <a
                  href={`https://t.me/${footer.telegram.replace("@", "")}`}
                  className="hover:text-[#C69B56] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {footer.telegram}
                </a>
              </li>
              <li className="text-white/40 text-xs">
                <span className="text-white/60">Viber:</span>{" "}
                <a
                  href={`viber://chat?number=${footer.viber.replace(/[\s()-]/g, "")}`}
                  className="hover:text-[#C69B56] transition-colors"
                >
                  {footer.viber}
                </a>
              </li>
              <li className="text-white/40 text-xs">
                <span className="text-white/60">Instagram:</span>{" "}
                <a
                  href={`https://instagram.com/${footer.instagram.replace("@", "")}`}
                  className="hover:text-[#C69B56] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {footer.instagram}
                </a>
              </li>
              <li className="text-white/40 text-xs">
                <span className="text-white/60">Email:</span>{" "}
                <a
                  href={`mailto:${footer.email}`}
                  className="hover:text-[#C69B56] transition-colors"
                >
                  {footer.email}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href={`https://t.me/${footer.telegram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:border-[#C69B56]/30 hover:text-[#C69B56] transition-all duration-200"
              >
                <TelegramIcon />
              </a>
              <a
                href={`viber://chat?number=${footer.viber.replace(/[\s()-]/g, "")}`}
                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:border-[#C69B56]/30 hover:text-[#C69B56] transition-all duration-200"
              >
                <ViberIcon />
              </a>
              <a
                href={`https://instagram.com/${footer.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:border-[#C69B56]/30 hover:text-[#C69B56] transition-all duration-200"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[11px]">
            {footer.copyright}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/20 text-[11px] hover:text-white/40 transition-colors">
              {footer.privacyPolicyText}
            </a>
            <a href="#" className="text-white/20 text-[11px] hover:text-white/40 transition-colors">
              {footer.offerText}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}