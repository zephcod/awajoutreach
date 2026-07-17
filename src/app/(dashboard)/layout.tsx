import Link from "next/link";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/contacts", label: "Contacts" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/sequences", label: "Sequences" },
  { href: "/warmup", label: "Warm-up" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4">
        <div className="mb-6 px-2">
          <span className="text-lg font-bold text-green-700">Awaj</span>
          <span className="text-lg font-light text-gray-500"> Outreach</span>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
