import _ from 'lodash';
import moment from 'moment-timezone';
import i18n from './locales/en_US';

const defaultLocale = 'en_US';

const supportedLocales = {
  ar_SA: 'ar-sa',
  de_DE: 'de',
  en_CA: 'en-ca',
  en_GB: 'en-gb',
  es_ES: 'es',
  es_BO: 'es',
  fr_CA: 'fr-ca',
  fr_FR: 'fr',
  it_IT: 'it',
  ja_JP: 'ja',
  nl_NL: 'nl',
  ru_RU: 'ru',
  sv_SE: 'sv',
  zh_CN: 'zh-cn',
  zh_TW: 'zh-tw',
};

export const i18nInit = async () => {
  const locale = 'en_US';
  const momentLocale = supportedLocales[locale];

  if (locale !== defaultLocale && !!momentLocale) {
    // const i18nLoaded = await import('i18n-settings/locales/' + locale);
    // _.merge(i18n, i18nLoaded.default);
    //
    // await import('moment/locale/' + momentLocale);
    // moment.locale(momentLocale);
  }
};

export default i18n;
