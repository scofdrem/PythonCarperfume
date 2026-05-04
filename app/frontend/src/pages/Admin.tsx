import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { products, brands, categories, type Product } from "@/data/products";
import {
  useSiteContent,
  setSiteContent,
  type SiteContent,
  type AboutCard,
} from "@/data/siteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Tab =
  | "products"
  | "hero"
  | "headings"
  | "about"
  | "footer"
  | "brands"
  | "categories";

/* ─── Image Upload Helper ─── */
function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onChange(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-white/40 text-xs mb-1">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border border-dashed cursor-pointer transition-colors overflow-hidden ${
          dragOver
            ? "border-[#C69B56] bg-[#C69B56]/5"
            : "border-white/20 hover:border-white/40"
        } ${value ? "h-40" : "h-24 flex items-center justify-center"}`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/70 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/30">
            <Upload size={20} />
            <span className="text-[10px]">Нажмите или перетащите файл</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {/* Fallback URL input */}
      <div className="mt-1">
        <input
          value={value && !value.startsWith("data:") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Или вставьте URL изображения"
          className="w-full bg-black border border-white/10 text-white text-xs px-3 py-1.5 focus:border-[#C69B56] outline-none placeholder:text-white/20"
        />
      </div>
    </div>
  );
}

/* ─── Field Helper ─── */
function Field({
  label,
  value,
  onChange,
  type = "text",
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-white/40 text-xs mb-1">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none resize-none placeholder:text-white/20"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none placeholder:text-white/20"
        />
      )}
    </div>
  );
}

/* ─── Main Admin Component ─── */
export default function Admin() {
  const siteContent = useSiteContent();
  const [activeTab, setActiveTab] = useState<Tab>("products");

  // Products state
  const [productList, setProductList] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("niche");
  const [formGender, setFormGender] = useState<"women" | "men" | "unisex">(
    "unisex"
  );
  const [formAgeRange, setFormAgeRange] = useState<
    "18-25" | "25-35" | "35-45" | "45+"
  >("25-35");
  const [formVolumes, setFormVolumes] = useState("2, 5, 10, 20, 30");
  const [formPriceMin, setFormPriceMin] = useState("10");
  const [formPriceMax, setFormPriceMax] = useState("500");
  const [formImage, setFormImage] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formNew, setFormNew] = useState(false);

  // Site content draft state
  const [draft, setDraft] = useState<SiteContent>({ ...siteContent });
  const [saved, setSaved] = useState(false);

  const updateDraft = (updater: (prev: SiteContent) => SiteContent) => {
    setDraft((prev) => updater(prev));
    setSaved(false);
  };

  const saveContent = () => {
    setSiteContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetDraft = () => {
    setDraft({ ...siteContent });
    setSaved(false);
  };

  // Product form helpers
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
    const volumes = formVolumes
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => v > 0);
    const priceRange: [number, number] = [
      Number(formPriceMin) || 0,
      Number(formPriceMax) || 0,
    ];

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
          image:
            formImage ||
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
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

  // About card helpers
  const updateAboutCard = (
    index: number,
    field: keyof AboutCard,
    value: string
  ) => {
    updateDraft((prev) => {
      const cards = [...prev.about.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, about: { ...prev.about, cards } };
    });
  };

  const addAboutCard = () => {
    updateDraft((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        cards: [
          ...prev.about.cards,
          { icon: "✨", title: "Новый блок", desc: "Описание блока" },
        ],
      },
    }));
  };

  const removeAboutCard = (index: number) => {
    updateDraft((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        cards: prev.about.cards.filter((_, i) => i !== index),
      },
    }));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: "Продукты" },
    { key: "hero", label: "Герой-баннер" },
    { key: "headings", label: "Заголовки" },
    { key: "about", label: "О нас" },
    { key: "footer", label: "Подвал" },
    { key: "brands", label: "Бренды" },
    { key: "categories", label: "Категории" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-8">
          <Link
            to="/"
            className="hover:text-[#C69B56] transition-colors"
          >
            Главная
          </Link>
          <span>/</span>
          <span className="text-white/70">Админ-панель</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-light tracking-[0.1em] uppercase mb-8">
          Админ-панель
        </h1>
        <div className="w-16 h-px bg-[#C69B56] mb-8" />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-[#C69B56] border-b-2 border-[#C69B56]"
                  : "text-white/40 hover:text-white/70 border-b-2 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* PRODUCTS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/50 text-sm">
                {productList.length} продуктов
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-4 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
              >
                + Добавить продукт
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-[#1A1A1A] border border-white/10 p-6 mb-6">
                <h3 className="text-[#C69B56] text-sm tracking-[0.1em] uppercase mb-4">
                  {editingProduct
                    ? "Редактировать продукт"
                    : "Новый продукт"}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Field
                    label="Название *"
                    value={formName}
                    onChange={setFormName}
                  />
                  <Field
                    label="Бренд *"
                    value={formBrand}
                    onChange={setFormBrand}
                  />
                  <div>
                    <label className="block text-white/40 text-xs mb-1">
                      Категория
                    </label>
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
                    <label className="block text-white/40 text-xs mb-1">
                      Пол
                    </label>
                    <select
                      value={formGender}
                      onChange={(e) =>
                        setFormGender(
                          e.target.value as "women" | "men" | "unisex"
                        )
                      }
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    >
                      <option value="women">Женский</option>
                      <option value="men">Мужской</option>
                      <option value="unisex">Унисекс</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs mb-1">
                      Возраст
                    </label>
                    <select
                      value={formAgeRange}
                      onChange={(e) =>
                        setFormAgeRange(
                          e.target.value as
                            | "18-25"
                            | "25-35"
                            | "35-45"
                            | "45+"
                        )
                      }
                      className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:border-[#C69B56] outline-none"
                    >
                      <option value="18-25">18–25</option>
                      <option value="25-35">25–35</option>
                      <option value="35-45">35–45</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>
                  <Field
                    label="Объёмы (через запятую)"
                    value={formVolumes}
                    onChange={setFormVolumes}
                  />
                  <Field
                    label="Цена от (BYN)"
                    value={formPriceMin}
                    onChange={setFormPriceMin}
                    type="number"
                  />
                  <Field
                    label="Цена до (BYN)"
                    value={formPriceMax}
                    onChange={setFormPriceMax}
                    type="number"
                  />
                  <ImageUpload
                    label="Изображение"
                    value={formImage}
                    onChange={setFormImage}
                  />
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
                    <tr
                      key={p.id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="py-3 px-2 text-white/30">{p.id}</td>
                      <td className="py-3 px-2 text-white/80">{p.name}</td>
                      <td className="py-3 px-2 text-white/50">{p.brand}</td>
                      <td className="py-3 px-2 text-white/50">
                        {p.category}
                      </td>
                      <td className="py-3 px-2 text-white/50">
                        {p.priceRange[0]}–{p.priceRange[1]} BYN
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          {p.isFeatured && (
                            <span className="text-[10px] bg-[#C69B56]/20 text-[#C69B56] px-2 py-0.5">
                              Хит
                            </span>
                          )}
                          {p.isNew && (
                            <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5">
                              Новинка
                            </span>
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

        {/* ═══════════════════════════════════════════ */}
        {/* HERO BANNER TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "hero" && (
          <div>
            <h3 className="text-[#C69B56] text-sm tracking-[0.1em] uppercase mb-6">
              Редактирование героя-баннера
            </h3>

            <div className="bg-[#1A1A1A] border border-white/10 p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <ImageUpload
                  label="Фоновое изображение"
                  value={draft.hero.backgroundImage}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, backgroundImage: v },
                    }))
                  }
                />
                <Field
                  label="Подзаголовок"
                  value={draft.hero.subtitle}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: v },
                    }))
                  }
                />
                <Field
                  label="Заголовок — строка 1"
                  value={draft.hero.headingLine1}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, headingLine1: v },
                    }))
                  }
                />
                <Field
                  label="Заголовок — строка 2 (выделенная)"
                  value={draft.hero.headingLine2}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, headingLine2: v },
                    }))
                  }
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Описание"
                    value={draft.hero.description}
                    onChange={(v) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, description: v },
                      }))
                    }
                    rows={3}
                  />
                </div>
                <Field
                  label="Текст кнопки"
                  value={draft.hero.buttonText}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, buttonText: v },
                    }))
                  }
                />
                <Field
                  label="Ссылка кнопки"
                  value={draft.hero.buttonLink}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, buttonLink: v },
                    }))
                  }
                />
              </div>

              {/* Preview */}
              <div className="mt-6 border border-white/5 overflow-hidden">
                <p className="text-white/30 text-[10px] uppercase tracking-wider px-4 py-2 bg-black/50">
                  Предпросмотр
                </p>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={draft.hero.backgroundImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
                  <div className="absolute inset-0 flex items-center px-6">
                    <div>
                      <p className="text-[#C69B56] text-[10px] tracking-[0.2em] uppercase mb-1">
                        {draft.hero.subtitle}
                      </p>
                      <p className="text-white text-lg font-light">
                        {draft.hero.headingLine1}{" "}
                        <span className="text-[#C69B56]">
                          {draft.hero.headingLine2}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveContent}
                  className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-5 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={resetDraft}
                  className="border border-white/20 text-white/50 text-xs tracking-[0.1em] uppercase px-5 py-2 hover:text-white/80 hover:border-white/40 transition-colors"
                >
                  Сбросить
                </button>
                {saved && (
                  <span className="text-green-400 text-xs self-center">
                    ✓ Сохранено
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* SECTION HEADINGS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "headings" && (
          <div>
            <h3 className="text-[#C69B56] text-sm tracking-[0.1em] uppercase mb-6">
              Редактирование заголовков секций
            </h3>

            <div className="bg-[#1A1A1A] border border-white/10 p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field
                  label="Заголовок «Категории»"
                  value={draft.sectionHeadings.categories}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      sectionHeadings: {
                        ...prev.sectionHeadings,
                        categories: v,
                      },
                    }))
                  }
                />
                <Field
                  label="Заголовок «Хиты продаж»"
                  value={draft.sectionHeadings.featured}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      sectionHeadings: {
                        ...prev.sectionHeadings,
                        featured: v,
                      },
                    }))
                  }
                />
                <Field
                  label="Заголовок «Новинки»"
                  value={draft.sectionHeadings.newArrivals}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      sectionHeadings: {
                        ...prev.sectionHeadings,
                        newArrivals: v,
                      },
                    }))
                  }
                />
                <Field
                  label="Заголовок «О нас»"
                  value={draft.sectionHeadings.about}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      sectionHeadings: { ...prev.sectionHeadings, about: v },
                    }))
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveContent}
                  className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-5 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={resetDraft}
                  className="border border-white/20 text-white/50 text-xs tracking-[0.1em] uppercase px-5 py-2 hover:text-white/80 hover:border-white/40 transition-colors"
                >
                  Сбросить
                </button>
                {saved && (
                  <span className="text-green-400 text-xs self-center">
                    ✓ Сохранено
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ABOUT US TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "about" && (
          <div>
            <h3 className="text-[#C69B56] text-sm tracking-[0.1em] uppercase mb-6">
              Редактирование секции «О нас»
            </h3>

            {/* Info Cards */}
            <div className="bg-[#1A1A1A] border border-white/10 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white/70 text-xs tracking-[0.1em] uppercase">
                  Карточки преимуществ
                </h4>
                <button
                  onClick={addAboutCard}
                  className="text-[#C69B56] text-xs tracking-wide hover:text-[#d4aa65] transition-colors"
                >
                  + Добавить карточку
                </button>
              </div>

              <div className="space-y-4">
                {draft.about.cards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-black border border-white/5 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/30 text-[10px] uppercase tracking-wider">
                        Карточка {i + 1}
                      </span>
                      <button
                        onClick={() => removeAboutCard(i)}
                        className="text-white/30 hover:text-red-400 text-xs transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <Field
                        label="Иконка (эмодзи)"
                        value={card.icon}
                        onChange={(v) => updateAboutCard(i, "icon", v)}
                      />
                      <Field
                        label="Заголовок"
                        value={card.title}
                        onChange={(v) => updateAboutCard(i, "title", v)}
                      />
                      <Field
                        label="Описание"
                        value={card.desc}
                        onChange={(v) => updateAboutCard(i, "desc", v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Details */}
            <div className="bg-[#1A1A1A] border border-white/10 p-6">
              <h4 className="text-white/70 text-xs tracking-[0.1em] uppercase mb-4">
                Описание и контакты
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Название"
                  value={draft.about.title}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      about: { ...prev.about, title: v },
                    }))
                  }
                />
                <div />
                <div className="sm:col-span-2">
                  <Field
                    label="Описание — абзац 1"
                    value={draft.about.description1}
                    onChange={(v) =>
                      updateDraft((prev) => ({
                        ...prev,
                        about: { ...prev.about, description1: v },
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Описание — абзац 2"
                    value={draft.about.description2}
                    onChange={(v) =>
                      updateDraft((prev) => ({
                        ...prev,
                        about: { ...prev.about, description2: v },
                      }))
                    }
                    rows={3}
                  />
                </div>
                <Field
                  label="Локация"
                  value={draft.about.location}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      about: { ...prev.about, location: v },
                    }))
                  }
                />
                <Field
                  label="Телефон"
                  value={draft.about.phone}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      about: { ...prev.about, phone: v },
                    }))
                  }
                />
                <Field
                  label="Email"
                  value={draft.about.email}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      about: { ...prev.about, email: v },
                    }))
                  }
                />
                <Field
                  label="Часы работы"
                  value={draft.about.workingHours}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      about: { ...prev.about, workingHours: v },
                    }))
                  }
                />
                <div className="sm:col-span-2">
                  <Field
                    label="URL карты"
                    value={draft.about.mapUrl}
                    onChange={(v) =>
                      updateDraft((prev) => ({
                        ...prev,
                        about: { ...prev.about, mapUrl: v },
                      }))
                    }
                    placeholder="https://www.openstreetmap.org/..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveContent}
                  className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-5 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={resetDraft}
                  className="border border-white/20 text-white/50 text-xs tracking-[0.1em] uppercase px-5 py-2 hover:text-white/80 hover:border-white/40 transition-colors"
                >
                  Сбросить
                </button>
                {saved && (
                  <span className="text-green-400 text-xs self-center">
                    ✓ Сохранено
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* FOOTER TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "footer" && (
          <div>
            <h3 className="text-[#C69B56] text-sm tracking-[0.1em] uppercase mb-6">
              Редактирование подвала
            </h3>

            <div className="bg-[#1A1A1A] border border-white/10 p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field
                    label="Описание бренда"
                    value={draft.footer.brandDescription}
                    onChange={(v) =>
                      updateDraft((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, brandDescription: v },
                      }))
                    }
                    rows={2}
                  />
                </div>
                <Field
                  label="Telegram"
                  value={draft.footer.telegram}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, telegram: v },
                    }))
                  }
                  placeholder="@username"
                />
                <Field
                  label="Viber"
                  value={draft.footer.viber}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, viber: v },
                    }))
                  }
                  placeholder="+375 (XX) XXX-XX-XX"
                />
                <Field
                  label="Instagram"
                  value={draft.footer.instagram}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, instagram: v },
                    }))
                  }
                  placeholder="@username"
                />
                <Field
                  label="Email"
                  value={draft.footer.email}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, email: v },
                    }))
                  }
                />
                <Field
                  label="Телефон"
                  value={draft.footer.phone}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, phone: v },
                    }))
                  }
                />
                <Field
                  label="Копирайт"
                  value={draft.footer.copyright}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, copyright: v },
                    }))
                  }
                />
                <Field
                  label="Текст «Политика конфиденциальности»"
                  value={draft.footer.privacyPolicyText}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, privacyPolicyText: v },
                    }))
                  }
                />
                <Field
                  label="Текст «Оферта»"
                  value={draft.footer.offerText}
                  onChange={(v) =>
                    updateDraft((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, offerText: v },
                    }))
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveContent}
                  className="bg-[#C69B56] text-black text-xs tracking-[0.1em] uppercase px-5 py-2 font-medium hover:bg-[#d4aa65] transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={resetDraft}
                  className="border border-white/20 text-white/50 text-xs tracking-[0.1em] uppercase px-5 py-2 hover:text-white/80 hover:border-white/40 transition-colors"
                >
                  Сбросить
                </button>
                {saved && (
                  <span className="text-green-400 text-xs self-center">
                    ✓ Сохранено
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* BRANDS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "brands" && (
          <div>
            <p className="text-white/50 text-sm mb-6">
              {brands.length} брендов
            </p>
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

        {/* ═══════════════════════════════════════════ */}
        {/* CATEGORIES TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "categories" && (
          <div>
            <p className="text-white/50 text-sm mb-6">
              {categories.length} категорий
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="flex items-center justify-between py-3 px-4 bg-[#1A1A1A] border border-white/5"
                >
                  <div>
                    <span className="text-white/70 text-sm">{cat.name}</span>
                    <span className="text-white/30 text-xs ml-2">
                      ({cat.slug})
                    </span>
                  </div>
                  <span className="text-[#C69B56]/60 text-xs">
                    {cat.count.toLocaleString("ru-RU")} ароматов
                  </span>
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