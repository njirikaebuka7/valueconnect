/**
 * Brand intro shown once per browser session on the home page. Pure CSS so it
 * plays before hydration; the head script in the root layout marks
 * <html class="intro-done"> on later visits (and for reduced motion) to skip it.
 */
export function Intro() {
  return (
    <div aria-hidden className="intro-overlay">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-mark-white.svg" alt="" width={2151} height={1795} className="intro-mark" />
      <p className="intro-word font-brand">
        VALUECONNECT <span className="text-aqua-400">CONSULTING</span>
      </p>
      <span className="intro-line" />
    </div>
  );
}
