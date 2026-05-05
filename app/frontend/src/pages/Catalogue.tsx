import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, categories, ageRanges } from "@/data/products";
import { useDynamicBrands } from "@/data/brandsStore";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type SortOption = "popular" | "price-asc" | "price-desc" | "name";

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const { brands } = useDynamicBrands();

  const selectedCategory = searchParams.get("category") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const selectedAgeRange = searchParams.get("age") || "";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand) {
      result = result.filter(
        (p) => p.brand.toLowerCase().replace(/\s+/g, "-") === selectedBrand
      );
    }

    if (selectedAgeRange) {
      result = result.filter((p) => p.ageRange === selectedAgeRange);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.priceRange[0] - b.priceRange[0]);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceRange[0] - a.priceRange[0]);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [search, selectedCategory, selectedBrand, selectedAgeRange, sort]);

  const hasFilters = search || selectedCategory || selectedBrand || selectedAgeRange;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-[0.1em] uppercase">
              Каталог
            </h1>
            <div className="w-16 h-px bg-[#C69B56] mt-4" />
          </div>

          {/* Search & controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2 bg-[#1A1A1A] border border-white/10 px-4 py-3">
              <Search size={16} className="text-[#C69B56]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию или бренду..."
                className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/30"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={14} className="text-white/30 hover:text-white" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-3 border text-xs tracking-wide uppercase transition-colors ${
                  filtersOpen
                    ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                    : "border-white/10 text-white/50 hover:border-white/30"
                }`}
              >
                <SlidersHorizontal size={14} />
                Фильтры
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-[#1A1A1A] border border-white/10 text-white/60 text-xs px-4 py-3 outline-none cursor-pointer"
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">Цена ↑</option>
                <option value="price-desc">Цена ↓</option>
                <option value="name">По названию</option>
              </select>
            </div>
          </div>

          {/* Filters panel */}
          {filtersOpen && (
            <div className="bg-[#1A1A1A] border border-white/5 p-6 mb-8">
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Category filter */}
                <div>
                  <h3 className="text-[#C69B56] text-xs tracking-[0.1em] uppercase mb-3 font-medium">
                    Категория
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter("category", "")}
                      className={`px-3 py-1.5 text-[11px] border transition-colors ${
                        !selectedCategory
                          ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                          : "border-white/10 text-white/40 hover:border-white/30"
                      }`}
                    >
                      Все
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setFilter("category", cat.slug)}
                        className={`px-3 py-1.5 text-[11px] border transition-colors ${
                          selectedCategory === cat.slug
                            ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                            : "border-white/10 text-white/40 hover:border-white/30"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand filter — searchable */}
                <div>
                  <h3 className="text-[#C69B56] text-xs tracking-[0.1em] uppercase mb-3 font-medium">
                    Бренд
                  </h3>
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-black border border-white/10 px-3 py-2 mb-2">
                      <Search size={12} className="text-white/30" />
                      <input
                        type="text"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        placeholder="Поиск бренда..."
                        className="bg-transparent text-white text-xs outline-none w-full placeholder:text-white/20"
                      />
                      {brandSearch && (
                        <button onClick={() => setBrandSearch("")}>
                          <X size={10} className="text-white/30 hover:text-white" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      <button
                        onClick={() => { setFilter("brand", ""); setBrandSearch(""); }}
                        className={`px-3 py-1.5 text-[11px] border transition-colors ${
                          !selectedBrand
                            ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                            : "border-white/10 text-white/40 hover:border-white/30"
                        }`}
                      >
                        Все
                      </button>
                      {brands
                        .filter((b) => !brandSearch || b.name.toLowerCase().includes(brandSearch.toLowerCase()))
                        .map((brand) => (
                          <button
                            key={brand.slug}
                            onClick={() => { setFilter("brand", brand.slug); setBrandSearch(""); }}
                            className={`px-3 py-1.5 text-[11px] border transition-colors ${
                              selectedBrand === brand.slug
                                ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                                : "border-white/10 text-white/40 hover:border-white/30"
                            }`}
                          >
                            {brand.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Age range filter */}
                <div>
                  <h3 className="text-[#C69B56] text-xs tracking-[0.1em] uppercase mb-3 font-medium">
                    Возраст
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter("age", "")}
                      className={`px-3 py-1.5 text-[11px] border transition-colors ${
                        !selectedAgeRange
                          ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                          : "border-white/10 text-white/40 hover:border-white/30"
                      }`}
                    >
                      Все
                    </button>
                    {ageRanges.map((ar) => (
                      <button
                        key={ar.value}
                        onClick={() => setFilter("age", ar.value)}
                        className={`px-3 py-1.5 text-[11px] border transition-colors ${
                          selectedAgeRange === ar.value
                            ? "border-[#C69B56] text-[#C69B56] bg-[#C69B56]/10"
                            : "border-white/10 text-white/40 hover:border-white/30"
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#C69B56] text-xs tracking-wide hover:text-[#d4aa65] transition-colors"
                >
                  Сбросить все фильтры
                </button>
              )}
            </div>
          )}

          {/* Active filters */}
          {hasFilters && !filtersOpen && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-white/30 text-xs">Активные фильтры:</span>
              {selectedCategory && (
                <span className="flex items-center gap-1 bg-[#C69B56]/10 border border-[#C69B56]/30 text-[#C69B56] text-[11px] px-2 py-1">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setFilter("category", "")}>
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="flex items-center gap-1 bg-[#C69B56]/10 border border-[#C69B56]/30 text-[#C69B56] text-[11px] px-2 py-1">
                  {brands.find((b) => b.slug === selectedBrand)?.name || selectedBrand}
                  <button onClick={() => setFilter("brand", "")}>
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedAgeRange && (
                <span className="flex items-center gap-1 bg-[#C69B56]/10 border border-[#C69B56]/30 text-[#C69B56] text-[11px] px-2 py-1">
                  {ageRanges.find((a) => a.value === selectedAgeRange)?.label || selectedAgeRange}
                  <button onClick={() => setFilter("age", "")}>
                    <X size={10} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-white/30 text-[11px] hover:text-white/50 transition-colors"
              >
                Сбросить
              </button>
            </div>
          )}

          {/* Results count */}
          <p className="text-white/30 text-xs mb-6">
            Найдено: {filtered.length} {filtered.length === 1 ? "аромат" : "ароматов"}
          </p>

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/30 text-sm">
                По вашему запросу ничего не найдено
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#C69B56] text-xs tracking-wide hover:text-[#d4aa65] transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}