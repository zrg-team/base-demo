import { initReactI18next } from 'react-i18next';
import i18next, { LanguageDetectorAsyncModule } from 'i18next';
import * as resources from '@i18n/languages';
const defaultLanguage = 'en';
interface DetectCallback {
  (message: string): void;
}
const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback: DetectCallback) => callback(defaultLanguage),
  init: () => {},
  cacheUserLanguage: () => {},
};
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: defaultLanguage,
    resources: resources.default,
    debug: __DEV__ === true,
    interpolation: {
      escapeValue: false,
    },
  });
export const I18n = i18next;
