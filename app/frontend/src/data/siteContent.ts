// Centralized editable site content — Admin panel modifies these values
// Components read from here to reflect admin changes

export interface AboutCard {
  icon: string;
  title: string;
  desc: string;
}

export interface SiteContent {
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
    cards: AboutCard[];
    title: string;
    description1: string;
    description2: string;
    location: string;
    phone: string;
    email: string;
    workingHours: string;
    mapUrl: string;
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
  };
}

export const defaultSiteContent: SiteContent = {
  hero: {
    backgroundImage:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80",
    subtitle: "ПАРФЮМ НА РАСПИВ",
    headingLine1: "Мир элитных",
    headingLine2: "ароматов",
    description:
      "Откройте для себя коллекцию нишевых и люксовых парфюмов в формате отливантов. Попробуйте легендарные ароматы от 2 мл.",
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
    cards: [
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
    ],
    title: "1000 Ароматов",
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
  currentContent = { ...content };
  listeners.forEach((fn) => fn());
}

/** Load site content from backend into the reactive store (call once on app init) */
export async function initSiteContentFromBackend(): Promise<void> {
  if (backendLoaded) return;
  try {
    const data = await fetchSiteContent();
    if (data) {
      currentContent = { ...data };
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
  const [content, setContent] = useState<SiteContent>(currentContent);
  useEffect(() => {
    const handler = () => setContent({ ...currentContent });
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);
  return content;
}