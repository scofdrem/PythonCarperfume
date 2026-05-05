import { Link } from "react-router-dom";
import {
  categories,
  featuredProducts,
  newProducts,
} from "@/data/products";
import { useSiteContent } from "@/data/siteContent";
import ProductCard from "./ProductCard";

export function CategoryGrid() {
  const content = useSiteContent();

  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
            {content.sectionHeadings.categories}
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
  const content = useSiteContent();

  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
              {content.sectionHeadings.featured}
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
  const content = useSiteContent();

  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
              {content.sectionHeadings.newArrivals}
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
  const content = useSiteContent();
  const about = content.about || {};
  const banners = about.banners || [];

  return (
    <section id="about" className="py-16 sm:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
            {content.sectionHeadings?.about || "О нас"}
          </h2>
          <div className="w-16 h-px bg-[#C69B56] mx-auto mt-4" />
        </div>

        {/* Banners */}
        {banners.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {banners.map((banner, i) => (
            <a
              key={i}
              href={banner.link}
              className="group relative aspect-[4/3] overflow-hidden bg-[#1A1A1A] border border-white/5 hover:border-[#C69B56]/30 transition-all duration-300"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-5">
                <h3 className="text-white text-sm font-medium tracking-wide">
                  {banner.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
        )}

        {/* About Us description + Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-[#1A1A1A] border border-white/5 p-8 sm:p-10">
            <h3 className="text-[#C69B56] text-lg font-light tracking-[0.1em] uppercase mb-6">
              {about.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {about.description1}
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {about.description2}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">📍</span>
                <span className="text-white/50 text-sm">{about.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">📞</span>
                <span className="text-white/50 text-sm">{about.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">✉️</span>
                <span className="text-white/50 text-sm">{about.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C69B56]">🕐</span>
                <span className="text-white/50 text-sm">{about.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-[#1A1A1A] border border-white/5 overflow-hidden">
            <iframe
              title="Наше расположение"
              src={about.mapUrl}
              className="w-full h-full min-h-[350px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}