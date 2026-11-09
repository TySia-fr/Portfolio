/**
 * Lets the logo intro play once per browser session, and lets visitors skip it.
 *
 * Runs synchronously while the HTML is parsed, before anything is painted:
 * - first load of a session: records the visit, and dismisses the intro on the
 *   first click, key, scroll or touch (by setting data-logo-played);
 * - any later load: sets <html data-logo-played> at once, so the CSS never
 *   shows the full intro, and data-logo-route, which plays the short trace
 *   (<LogoRouteIntro />; client-side navigations replay it via LogoRouteReplay).
 * No React state is involved, so server and client render the same markup and
 * there is nothing to hydrate differently.
 *
 * If sessionStorage is unavailable (blocked cookies, some private modes) the
 * intro plays on each load, still skippable: a harmless fallback.
 *
 * CSP: inline scripts are allowed by ADR-0006 (script-src 'unsafe-inline').
 */
const KEY = "logo-played";
const script = `(function(){var d=document.documentElement,a="data-logo-played";try{if(sessionStorage.getItem("${KEY}")){d.setAttribute(a,"");d.setAttribute("data-logo-route","");return}sessionStorage.setItem("${KEY}","1")}catch(e){}var t=["pointerdown","keydown","wheel","touchstart"],o={capture:true,passive:true};function s(){d.setAttribute(a,"");t.forEach(function(n){removeEventListener(n,s,o)})}t.forEach(function(n){addEventListener(n,s,o)});setTimeout(s,3600)})()`;

export function LogoSessionGate() {
  // A Server Component in the root layout: rendered once on the server, then
  // only hydrated (the root layout never re-renders on navigation), so React
  // never inserts or re-runs this script on the client.
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
