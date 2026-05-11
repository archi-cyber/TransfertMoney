"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Eye, EyeOff, ArrowRight, Loader2, Shield, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (res?.error) { toast.error(res.error); }
      else { toast.success("Connexion réussie !"); router.push("/dashboard"); router.refresh(); }
    } catch { toast.error("Erreur de connexion"); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "16px 18px", borderRadius: 16,
    border: "2px solid #f5f5f4", fontSize: 15, fontWeight: 500,
    background: "#fafaf9", transition: "border-color .2s",
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
        style={{ background: "linear-gradient(160deg, #052e1a 0%, #0d6e3f 40%, #15a85e 100%)", padding: 64 }}>
        <div className="absolute inset-0 noise" />
        {/* Decorative circles */}
        <div className="absolute" style={{ top: "10%", right: "10%", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,.08)" }} />
        <div className="absolute" style={{ bottom: "15%", left: "8%", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,.05)" }} />
        <div className="absolute" style={{ top: "40%", left: "20%", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />

        <div className="relative z-10 text-white" style={{ maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: 22, background: "rgba(255,255,255,.1)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
            <Globe style={{ width: 32, height: 32 }} />
          </div>

          <h2 className="font-display" style={{ fontSize: 42, lineHeight: 1.15, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Vos transferts,<br />en toute confiance
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,.6)", marginBottom: 48 }}>
            Connectez-vous pour accéder à votre tableau de bord, envoyer de l&apos;argent et suivre vos transactions.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, value: "1%", label: "Frais de transfert" },
              { icon: Clock, value: "<24h", label: "Temps de réception" },
            ].map((s) => (
              <div key={s.label} style={{ padding: 24, borderRadius: 20, background: "rgba(255,255,255,.06)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.08)" }}>
                <s.icon style={{ width: 20, height: 20, marginBottom: 12, opacity: .6 }} />
                <p style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center" style={{ padding: "40px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: [.22,1,.36,1] }}
          style={{ width: "100%", maxWidth: 440 }}>

          <Link href="/" className="inline-flex items-center gap-2" style={{ marginBottom: 48, display: "inline-flex" }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg, #094d2c, #15a85e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>ECO<span style={{ color: "#0d6e3f" }}>TRANS</span></span>
          </Link>

          <h1 className="font-display" style={{ fontSize: 36, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Bon retour parmi nous
          </h1>
          <p style={{ fontSize: 16, color: "#78716c", marginBottom: 40 }}>
            Connectez-vous à votre compte ECOTRANS
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#44403c", marginBottom: 8 }}>Adresse email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nom@exemple.com" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#44403c" }}>Mot de passe</label>
                <button type="button" style={{ fontSize: 12, fontWeight: 600, color: "#0d6e3f", background: "none", border: "none", cursor: "pointer" }}>Mot de passe oublié ?</button>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 52 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a8a29e" }}>
                  {showPw ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ width: "100%", padding: "18px", fontSize: 16, fontWeight: 700, color: "#fff", background: "#0d6e3f", borderRadius: 16, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(13,110,63,.25)" }}>
              {loading ? <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" /> : <><span>Se connecter</span><ArrowRight style={{ width: 18, height: 18 }} /></>}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: 32, fontSize: 14, color: "#78716c" }}>
            Pas encore de compte ?{" "}
            <Link href="/auth/register" style={{ color: "#0d6e3f", fontWeight: 700 }} className="hover:underline">Créer un compte</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}