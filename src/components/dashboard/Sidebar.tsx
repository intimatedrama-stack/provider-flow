"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  BookImage,
  BarChart2,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/inbox", label: "Screening Inbox", icon: Inbox },
  { href: "/dashboard/crm", label: "Client CRM", icon: Users },
  { href: "/dashboard/ads", label: "Ad Library", icon: BookImage },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/logger", label: "Post Logger", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const tick = () => setTime(format(new Date(), "MMM dd, yyyy • hh:mm a"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const signOut = async () => {
    setSigningOut(true);
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
    setSigningOut(false);
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 border-r flex flex-col z-50"
      style={{ backgroundColor: "#0a0a0a", borderColor: "#1e1e1e" }}
    >
      <div className="px-6 py-6" style={{ borderBottom: "1px solid #1e1e1e" }}>
        <span className="text-gold font-display text-lg tracking-widest">◆ PROVIDER FLOW</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                active
                  ? "border-l-2 border-gold text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={active ? { backgroundColor: "#1a1a1a" } : {}}
            >
              <Icon size={16} className={active ? "text-gold" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 space-y-3" style={{ borderTop: "1px solid #1e1e1e" }}>
        <p className="text-xs text-muted-foreground">{time}</p>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
