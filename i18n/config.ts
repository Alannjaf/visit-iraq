export const locales = ['en', 'kurdish', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  kurdish: 'کوردی',
  ar: 'العربية',
};

