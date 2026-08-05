import { makeVar, useReactiveVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

import { Language, TranslationKey, translations } from './translations';

/**
 * Plural entries are stored as `key_one` / `key_other`; callers pass the base
 * `key` plus a count. This derives those base keys so they typecheck too — a
 * mistyped key is still a compile error, but `t('pool.available', {count})`
 * works without declaring the base separately.
 */
type PluralBase<K> = K extends `${infer B}_one` ? B : never;
export type TKey = TranslationKey | PluralBase<TranslationKey>;

export type { Language, TranslationKey };
export const LANGUAGES: Language[] = ['en', 'es'];
export const LANGUAGE_LABEL: Record<Language, string> = {
  en: 'English',
  es: 'Español',
};
/** Two-letter chip for the switcher. */
export const LANGUAGE_SHORT: Record<Language, string> = { en: 'EN', es: 'ES' };

/**
 * Shown alongside the code, never instead of it — flag glyphs don't render on
 * every Android build, and a driver stuck in the wrong language needs the
 * switcher to stay readable.
 */
export const LANGUAGE_FLAG: Record<Language, string> = { en: '🇺🇸', es: '🇪🇸' };

const STORAGE_KEY = 'gw_driver_language';

/**
 * The device's language, without pulling in expo-localization — that's a native
 * module and would force a rebuild for what amounts to reading one string.
 */
const deviceLanguage = (): Language => {
  try {
    const raw =
      Platform.OS === 'ios'
        ? (NativeModules.SettingsManager?.settings?.AppleLocale ??
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0])
        : NativeModules.I18nManager?.localeIdentifier;

    return String(raw ?? '').toLowerCase().startsWith('es') ? 'es' : 'en';
  } catch {
    return 'en';
  }
};

export const languageVar = makeVar<Language>(deviceLanguage());

/** Restore the driver's explicit choice, if they ever made one. */
(async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.includes(stored as Language)) {
      languageVar(stored as Language);
    }
  } catch {
    /* device locale stands */
  }
})();

export const setLanguage = async (language: Language) => {
  languageVar(language);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, language);
  } catch {
    /* the choice still applies for this session */
  }
};

/**
 * Adopt the language on the driver's own record — but never over an explicit
 * in-app choice, which is why this checks storage first.
 */
export const applyDriverLanguagePreference = async (
  preferenceLanguage?: string[] | null
) => {
  const preferred = preferenceLanguage?.[0]?.toLowerCase();
  if (!preferred || !LANGUAGES.includes(preferred as Language)) return;

  try {
    if (await AsyncStorage.getItem(STORAGE_KEY)) return;
  } catch {
    /* fall through and apply the preference */
  }
  languageVar(preferred as Language);
};

type Vars = Record<string, string | number>;

const interpolate = (template: string, vars?: Vars) =>
  vars
    ? template.replace(/\{\{(\w+)\}\}/g, (_, k) =>
        vars[k] === undefined ? `{{${k}}}` : String(vars[k])
      )
    : template;

/**
 * Translate a key. Pluralisation is the `_one` / `_other` suffix convention —
 * pass `count` and the right variant is picked automatically.
 */
export const translate = (
  key: TKey,
  vars?: Vars,
  language: Language = languageVar()
): string => {
  const dict = translations[language] ?? translations.en;
  const base = key as TranslationKey;

  if (vars?.count !== undefined) {
    const suffix = Number(vars.count) === 1 ? '_one' : '_other';
    const plural = `${key}${suffix}` as TranslationKey;
    const found = dict[plural] ?? translations.en[plural];
    if (found) return interpolate(found, vars);
  }

  // Fall back to English rather than rendering a raw key at a driver.
  return interpolate(dict[base] ?? translations.en[base] ?? key, vars);
};

/** Re-renders on language change, so the whole UI switches without a reload. */
export const useTranslation = () => {
  const language = useReactiveVar(languageVar);
  return {
    language,
    setLanguage,
    t: (key: TKey, vars?: Vars) => translate(key, vars, language),
  };
};
