import createMiddleware from 'next-intl/middleware';
import { LocaleConfig } from "@/locale";
export default createMiddleware({
  locales: LocaleConfig.locales.map((locale) => locale.value),
  defaultLocale: LocaleConfig.defaultLocale
});

// this tells the middleware to run only on requests to our app pages
export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)']
};