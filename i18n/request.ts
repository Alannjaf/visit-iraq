import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Use explicit imports for each locale to avoid dynamic import issues
  let messages;
  switch (locale) {
    case "ar":
      messages = (await import("@/messages/ar.json")).default;
      break;
    case "kurdish":
      messages = (await import("@/messages/kurdish.json")).default;
      break;
    case "en":
    default:
      messages = (await import("@/messages/en.json")).default;
      break;
  }

  return {
    locale,
    messages,
  };
});
