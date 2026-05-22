export interface SiteContent {
  header: {
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
  };
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
    logo: string;
    banners: Array<{
      title: string;
      image: string;
      link: string;
    }>;
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
    privacyPolicyPdf: string;
    offerPdf: string;
  };
}

export const defaultSiteContent: SiteContent = {
  header: {
    favicon: "",
    tabTitle: "SCENTED CO. — Автомобильный парфюм",
    brandLine1: "SCENTED CO.",
    brandLine2: "АВТОМОБИЛЬНЫЙ ПАРФЮМ",
    navLinks: {
      catalogue: true,
      brands: true,
      about: true,
      admin: true,
    },
  },
  hero: {
    backgroundImage: "hero-bg.jpg",
    subtitle: "SCENTED CO.",
    headingLine1: "Автомобильный парфюм",
    headingLine2: "Премиум класса",
    description: "Премиум ароматы для вашего автомобиля",
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
    logo: "/logo.jpg",
    banners: [
      { title: "Премиум качество", image: "banner1.jpg", link: "/catalogue" },
      { title: "Долговечность", image: "banner2.jpg", link: "/catalogue" },
      { title: "Уникальный аромат", image: "banner3.jpg", link: "/catalogue" },
    ],
    title: "О нас",
    description1: "Мы предлагаем автомобильные ароматизаторы премиум-класса.",
    description2: "Наши ароматы созданы профессиональными парфюмерами и отличаются высокой стойкостью.",
    location: "г. Минск",
    phone: "+375 (29) 123-45-67",
    email: "info@scented.co",
    workingHours: "Пн-Пт: 9:00-18:00",
    mapUrl: "",
  },
  footer: {
    brandDescription: "Автомобильные ароматизаторы премиум-класса",
    telegram: "@scentedco",
    viber: "+375 (29) 123-45-67",
    instagram: "@scentedco",
    email: "info@scented.co",
    phone: "+375 (29) 123-45-67",
    copyright: "© 2024 SCENTED CO. Все права защищены.",
    privacyPolicyText: "Политика конфиденциальности",
    offerText: "Оферта",
    privacyPolicyPdf: "",
    offerPdf: "",
  },
};

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

/**
 * Deep-merge a partial section with its defaults.
 * Handles nested objects (like about.banners) and arrays.
 */
function deepMergeSection<T extends Record<string, any>>(section: Partial<T> | undefined, defaults: T): T {
  if (!section) return defaults;
  const result: Record<string, any> = { ...defaults };
  for (const key of Object.keys(section)) {
    const incoming = (section as Record<string, any>)[key];
    const def = (defaults as Record<string, any>)[key];
    if (incoming === undefined || incoming === null) continue;
    // If both are plain objects, recurse
    if (
      typeof incoming === "object" &&
      !Array.isArray(incoming) &&
      incoming.constructor === Object &&
      def !== undefined &&
      typeof def === "object" &&
      !Array.isArray(def) &&
      def.constructor === Object
    ) {
      result[key] = deepMergeSection(incoming, def);
    } else {
      result[key] = incoming;
    }
  }
  return result as T;
}

/** Migrate old about.cards to about.banners if needed */
function migrateContent(data: Partial<SiteContent>): SiteContent {
  // Deep-merge each section with its defaults
  const header = deepMergeSection(data.header, defaultSiteContent.header);
  const hero = deepMergeSection(data.hero, defaultSiteContent.hero);
  const sectionHeadings = deepMergeSection(data.sectionHeadings, defaultSiteContent.sectionHeadings);

  // about needs special handling: convert old cards → banners + deep merge
  const aboutDefaults = { ...defaultSiteContent.about };
  const incomingAbout: Record<string, any> = data.about || {};
  if (incomingAbout.cards && !incomingAbout.banners) {
    incomingAbout.banners = incomingAbout.cards.map((card: any) => ({
      title: card.title || "",
      link: "/catalogue",
      image: "",
    }));
    delete (incomingAbout as any).cards;
  }
  const about = deepMergeSection(incomingAbout, aboutDefaults);

  const footer = deepMergeSection(data.footer, defaultSiteContent.footer);

  return {
    header,
    hero,
    sectionHeadings,
    about,
    footer,
  };
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

/**
 * React hook to subscribe to site content changes.
 * Returns the current site content and a setter function.
 */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(currentContent);

  useEffect(() => {
    const handleChange = () => setContent(currentContent);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return content;
}

/** Persist site content to backend and update local store */
export async function persistSiteContent(content: SiteContent): Promise<boolean> {
  const success = await saveToBackend(content);
  if (success) {
    setSiteContent(content);
  }
  return success;
}