import { Link } from "react-router-dom";
import { brands } from "@/data/products";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpg"
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
              Интернет-магазин отливантов элитной парфюмерии. Оригинальные ароматы
              от 2 мл с доставкой по всей Беларуси.
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
                  href="#"
                  className="hover:text-[#C69B56] transition-colors"
                >
                  @1000aromatov
                </a>
              </li>
              <li className="text-white/40 text-xs">
                <span className="text-white/60">WhatsApp:</span>{" "}
                <a
                  href="#"
                  className="hover:text-[#C69B56] transition-colors"
                >
                  +375 (29) 123-45-67
                </a>
              </li>
              <li className="text-white/40 text-xs">
                <span className="text-white/60">Email:</span>{" "}
                <a
                  href="#"
                  className="hover:text-[#C69B56] transition-colors"
                >
                  info@1000aromatov.by
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {["TG", "WA", "VK"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-white/40 text-[10px] hover:border-[#C69B56]/30 hover:text-[#C69B56] transition-all duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[11px]">
            © 2026 1000 АРОМАТОВ. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/20 text-[11px] hover:text-white/40 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-white/20 text-[11px] hover:text-white/40 transition-colors">
              Оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}