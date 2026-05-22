// Centralized editable site content — Admin panel modifies these values
// Components read from here to reflect admin changes

export interface Banner {
  title: string;
  link: string;
  image: string;
}

export interface HeaderSettings {
  favicon: string;
  tabTitle: string;
  brandLine1: string;
  brandLine2: string;
  navLinks: {
    catalogue: boolean;
    brands: boolean;
    about: boolean;
    admin: boolean;
  };
}

export interface SiteContent {
  header: HeaderSettings;
  hero: {
    backgroundImage: string;
    subtitle: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  sectionHeadings: {
    categories: string;
    featured: string;
    newArrivals: string;
    about: string;
  };
  about: {
    banners: Banner[];
    title: string;
    description1: string;
    description2: string;
    location: string;
    phone: string;
    email: string;
    workingHours: string;
    mapUrl: string;
    logo?: string;
  };
  footer: {
    brandDescription: string;
    telegram: string;
    viber: string;
    instagram: string;
    email: string;
    phone: string;
    copyright: string;
    privacyPolicyText: string;
    offerText: string;
    privacyPolicyPdf: string;
    offerPdf: string;
  };
}

export const defaultSiteContent: SiteContent = {
  header: {
    favicon: "",
    tabTitle: "Foetida Magna — Изысканный Автопарфюм",
    brandLine1: "FOETIDA MAGNA",
    brandLine2: "ИЗЫСКАННЫЙ АВТОПАРФЮМ",
    navLinks: {
      catalogue: true,
      brands: true,
      about: true,
      admin: true,
    },
  },
  hero: {
    backgroundImage:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80",
    subtitle: "ИЗЫСКАННЫЙ АВТОПАРФЮМ",
    headingLine1: "Мир элитных",
    headingLine2: "ароматов",
    description:
      "Откройте для себя коллекцию нишевых и люксовых парфюмов в формате отливантов. Попробуйте популярные ароматы от 2 мл.",
    buttonText: "Смотреть каталог",
    buttonLink: "/catalogue",
  },
  sectionHeadings: {
    categories: "Категории",
    featured: "Хиты продаж",
    newArrivals: "Новинки",
    about: "О нас",
  },
  about: {
    banners: [
      {
        title: "Оригинальная продукция",
        link: "/catalogue",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
      },
      {
        title: "Безопасная упаковка",
        link: "/catalogue",
        image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
      },
    ],
    title: "Foetida Magna",
    description1:
      "Мы — магазин парфюмерии на распив, который предлагает вам возможность познакомиться с элитными ароматами без необходимости покупать полный флакон. Каждый отливант разливается из оригинального флакона в стерильные условия с соблюдением всех стандартов качества.",
    description2:
      "В нашем каталоге более 950 ароматов от ведущих мировых брендов: нишевая, люксовая и селективная парфюмерия. Мы гарантируем подлинность каждого флакона и бережную доставку по всей Беларуси.",
    location: "Минск, Беларусь",
    phone: "+375 (29) 123-45-67",
    email: "info@1000aromatov.by",
    workingHours: "Пн–Пт: 10:00–20:00, Сб: 11:00–18:00",
    mapUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=27.4%2C53.85%2C27.7%2C53.97&layer=mapnik",
    logo: "/logo.jpg",
  },
  footer: {
    brandDescription:
      "Интернет-магазин отливантов элитной парфюмерии. Оригинальные ароматы от 2 мл с доставкой по всей Беларуси.",
    telegram: "@1000aromatov",
    viber: "+375 (29) 123-45-67",
    instagram: "@1000aromatov",
    email: "info@1000aromatov.by",
    phone: "+375 (29) 123-45-67",
    copyright: "© 2026 1000 АРОМАТОВ. Все права защищены.",
    privacyPolicyText: "Политика конфиденциальности",
    offerText: "Оферта",
    privacyPolicyPdf: "",
    offerPdf: "",
  },
};

// Reactive store — components subscribe via useSiteContent hook
import { useState, useEffect } from "react";
import { fetchSiteContent, saveSiteContent as saveToBackend } from "@/api/dataService";

let currentContent: SiteContent = { ...defaultSiteContent };
const listeners: Set<() => void> = new Set();
let backendLoaded = false;

export function getSiteContent(): SiteContent {
  return currentContent;
}

export function setSiteContent(content: SiteContent) {
  currentContent = JSON.parse(JSON.stringify(content));
  listeners.forEach((fn) => fn());
}

/** Migrate old about.cards to about.banners if needed */
function migrateContent(data: Record<string, any>): SiteContent {
  // Ensure header section exists with defaults
  if (!data.header) {
    data.header = defaultSiteContent.header;
  } else {
    // Merge missing fields from defaults
    data.header = { ...defaultSiteContent.header, ...data.header };
    if (!data.header.navLinks) {
      data.header.navLinks = defaultSiteContent.header.navLinks;
    } else {
      data.header.navLinks = { ...defaultSiteContent.header.navLinks, ...data.header.navLinks };
    }
  }
  const about = data.about || {};
  // If banners missing but cards exist, convert cards → banners
  if (!about.banners && about.cards) {
    about.banners = about.cards.map((card: any) => ({
      title: card.title || "",
      link: "/catalogue",
      image: "",
    }));
    delete about.cards;
  }
  if (!about.banners) {
    about.banners = defaultSiteContent.about.banners;
  }
  // Ensure logo field exists
  if (!about.logo) {
    about.logo = defaultSiteContent.about.logo;
  }
  data.about = about;
  // Ensure all top-level keys exist
  return { ...defaultSiteContent, ...data };
}

/** Load site content from backend into the reactive store (call once on app init) */
export async function initSiteContentFromBackend(): Promise<void> {
  if (backendLoaded) return;
  try {
    const data = await fetchSiteContent();
    if (data) {
      currentContent = migrateContent(data);
      listeners.forEach((fn) => fn());
    }
  } catch {
    // Fall back to defaults
  }
  backendLoaded = true;
}

/** Save site content to both the reactive store and the backend database */
export async function persistSiteContent(content: SiteContent): Promise<boolean> {
  setSiteContent(content);
  try {
    return await saveToBackend(content);
  } catch {
    return false;
  }
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(() => JSON.parse(JSON.stringify(currentContent)));
  useEffect(() => {
    const handler = () => setContent(JSON.parse(JSON.stringify(currentContent)));
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);
  return content;
}