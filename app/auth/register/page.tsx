"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    country: "CAMEROON" as "CAMEROON" | "CANADA",
  });

  const checks = [
    { label: "8 caractères", ok: form.password.length >= 8 },
    { label: "Majuscule", ok: /[A-Z]/.test(form.password) },
    { label: "Chiffre", ok: /[0-9]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return; }
    if (!checks.every((c) => c.ok)) { toast.error("Le mot de passe ne respecte pas les critères"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password, country: form.country }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("Compte créé !");
      const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (login?.ok) { router.push("/dashboard"); router.refresh(); }
    } catch { toast.error("Erreur lors de la création"); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 14,
    border: "2px solid #f5f5f4", fontSize: 14, fontWeight: 500,
    background: "#fafaf9", transition: "border-color .2s",
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[46%] relative items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0c0a09 0%, #1c1917 50%, #292524 100%)", padding: 64 }}>
        <div className="absolute inset-0 noise" />
        <div className="absolute" style={{ top: 0, right: 0, width: 500, height: 500, background: "radial-gradient(circle, rgba(13,110,63,.12) 0%, transparent 70%)" }} />
        <div className="absolute" style={{ bottom: 0, left: 0, width: 400, height: 400, background: "radial-gradient(circle, rgba(232,168,56,.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 text-white" style={{ maxWidth: 400 }}>
          <div className="flex items-center gap-5" style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 56 }}>🇨🇲</span>
            <div style={{ height: 3, flex: 1, borderRadius: 99, background: "linear-gradient(90deg, #007a33, #ce1126, #fcd116)" }} />
            <span style={{ fontSize: 56 }}>🇨🇦</span>
          </div>

          <h2 className="font-display" style={{ fontSize: 40, lineHeight: 1.15, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Rejoignez la communauté ECOTRANS
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,.5)", marginBottom: 44 }}>
            Créez votre compte gratuitement et commencez à envoyer de l&apos;argent en quelques minutes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Inscription gratuite en 2 minutes", "Frais de 1% seulement", "Transferts sécurisés et traçables", "Support client réactif"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(13,110,63,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check style={{ width: 14, height: 14, color: "#15a85e" }} />
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto" style={{ padding: "40px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: [.22,1,.36,1] }}
          style={{ width: "100%", maxWidth: 460 }}>

          <Link href="/" className="inline-flex items-center gap-2" style={{ marginBottom: 36 }}>
            <div style={{ width: 38, height: 38, borderRadius: 13, background: "linear-gradient(135deg, #094d2c, #15a85e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>ECO<span style={{ color: "#0d6e3f" }}>TRANS</span></span>
          </Link>

          <h1 className="font-display" style={{ fontSize: 32, letterSpacing: "-0.02em", marginBottom: 6 }}>Créer un compte</h1>
          <p style={{ fontSize: 15, color: "#78716c", marginBottom: 32 }}>Remplissez les informations ci-dessous</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Prénom</label>
                <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Jean" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Nom</label>
                <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Dupont" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean@exemple.com" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Téléphone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+237 6XX XXX XXX" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Pays de résidence</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { v: "CAMEROON", flag: "🇨🇲", label: "Cameroun" },
                  { v: "CANADA", flag: "🇨🇦", label: "Canada" },
                ] as const).map((c) => (
                  <button key={c.v} type="button" onClick={() => setForm({ ...form, country: c.v })}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: "pointer",
                      border: `2px solid ${form.country === c.v ? "#0d6e3f" : "#f5f5f4"}`,
                      background: form.country === c.v ? "#ecfdf3" : "#fafaf9",
                      color: form.country === c.v ? "#0d6e3f" : "#57534e",
                      transition: "all .2s",
                    }}>
                    <span style={{ fontSize: 20 }}>{c.flag}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a8a29e" }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-4 flex-wrap" style={{ marginTop: 8 }}>
                  {checks.map((c) => (
                    <span key={c.label} style={{ fontSize: 12, fontWeight: 600, color: c.ok ? "#0d6e3f" : "#a8a29e" }}>
                      {c.ok ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 6 }}>Confirmer le mot de passe</label>
              <input type="password" required value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••" style={inputStyle} />
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ width: "100%", padding: "16px", fontSize: 15, fontWeight: 700, color: "#fff", background: "#0d6e3f", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(13,110,63,.25)" }}>
              {loading ? <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" /> : <><span>Créer mon compte</span><ArrowRight style={{ width: 16, height: 16 }} /></>}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: 24, fontSize: 14, color: "#78716c" }}>
            Déjà un compte ?{" "}
            <Link href="/auth/login" style={{ color: "#0d6e3f", fontWeight: 700 }} className="hover:underline">Se connecter</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}