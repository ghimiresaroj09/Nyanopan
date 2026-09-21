import Link from "next/link";

const links = [
  { href: "/shipping", label: "Shipping Across Nepal" },
  { href: "/collections/all-slippers", label: "100% Pure Wool Felt" },
  { href: "/our-story", label: "Fair Trade Nepal" },
];

export function AnnouncementBar() {
  return (
    <div className="border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="container-page flex h-8 items-center justify-center gap-4 overflow-x-auto whitespace-nowrap text-[11px] font-medium tracking-wider uppercase">
        {links.map((link, i) => (
          <span key={link.href} className="flex items-center gap-4">
            {i > 0 && (
              <span aria-hidden="true" className="text-primary-foreground/30 text-[10px]">
                ✦
              </span>
            )}
            <Link
              href={link.href}
              className="transition-colors hover:text-white/80"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
