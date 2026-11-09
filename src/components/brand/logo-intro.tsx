import { AnimatedLogo } from "@/components/brand/animated-logo";
import { site } from "@/content/site";

const NAME = site.name.toLowerCase();

/**
 * Once-per-session intro: the "si" monogram is traced by its signal, then the
 * name comes into focus beside it, and the layer fades away (CSS only, see
 * .logo-intro in globals.css). Decorative: hidden from assistive technology,
 * never shown with reduced motion, and the page underneath renders normally.
 *
 * Requires <LogoSessionGate />, which also dismisses it on any interaction.
 */
export function LogoIntro() {
  return (
    <div className="logo-intro" aria-hidden="true">
      <div className="logo-intro-lockup font-mono text-[1.8rem] font-normal text-text [font-stretch:87.5%] sm:text-[2.4rem]">
        <AnimatedLogo className="size-18 text-text sm:size-24" />
        <span className="logo-intro-name whitespace-nowrap">
          {[...NAME].map((character, index) => (
            <span key={index}>{character}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

/**
 * The short version, for every later page of the session: the mark alone,
 * traced in 0.65 s, then the layer fades (0.9 s in all). Restarted on each
 * navigation by <LogoRouteReplay />, on hard loads by <LogoSessionGate />.
 */
export function LogoRouteIntro() {
  return (
    <div className="logo-route" aria-hidden="true">
      <AnimatedLogo className="size-18 text-text sm:size-24" />
    </div>
  );
}
