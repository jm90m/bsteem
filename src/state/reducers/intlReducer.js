import _ from 'lodash';
import enUS from 'locales/en-US.json';
import arSA from 'locales/ar-SA.json';
import asIN from 'locales/as-IN.json';
import bgBG from 'locales/bg-BG.json';
import bnIN from 'locales/bn-IN.json';
import caES from 'locales/ca-ES.json';
import csCZ from 'locales/cs-CZ.json';
import daDK from 'locales/da-DK.json';
import deDE from 'locales/de-DE.json';
import elGR from 'locales/el-GR.json';
import esES from 'locales/es-ES.json';
import etEE from 'locales/et-EE.json';
import filPH from 'locales/fil-PH.json';
import frFR from 'locales/fr-FR.json';
import heIL from 'locales/he-IL.json';
import hiIN from 'locales/hi-IN.json';
import hrHR from 'locales/hr-HR.json';
import huHU from 'locales/hu-HU.json';
import idID from 'locales/id-ID.json';
import itIT from 'locales/it-IT.json';
import jaJP from 'locales/ja-JP.json';
import koKR from 'locales/ko-KR.json';
import loLA from 'locales/lo-LA.json';
import msMY from 'locales/ms-MY.json';
import neNP from 'locales/ne-NP.json';
import nlNL from 'locales/nl-NL.json';
import noNO from 'locales/no-NO.json';
import plPL from 'locales/pl-PL.json';
import ptBR from 'locales/pt-BR.json';
import roRO from 'locales/ro-RO.json';
import ruRU from 'locales/ru-RU.json';
import slSI from 'locales/sl-SI.json';
import svSE from 'locales/sv-SE.json';
import taIN from 'locales/ta-IN.json';
import thTH from 'locales/th-TH.json';
import trTR from 'locales/tr-TR.json';
import ukUA from 'locales/uk-UA.json';
import viVN from 'locales/vi-VN.json';
import yoNG from 'locales/yo-NG.json';
import zhCN from 'locales/zh-CN.json';
import zhTW from 'locales/zh-TW.json';

import { UPDATE_USER_LANGUAGE, SET_LANGUAGE_SETTING } from 'state/actions/actionTypes';

export const LANGUAGE_CHOICES = {
  en_US: 'English',
  id_ID: 'Bahasa Indonesia - Indonesian',
  ms_MY: 'Bahasa Melayu - Malay',
  ca_ES: 'Català - Catalan',
  cs_CZ: 'Čeština - Czech',
  da_DK: 'Dansk - Danish',
  de_DE: 'Deutsch - German',
  et_EE: 'Eesti - Estonian',
  es_ES: 'Español - Spanish',
  fil_PH: 'Filipino',
  fr_FR: 'Français - French',
  hr_HR: 'Hrvatski - Croatian',
  it_IT: 'Italiano - Italian',
  hu_HU: 'Magyar - Hungarian',
  nl_NL: 'Nederlands - Dutch',
  no_NO: 'Norsk - Norwegian',
  pl_PL: 'Polski - Polish',
  pt_BR: 'Português - Portuguese',
  ro_RO: 'Română - Romanian',
  sl_SI: 'Slovenščina - Slovenian',
  sv_SE: 'Svenska - Swedish',
  vi_VN: 'Tiếng Việt - Vietnamese',
  tr_TR: 'Türkçe - Turkish',
  yo_NG: 'Yorùbá - Yoruba',
  el_GR: 'Ελληνικά - Greek',
  bg_BG: 'Български език - Bulgarian',
  ru_RU: 'Русский - Russian',
  uk_UA: 'Українська мова - Ukrainian',
  he_IL: 'עִבְרִית - Hebrew',
  ar_SA: 'العربية - Arabic‏',
  ne_NP: 'नेपाली - Nepali',
  hi_IN: 'हिन्दी - Hindi',
  as_IN: 'অসমীয়া - Assamese',
  bn_IN: 'বাংলা - Bengali',
  ta_IN: 'தமிழ் - Tamil',
  lo_LA: 'ພາສາລາວ - Lao',
  th_TH: 'ภาษาไทย - Thai',
  ko_KR: '한국어 - Korean',
  ja_JP: '日本語 - Japanese',
  zh_CN: '简体中文 - Simplified Chinese',
  zh_TW: '繁體中文 - Traditional Chinese',
};

const translations = {
  en_US: enUS,
  id_ID: idID,
  ms_MY: msMY,
  ca_ES: caES,
  cs_CZ: csCZ,
  da_DK: daDK,
  de_DE: deDE,
  et_EE: etEE,
  es_ES: esES,
  fil_PH: filPH,
  fr_FR: frFR,
  hr_HR: hrHR,
  it_IT: itIT,
  hu_HU: huHU,
  nl_NL: nlNL,
  no_NO: noNO,
  pl_PL: plPL,
  pt_BR: ptBR,
  ro_RO: roRO,
  sl_SI: slSI,
  sv_SE: svSE,
  vi_VN: viVN,
  tr_TR: trTR,
  yo_NG: yoNG,
  el_GR: elGR,
  bg_BG: bgBG,
  ru_RU: ruRU,
  uk_UA: ukUA,
  he_IL: heIL,
  ar_SA: arSA,
  ne_NP: neNP,
  hi_IN: hiIN,
  as_IN: asIN,
  bn_IN: bnIN,
  ta_IN: taIN,
  lo_LA: loLA,
  th_TH: thTH,
  ko_KR: koKR,
  ja_JP: jaJP,
  zh_CN: zhCN,
  zh_TW: zhTW,
};

const INITIAL_STATE = enUS;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_USER_LANGUAGE.SUCCESS: {
      const newTranslations = _.get(translations, action.payload, enUS);
      return {
        ...state,
        ...newTranslations,
      };
    }
    case SET_LANGUAGE_SETTING: {
      const { languageSetting } = action.payload;
      const newTranslations = _.get(translations, languageSetting, enUS);
      return {
        ...state,
        ...newTranslations,
      };
    }
    default:
      return state;
  }
};
