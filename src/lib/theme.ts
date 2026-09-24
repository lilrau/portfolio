export const INTRO_STORAGE_KEY = "intro-seen";

// Decides before first paint whether the intro plays: once per session, never
// with reduced motion. No JS → no attribute → the
// preloader stays hidden (see globals.css). Also drops a stored theme choice
// so an earlier dark preference cannot stick around.
export const introInitScript = `(function(){var d=document.documentElement;try{localStorage.removeItem("theme");d.removeAttribute("data-theme")}catch(e){}try{var skip=sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches;d.setAttribute("data-intro",skip?"skip":"pending")}catch(e){d.setAttribute("data-intro","skip")}})();`;
