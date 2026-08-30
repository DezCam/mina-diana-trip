const links = [
  { href: "#overview", label: "Overview" },
  { href: "#scotland", label: "Scotland" },
  { href: "#amsterdam", label: "Amsterdam" },
  { href: "#details", label: "Trip Details" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-highland/10 bg-parchment/92 backdrop-blur-md print:hidden">
      <div className="mx-auto max-w-6xl overflow-x-auto px-3 sm:px-8 lg:px-10">
        <ul className="flex min-h-14 items-center justify-between gap-1 whitespace-nowrap">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-10 items-center rounded-full px-2 text-[0.82rem] font-semibold text-highland transition hover:bg-highland/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tulip sm:px-3 sm:text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
