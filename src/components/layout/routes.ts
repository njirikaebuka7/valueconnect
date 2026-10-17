/** Pages that open with a dark full-bleed hero, so the header starts transparent. */
export function hasDarkHero(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/valuation" ||
    pathname === "/consultation" ||
    pathname === "/track" ||
    pathname.startsWith("/services")
  );
}

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
