
import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { translations } from '../i18n/translations';

export const useI18n = () => {
  const { language } = useAppContext();

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let result: any = translations[language];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          return key;
        }
      }
      return result as string;
    },
    [language]
  );

  return { t, language };
};
