import Image from "next/image";
import Link from "next/link";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/contacts", label: "Contacts" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/sequences", label: "Sequences" },
  { href: "/warmup", label: "Warm-up" },
  { href: "/send", label: "Send email" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 bg-navy p-4">
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-2">
          <Image src="/logo.svg" alt="Awaj ET" width={30} height={30} priority />
          <span className="font-display text-lg font-semibold text-white">
            Awaj <span className="text-gold">Outreach</span>
          </span>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-mist/70 hover:bg-white/5 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-10 px-3 font-mono text-[10px] tracking-widest text-mist/30">
          SEND IT FURTHER
        </p>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
