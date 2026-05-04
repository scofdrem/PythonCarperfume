import { Link } from "react-router-dom";
import {
  categories,
  featuredProducts,
  newProducts,
} from "@/data/products";
import ProductCard from "./ProductCard";

export function CategoryGrid() {
  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
            Категории
          </h2>
          <div className="w-16 h-px bg-[#C69B56] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalogue?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-[#1A1A1A] border border-white/5 hover:border-[#C69B56]/30 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                <h3 className="text-white text-sm font-medium tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
              Хиты продаж
            </h2>
            <div className="w-16 h-px bg-[#C69B56] mt-4" />
          </div>
          <Link
            to="/catalogue"
            className="text-[#C69B56] text-xs tracking-[0.1em] uppercase hover:text-[#d4aa65] transition-colors"
          >
            Все ароматы →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewArrivals() {
  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
              Новинки
            </h2>
            <div className="w-16 h-px bg-[#C69B56] mt-4" />
          </div>
          <Link
            to="/catalogue?filter=new"
            className="text-[#C69B56] text-xs tracking-[0.1em] uppercase hover:text-[#d4aa65] transition-colors"
          >
            Все новинки →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
            О нас
          </h2>
          <div className="w-16 h-px bg-[#C69B56] mx-auto mt-4" />
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: "🧪",
              title: "Оригинальная продукция",
              desc: "Все отливанты создаются исключительно из оригинальных флаконов с сертификатами подлинности",
            },
            {
              icon: "📦",
              title: "Безопасная упаковка",
              desc: "Каждый отливант разливается в стерильные стеклянные флаконы с распылителем",
            },
            {
              icon: "🚚",
              title: "Доставка по Беларуси",
              desc: "Отправляем заказы в любой город Беларуси. Бесплатная доставка от 100 BYN",
            },
            {
              icon: "💎",
              title: "Более 950 ароматов",
              desc: "Нишевая, люксовая и селективная парфюмерия от мировых брендов",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center p-6 bg-[#1A1A1A] border border-white/5 hover:border-[#C69B56]/20 transition-colors duration-300"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white text-sm font-medium tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-white/40 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* About Us description + Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-[#1A1A1A] border border-white/5 p-8 sm:p-10">
            <h3 className="text-[#C69B56] text-lg font-light tracking-[0.1em] uppercase mb-6">
              1000 Ароматов
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Мы — магазин парфюмерии на распив, который предлагает вам возможность
              познакомиться с элитными ароматами без необходимости покупать полный флакон.
              Каждый отливант разливается из оригинального флакона в стерильные условия
              с соблюдением всех стандартов качества.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              В нашем каталоге более 950 ароматов от ведущих мировых брендов:
              нишевая, люксовая и селективная парфюмерия. Мы гарантируем подлинность
              каждого флакона и бережную доставку по всей Беларуси.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">📍</span>
                <span className="text-white/50 text-sm">Минск, Беларусь</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">📞</span>
                <span className="text-white/50 text-sm">+375 (29) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">✉️</span>
                <span className="text-white/50 text-sm">info@1000aromatov.by</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">🕐</span>
                <span className="text-white/50 text-sm">Пн–Пт: 10:00–20:00, Сб: 11:00–18:00</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-[#1A1A1A] border border-white/5 overflow-hidden">
            <iframe
              title="Наше расположение"
              src="https://www.openstreetmap.org/export/embed.html?bbox=27.4%2C53.85%2C27.7%2C53.97&layer=mapnik"
              className="w-full h-full min-h-[350px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}