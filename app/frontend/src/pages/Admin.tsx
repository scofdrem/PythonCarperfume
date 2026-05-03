import { useState } from "react";
import { Link } from "react-router-dom";
import { products, brands, categories, type Product } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Tab = "products" | "brands" | "categories";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [productList, setProductList] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for add/edit
  const [formName, setFormName] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("niche");
  const [formGender, setFormGender] = useState<"women" | "men" | "unisex">("unisex");
  const [formAgeRange, setFormAgeRange] = useState<"18-25" | "25-35" | "35-45" | "45+">("25-35");
  const [formVolumes, setFormVolumes] = useState("2, 5, 10, 20, 30");
  const [formPriceMin, setFormPriceMin] = useState("10");
  const [formPriceMax, setFormPriceMax] = useState("500");
  const [formImage, setFormImage] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formNew, setFormNew] = useState(false);

  const resetForm = () => {
    setFormName("");
    setFormBrand("");
    setFormCategory("niche");
    setFormGender("unisex");
    setFormAgeRange("25-35");
    setFormVolumes("2, 5, 10, 20, 30");
    setFormPriceMin("10");
    setFormPriceMax("500");
    setFormImage("");
    setFormFeatured(false);
    setFormNew(false);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormGender(p.gender);
    setFormAgeRange(p.ageRange);
    setFormVolumes(p.volumes.join(", "));
    setFormPriceMin(String(p.priceRange[0]));
    setFormPriceMax(String(p.priceRange[1]));
    setFormImage(p.image);
    setFormFeatured(!!p.isFeatured);
    setFormNew(!!p.isNew);
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formBrand.trim()) return;
    const volumes = formVolumes.split(",").map((v) => Number(v.trim())).filter((v) => v > 0);
    const priceRange: [number, number] = [Number(formPriceMin) || 0, Number(formPriceMax) || 0];

    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formName,
                brand: formBrand,
                category: formCategory,
                gender: formGender,
                ageRange: formAgeRange,
                volumes,
                priceRange,
                image: formImage || p.image,
                isFeatured: formFeatured || undefined,
                isNew: formNew || undefined,
              }
            : p
        )
      );
    } else {
      const newId = Math.max(...productList.map((p) => p.id), 0) + 1;
      setProductList((prev) => [
        ...prev,
        {
          id: newId,
          name: formName,
          brand: formBrand,
          category: formCategory,
          gender: formGender,
          ageRange: formAgeRange,
          volumes,
          priceRange,
          image: formImage || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
          isFeatured: formFeatured || undefined,
          isNew: formNew || undefined,
        },
      ]);
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: "Продукты" },
    { key: "brands", label: "Бренды" },
    { key: "categories", label: "Категории" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-8">
          <Link to="/" className="hover:text-[#C69B56] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-white/70">Админ-панель</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-light tracking-[0.1em] uppercase mb-8">
          Админ-панель
        </h1>
        <div className="w-16 h-px bg-[#C69B56] mb-8" />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); resetForm(); }}
              className={`px-5 py-3 text-xs tracking-[0.1em] uppercase transition-colors ${
                activeTab === tab.key
                  ? "text-[#C69B56] border-b-2 border-[#C69B56]"
                  : "text-white/40 hover:text-white/70 border-b-2 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/50 text-sm">{productList.length} продуктов</p>
              <button
                onClick={() => { resetForm(); setShowAddForm(true); }}
                className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-4 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
              >
                + Добавить продукт
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-[#1A1A1A] border border-white/10 p-6 mb-6">
                <h3 className="text-[#C69B56] text-sm tracking-[0.1em] uppercase mb-4">
                  {editingProduct ? "Редактировать продукт" : "Новый продукт"}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Название *</label>
                    <input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Бренд *</label>
                    <input
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Категория</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    >
                      <option value="niche">Нишевая</option>
                      <option value="luxury">Люксовая</option>
                      <option value="women">Женская</option>
                      <option value="men">Мужская</option>
                      <option value="unisex">Унисекс</option>
                      <option value="decants">Отливанты</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Пол</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as "women" | "men" | "unisex")}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    >
                      <option value="women">Женский</option>
                      <option value="men">Мужской</option>
                      <option value="unisex">Унисекс</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Возраст</label>
                    <select
                      value={formAgeRange}
                      onChange={(e) => setFormAgeRange(e.target.value as "18-25" | "25-35" | "35-45" | "45+")}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    >
                      <option value="18-25">18–25</option>
                      <option value="25-35">25–35</option>
                      <option value="35-45">35–45</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Объёмы (через запятую)</label>
                    <input
                      value={formVolumes}
                      onChange={(e) => setFormVolumes(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Цена от (BYN)</label>
                    <input
                      type="number"
                      value={formPriceMin}
                      onChange={(e) => setFormPriceMin(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">Цена до (BYN)</label>
                    <input
                      type="number"
                      value={formPriceMax}
                      onChange={(e) => setFormPriceMax(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">URL изображения</label>
                    <input
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="accent-[#C69B56]"
                      />
                      <span className="text-white/50 text-xs">Хит продаж</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formNew}
                        onChange={(e) => setFormNew(e.target.checked)}
                        className="accent-[#C69B56]"
                      />
                      <span className="text-white/50 text-xs">Новинка</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-5 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
                  >
                    {editingProduct ? "Сохранить" : "Добавить"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="border border-white/20 text-white/50 text-xs tracking-[0.1em] uppercase px-5 py-2 hover:text-white/80 hover:border-white/40 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs tracking-wide uppercase">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Название</th>
                    <th className="text-left py-3 px-2">Бренд</th>
                    <th className="text-left py-3 px-2">Категория</th>
                    <th className="text-left py-3 px-2">Цена</th>
                    <th className="text-left py-3 px-2">Теги</th>
                    <th className="text-right py-3 px-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 text-white/30">{p.id}</td>
                      <td className="py-3 px-2 text-white/80">{p.name}</td>
                      <td className="py-3 px-2 text-white/50">{p.brand}</td>
                      <td className="py-3 px-2 text-white/50">{p.category}</td>
                      <td className="py-3 px-2 text-white/50">
                        {p.priceRange[0]}–{p.priceRange[1]} BYN
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          {p.isFeatured && (
                            <span className="text-[10px] bg-[#C69B56]/20 text-[#C69B56] px-2 py-0.5">Хит</span>
                          )}
                          {p.isNew && (
                            <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5">Новинка</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-white/40 hover:text-[#C69B56] text-xs mr-3 transition-colors"
                        >
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-white/40 hover:text-red-400 text-xs transition-colors"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === "brands" && (
          <div>
            <p className="text-white/50 text-sm mb-6">{brands.length} брендов</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {brands.map((brand) => (
                <div
                  key={brand.slug}
                  className="flex items-center justify-between py-3 px-4 bg-[#1A1A1A] border border-white/5"
                >
                  <span className="text-white/70 text-sm">{brand.name}</span>
                  <span className="text-white/30 text-xs">{brand.slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <p className="text-white/50 text-sm mb-6">{categories.length} категорий</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="flex items-center justify-between py-3 px-4 bg-[#1A1A1A] border border-white/5"
                >
                  <div>
                    <span className="text-white/70 text-sm">{cat.name}</span>
                    <span className="text-white/30 text-xs ml-2">({cat.slug})</span>
                  </div>
                  <span className="text-[#C69B56]/60 text-xs">{cat.count.toLocaleString("ru-RU")} ароматов</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}