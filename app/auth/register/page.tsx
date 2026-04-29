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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "CAMEROON" as "CAMEROON" | "CANADA",
  });

  const passwordChecks = [
    { label: "8 caractères min.", valid: form.password.length >= 8 },
    { label: "Une majuscule", valid: /[A-Z]/.test(form.password) },
    { label: "Un chiffre", valid: /[0-9]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!passwordChecks.every((c) => c.valid)) {
      toast.error("Le mot de passe ne respecte pas les critères");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          country: form.country,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Compte créé ! Connexion en cours...");

      const loginRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 items-center justify-center p-16">
        <div className="absolute inset-0 noise" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0d6e3f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e8a838]/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-5xl">🇨🇲</span>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-[#007a33] via-[#ce1126] to-[#fcd116] rounded-full" />
            <span className="text-5xl">🇨🇦</span>
          </div>
          <h2 className="font-display text-4xl leading-tight mb-6">
            Rejoignez la communauté ECOTRANS
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Créez votre compte gratuitement et commencez à envoyer de l&apos;argent
            en quelques minutes.
          </p>
          <div className="space-y-4">
            {[
              "Inscription gratuite en 2 minutes",
              "Frais de 1% seulement",
              "Transferts sécurisés et traçables",
              "Support client réactif",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0d6e3f]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#15a85e]" />
                </div>
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
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
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0d6e3f] to-[#15a85e] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ECO<span className="text-[#0d6e3f]">TRANS</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl tracking-tight mb-2">
            Créer un compte
          </h1>
          <p className="text-stone-500 mb-8">
            Remplissez les informations ci-dessous pour commencer
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Prénom</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400"
                placeholder="jean@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400"
                placeholder="+237 6XX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Pays de résidence</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "CAMEROON", flag: "🇨🇲", label: "Cameroun" },
                  { value: "CANADA", flag: "🇨🇦", label: "Canada" },
                ].map((country) => (
                  <button
                    key={country.value}
                    type="button"
                    onClick={() => setForm({ ...form, country: country.value as "CAMEROON" | "CANADA" })}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                      form.country === country.value
                        ? "border-[#0d6e3f] bg-emerald-50 text-[#0d6e3f]"
                        : "border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    {country.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-3 mt-2 flex-wrap">
                  {passwordChecks.map((check) => (
                    <span
                      key={check.label}
                      className={`text-xs font-medium ${check.valid ? "text-[#0d6e3f]" : "text-stone-400"}`}
                    >
                      {check.valid ? "✓" : "○"} {check.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-[#0d6e3f]/20 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-[#0d6e3f] font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}