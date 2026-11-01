import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createDomTranslator, translateText } from './translate';
import { trackEvent } from '../lib/analytics';

/**
 * Idioma de la interfaz: español (el del sitio y el que se prerenderiza) o inglés, como modo secundario.
 *
 * - Arranca siempre en 'es', igual en el prerender y en el primer render del cliente: la hidratación no
 *   cambia y Google indexa el español. La preferencia guardada (o ?lang=en) se aplica DESPUÉS de montar.
 *   No se detecta el idioma del navegador a propósito: Googlebot renderiza con navigator.language en-US
 *   y terminaría indexando el sitio en inglés.
 * - El diccionario (en.js, ~45 kB) es un chunk aparte que solo se descarga al pasar a inglés.
 * - La traducción del DOM espera a que la página lazy termine de hidratar (`markReady`, que llama
 *   Layout desde dentro del <Suspense>); si tocara los textos antes, React vería HTML distinto al que
 *   renderizó y descartaría el prerender (errores #418/#423).
 * - Fuera del Provider (prerender) el contexto por defecto devuelve español sin hacer nada.
 */
const STORAGE_KEY = 'kappa-lang';

const LangContext = createContext({
  lang: 'es', isEn: false, t: (s) => s, setLang: () => {}, toggle: () => {}, markReady: () => {},
});

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('es');
  const [dict, setDict] = useState(null);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  // Idioma pedido (URL o preferencia guardada). No se aplica al montar sino cuando la página ya hidrató:
  // cambiar el contexto antes hace que React re-renderice un <Suspense> sin hidratar (error #421) y tire el prerender.
  const wanted = useRef(null);
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      wanted.current = fromUrl === 'en' || fromUrl === 'es' ? fromUrl : localStorage.getItem(STORAGE_KEY);
      // El diccionario se baja ya, en paralelo con la hidratación, para que el cambio sea inmediato.
      if (wanted.current === 'en') import('./en').then((m) => setDict(m.default));
    } catch { /* storage bloqueado: se queda en español */ }
  }, []);
  useEffect(() => {
    if (ready && wanted.current === 'en') setLangState('en');
    if (ready) wanted.current = null;
  }, [ready]);

  useEffect(() => {
    if (lang !== 'en' || dict) return;
    import('./en').then((m) => setDict(m.default));
  }, [lang, dict]);

  // El español vuelve al lang original del HTML (es-AR), no a un 'es' genérico.
  const htmlLang = useRef(null);
  useEffect(() => {
    htmlLang.current ??= document.documentElement.lang || 'es-AR';
    document.documentElement.lang = lang === 'en' ? 'en' : htmlLang.current;
  }, [lang]);

  const active = lang === 'en' && !!dict && ready;
  useEffect(() => {
    if (!active) return undefined;
    const translator = createDomTranslator(dict);
    translator.start();
    return () => translator.stop();
  }, [active, dict]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* noop */ }
    trackEvent('language_change', { language: next });
  }, []);

  // Mientras se esté en español, el diccionario que se baja en segundo plano no debe cambiar el contexto
  // (re-renderizaría consumidores que todavía no hidrataron).
  const activeDict = lang === 'en' ? dict : null;
  const t = useCallback((s) => (activeDict ? translateText(s, activeDict) ?? s : s), [activeDict]);

  const value = useMemo(() => ({
    lang, isEn: lang === 'en', t, setLang, markReady,
    toggle: () => setLang(lang === 'en' ? 'es' : 'en'),
  }), [lang, t, setLang, markReady]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
