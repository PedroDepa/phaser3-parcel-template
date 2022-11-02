import { DE_DE, EN_US, ES_AR, PT_BR } from "../enums/languages";

const PROJECT_ID = "38";
let translations = null;
let language = ES_AR;

// function adaptTranslations(data) {
//   let adaptees = {};
//   data.words.forEach((w) => {
//     adaptees[w.key] = w.translate;
//   });
//   const json = JSON.stringify(adaptees);
//   console.log(`ADAPTED TRANSLATIONS --- ${json}`);
//   return json;
// }

export async function getTranslations(lang, callback) {
  localStorage.clear();
  translations = null;
  language = lang;
  if (language === ES_AR) {
    return callback ? callback() : false;
}
const res = await fetch(`https://traduci-la-strapi.herokuapp.com/api/translations/${PROJECT_ID}/${language}`)
const data = await res.json()
const devolverDatos = () => {
    localStorage.setItem('translations', JSON.stringify(data));
    translations = data; 
    if(callback) callback()
};
return  devolverDatos()
}

export function getPhrase(key) {
  if (!translations) {
      const locals = localStorage.getItem('translations');
      translations = locals ? JSON.parse(locals) : null;
  }

  let phrase = key;

  if (translations && translations[key]) {
      phrase = translations[key];
  }

  return phrase;
}
function isAllowedLanguge(language) {
  const allowedLanguages = [ES_AR, EN_US, PT_BR, DE_DE];
  return allowedLanguages.includes(language);
}

export function getLanguageConfig() {
  let languageConfig;

  // Obtener desde la URL el idioma
  console.log(window.location.href)

  /* 
    depende como lo manejemos: 
    1) puede venir como www.dominio.com/es-AR
    2) puede venir como www.dominio.com?lang=es-AR

    En el primer caso se obtiene con: window.location.pathname
    En el segundo caso se obtiene leyendo el query param lang 
    
    vamos a implementar una logica que cubra ambos casos
  */

  const path = window.location.pathname !== '/' ? window.location.pathname : null;
  const params = new URL(window.location.href).searchParams;
  const queryLang = params.get('lang');

  languageConfig = path ?? queryLang;

  if (languageConfig) {
      if (isAllowedLanguge(languageConfig)) {
          return languageConfig;
      }
  }

  const browserLanguage = window.navigator.language;
  if (isAllowedLanguge(browserLanguage)) {
      return browserLanguage;
  }

  return ES_AR;
}