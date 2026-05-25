"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Globe, LayoutDashboard, Send, Clock, User,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/send", label: "Envoyer", icon: Send },
  { href: "/dashboard/history", label: "Historique", icon: Clock },
  { href: "/dashboard/profile", label: "Profil", icon: User },
];

export default function DashboardShell({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = session?.user;

  return (
    <div className="min-h-screen bg-stone-50 flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:w-72 flex-col bg-white fixed inset-y-0"
        style={{ borderRight: "1px solid #e7e5e4" }}>
        <div style={{ padding: 24, borderBottom: "1px solid #f5f5f4" }}>
          <Link href="/" className="flex items-center gap-2">
            <div style={{ width: 38, height: 38, borderRadius: 13, background: "linear-gradient(135deg, #094d2c, #15a85e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>ECO<span style={{ color: "#0d6e3f" }}>TRANS</span></span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 transition-all"
                style={{
                  padding: "12px 16px", borderRadius: 14, fontSize: 14, fontWeight: 500,
                  background: active ? "#0d6e3f" : "transparent",
                  color: active ? "#fff" : "#57534e",
                  boxShadow: active ? "0 4px 16px rgba(13,110,63,.2)" : "none",
                }}>
                <item.icon style={{ width: 20, height: 20 }} />
                {item.label}
                {active && <ChevronRight style={{ width: 16, height: 16, marginLeft: "auto" }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 16, borderTop: "1px solid #f5f5f4" }}>
          <div className="flex items-center gap-3" style={{ padding: "12px 16px", marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ecfdf3", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d6e3f", fontWeight: 700, fontSize: 14 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: 12, color: "#78716c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 transition-all w-full"
            style={{ padding: "12px 16px", borderRadius: 14, fontSize: 14, fontWeight: 500, color: "#78716c", background: "none", border: "none", cursor: "pointer" }}>
            <LogOut style={{ width: 20, height: 20 }} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ height: 64, padding: "0 16px", background: "#fff", borderBottom: "1px solid #e7e5e4" }}>
        <Link href="/" className="flex items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #094d2c, #15a85e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>ECO<span style={{ color: "#0d6e3f" }}>TRANS</span></span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: 8, borderRadius: 12, background: "none", border: "none", cursor: "pointer" }}>
          {sidebarOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.4)" }} onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0" style={{ width: 280, background: "#fff", paddingTop: 80, padding: "80px 16px 16px" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3"
                    style={{ padding: "12px 16px", borderRadius: 14, fontSize: 14, fontWeight: 500, background: active ? "#0d6e3f" : "transparent", color: active ? "#fff" : "#57534e" }}>
                    <item.icon style={{ width: 20, height: 20 }} /> {item.label}
                  </Link>
                );
              })}
            </nav>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full"
              style={{ marginTop: 32, padding: "12px 16px", borderRadius: 14, fontSize: 14, fontWeight: 500, color: "#ef4444", background: "none", border: "none", cursor: "pointer", borderTop: "1px solid #f5f5f4", paddingTop: 24 }}>
              <LogOut style={{ width: 20, height: 20 }} /> Déconnexion
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-72" style={{ paddingTop: 64 }}>
        <div style={{ padding: "24px", maxWidth: 1200 }} className="lg:pt-0 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}