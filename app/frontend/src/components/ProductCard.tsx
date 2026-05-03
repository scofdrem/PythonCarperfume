import { useState } from "react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVolume, setSelectedVolume] = useState(
    product.volumes[Math.min(2, product.volumes.length - 1)]
  );

  const getPriceForVolume = (vol: number): number => {
    const minVol = product.volumes[0];
    const maxVol = product.volumes[product.volumes.length - 1];
    const [minPrice, maxPrice] = product.priceRange;
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
        <div className="flex items-center">
          <span className="text-white text-base font-light">
            {price.toLocaleString("ru-RU")} BYN
          </span>
        </div>
      </div>
    </div>
  );
}