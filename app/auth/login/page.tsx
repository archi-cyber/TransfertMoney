"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Connexion réussie !");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#094d2c] via-[#0d6e3f] to-[#15a85e] items-center justify-center p-16">
        <div className="absolute inset-0 noise" />
        <div className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-8">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="font-display text-4xl leading-tight mb-6">
            Vos transferts, en toute confiance
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Connectez-vous pour accéder à votre tableau de bord, envoyer de
            l&apos;argent et suivre vos transactions en temps réel.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
              <p className="text-2xl font-bold">1%</p>
              <p className="text-sm text-white/60">Frais de transfert</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
              <p className="text-2xl font-bold">&lt;24h</p>
              <p className="text-sm text-white/60">Temps de réception</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0d6e3f] to-[#15a85e] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ECO<span className="text-[#0d6e3f]">TRANS</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl tracking-tight mb-2">
            Bon retour parmi nous
          </h1>
          <p className="text-stone-500 mb-8">
            Connectez-vous à votre compte ECOTRANS
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors text-stone-900 placeholder:text-stone-400"
                placeholder="nom@exemple.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-stone-700">
                  Mot de passe
                </label>
                <button type="button" className="text-xs text-[#0d6e3f] font-medium hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors text-stone-900 placeholder:text-stone-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-[#0d6e3f]/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-[#0d6e3f] font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}