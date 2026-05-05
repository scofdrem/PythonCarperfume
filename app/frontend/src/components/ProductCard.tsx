import { useState } from "react";
import { ChevronDown, Instagram, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import InquiryModal from "./InquiryModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVolume, setSelectedVolume] = useState(
    product.volumes[Math.min(2, product.volumes.length - 1)]
  );
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const getPriceForVolume = (vol: number): number => {
    const minVol = product.volumes?.[0] ?? vol;
    const maxVol = product.volumes?.[product.volumes.length - 1] ?? vol;
    const minPrice = product.priceRange?.[0] ?? 0;
    const maxPrice = product.priceRange?.[1] ?? 0;
    if (vol <= minVol) return minPrice;
    if (vol >= maxVol) return maxPrice;
    const ratio = (vol - minVol) / (maxVol - minVol);
    return Math.round(minPrice + ratio * (maxPrice - minPrice));
  };

  const price = getPriceForVolume(selectedVolume);

  return (
    <div className="group bg-[#1A1A1A] border border-white/5 hover:border-[#C69B56]/30 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-[#C69B56] text-black text-[10px] tracking-[0.1em] uppercase px-2 py-1 font-medium">
            Новинка
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#C69B56]/70 text-[11px] tracking-[0.1em] uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="text-white text-sm font-medium mb-3 leading-snug">
          {product.name}
        </h3>

        {/* Volume selector */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.volumes.slice(0, 6).map((vol) => (
            <button
              key={vol}
              onClick={() => setSelectedVolume(vol)}
              className={`px-2 py-0.5 text-[10px] tracking-wide border transition-colors duration-200 ${
                selectedVolume === vol
                  ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                  : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/60"
              }`}
            >
              {vol} мл
            </button>
          ))}
          {product.volumes.length > 6 && (
            <span className="px-2 py-0.5 text-[10px] text-white/30">
              +{product.volumes.length - 6}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center mb-3">
          <span className="text-white text-base font-light">
            {price.toLocaleString("ru-RU")} BYN
          </span>
        </div>

        {/* Inquiry button */}
        <button
          onClick={() => setInquiryOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#C69B56]/10 border border-[#C69B56]/30 text-[#C69B56] text-xs tracking-wide py-2.5 mb-3 hover:bg-[#C69B56]/20 hover:border-[#C69B56]/50 transition-colors"
        >
          <MessageCircle size={14} />
          Уточнить наличие
        </button>

        {/* Accordion toggle */}
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full flex items-center justify-between text-[#C69B56] text-[11px] tracking-[0.1em] uppercase py-2 border-t border-white/5 hover:text-[#d4aa65] transition-colors"
        >
          <span>Подробнее</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${
              accordionOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Accordion content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            accordionOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-3 space-y-3">
            {/* Description */}
            {product.description && (
              <p className="text-white/50 text-xs leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Instagram link */}
            {product.instagramUrl && (
              <a
                href={product.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C69B56] text-[11px] tracking-wide hover:text-[#d4aa65] transition-colors"
              >
                <Instagram size={14} />
                Обзор в Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        product={product}
        selectedVolume={selectedVolume}
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}