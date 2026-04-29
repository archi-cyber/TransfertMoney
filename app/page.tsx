"use client";

import { useState } from "react";
import Link from "next/link";
import { motion,Variants} from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  ChevronDown,
  Send,
  Clock,
  Users,
  Star,
  Menu,
  X,
} from "lucide-react";
import {
  formatCurrency,
  EXCHANGE_RATES,
  calculateFees,
  calculateReceived,
} from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState<"CAD" | "XAF">("CAD");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toCurrency = fromCurrency === "CAD" ? "XAF" : "CAD";
  const fees = calculateFees(amount);
  const received = calculateReceived(amount, fromCurrency, toCurrency);

  return (
    <div className="min-h-screen">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0d6e3f] to-[#15a85e] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ECO<span className="text-[#0d6e3f]">TRANS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#features" className="hover:text-[#0d6e3f] transition-colors">
              Fonctionnalités
            </a>
            <a href="#calculator" className="hover:text-[#0d6e3f] transition-colors">
              Simulateur
            </a>
            <a href="#how-it-works" className="hover:text-[#0d6e3f] transition-colors">
              Comment ça marche
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 text-sm font-semibold text-stone-700 hover:text-[#0d6e3f] transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] rounded-xl transition-all shadow-lg shadow-[#0d6e3f]/20 hover:shadow-[#0d6e3f]/40"
            >
              Créer un compte
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-stone-200 bg-white px-6 pb-6"
          >
            <div className="flex flex-col gap-4 pt-4">
              <a href="#features" className="text-stone-600 font-medium">Fonctionnalités</a>
              <a href="#calculator" className="text-stone-600 font-medium">Simulateur</a>
              <a href="#how-it-works" className="text-stone-600 font-medium">Comment ça marche</a>
              <hr className="border-stone-200" />
              <Link href="/auth/login" className="text-stone-700 font-semibold">Connexion</Link>
              <Link href="/auth/register" className="px-5 py-3 text-center font-semibold text-white bg-[#0d6e3f] rounded-xl">
                Créer un compte
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#0d6e3f]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#e8a838]/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-[#fcd116]/8 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d6e3f]/5 border border-[#0d6e3f]/10 text-[#0d6e3f] text-sm font-medium mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[#0d6e3f] pulse-green" />
              Seulement 1% de frais de transfert
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl md:text-7xl leading-[1.1] tracking-tight text-stone-900 mb-6"
            >
              Transférez votre argent{" "}
              <span className="text-[#0d6e3f]">simplement</span>{" "}
              entre deux pays
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-stone-500 leading-relaxed mb-10 max-w-xl"
            >
              Envoyez de l&apos;argent du Canada vers le Cameroun et vice-versa.
              Rapide, sécurisé, avec les meilleurs taux du marché.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] rounded-2xl transition-all shadow-xl shadow-[#0d6e3f]/25 hover:shadow-[#0d6e3f]/40 hover:-translate-y-0.5"
              >
                Commencer maintenant
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-stone-700 bg-white hover:bg-stone-100 rounded-2xl border border-stone-200 transition-all"
              >
                Simuler un envoi
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-16 flex flex-wrap items-center gap-8 text-sm text-stone-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Chiffrement SSL 256-bit</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>+2 000 utilisateurs actifs</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>4.9/5 satisfaction client</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">
              Pourquoi choisir{" "}
              <span className="text-[#0d6e3f]">ECOTRANS</span> ?
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              Une plateforme construite pour la diaspora, avec les fonctionnalités
              qui comptent vraiment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Ultra rapide",
                desc: "Vos transferts arrivent en moins de 24h. Pas de délais cachés ni de surprises.",
                color: "bg-amber-50 text-amber-600 border-amber-100",
              },
              {
                icon: Shield,
                title: "100% sécurisé",
                desc: "Chiffrement de bout en bout, vérification d'identité, et protection anti-fraude.",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
              {
                icon: Globe,
                title: "1% de frais seulement",
                desc: "Les frais les plus bas du marché. Pas de frais cachés, pas de mauvaises surprises.",
                color: "bg-sky-50 text-sky-600 border-sky-100",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="group relative p-8 rounded-3xl bg-stone-50/50 border border-stone-200/60 hover:border-[#0d6e3f]/20 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/40"
              >
                <div className={`w-14 h-14 rounded-2xl ${feat.color} border flex items-center justify-center mb-6`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALCULATOR ===== */}
      <section id="calculator" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#094d2c] via-[#0d6e3f] to-[#15a85e] gradient-animate" />
        <div className="absolute inset-0 -z-10 noise" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white mb-6">
                Simulez votre transfert
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Voyez exactement combien votre destinataire recevra.
                Transparent, sans frais cachés.
              </p>
              <div className="flex items-center gap-6 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Réception en &lt;24h
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Taux garanti
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-500 mb-2">
                  Vous envoyez
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="flex-1 px-4 py-3.5 rounded-xl border border-stone-200 text-xl font-bold focus:border-[#0d6e3f] transition-colors"
                    min={1}
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as "CAD" | "XAF")}
                    className="px-4 py-3.5 rounded-xl border border-stone-200 font-semibold bg-stone-50 focus:border-[#0d6e3f] transition-colors"
                  >
                    <option value="CAD">🇨🇦 CAD</option>
                    <option value="XAF">🇨🇲 XAF</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 py-5 border-y border-stone-100 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Frais (1%)</span>
                  <span className="font-semibold text-stone-700">
                    {formatCurrency(fees, fromCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Taux de change</span>
                  <span className="font-semibold text-stone-700">
                    1 {fromCurrency} ={" "}
                    {fromCurrency === "CAD"
                      ? `${EXCHANGE_RATES.CAD_TO_XAF} XAF`
                      : `${EXCHANGE_RATES.XAF_TO_CAD.toFixed(6)} CAD`}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-500 mb-2">
                  Le destinataire reçoit
                </label>
                <div className="px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-3xl font-bold text-[#0d6e3f]">
                    {formatCurrency(received, toCurrency as "CAD" | "XAF")}
                  </span>
                </div>
              </div>

              <Link
                href="/auth/register"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] rounded-xl transition-all shadow-lg shadow-[#0d6e3f]/25"
              >
                <Send className="w-4 h-4" />
                Envoyer maintenant
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              Trois étapes simples pour envoyer de l&apos;argent en toute sérénité.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#0d6e3f]/20 via-[#0d6e3f]/40 to-[#0d6e3f]/20" />

            {[
              {
                step: "01",
                title: "Créez votre compte",
                desc: "Inscrivez-vous en 2 minutes avec votre email. Vérification rapide et sécurisée.",
              },
              {
                step: "02",
                title: "Entrez les détails",
                desc: "Choisissez le montant, la devise, et les informations de votre destinataire.",
              },
              {
                step: "03",
                title: "Envoyez !",
                desc: "Confirmez et votre argent est en route. Suivi en temps réel disponible.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0d6e3f] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-[#0d6e3f]/25 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="relative rounded-3xl bg-stone-900 p-12 md:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 noise" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0d6e3f]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#e8a838]/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl tracking-tight text-white mb-6">
                Prêt à commencer ?
              </h2>
              <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto">
                Rejoignez des milliers de Camerounais et Canadiens qui font
                confiance à ECOTRANS pour leurs transferts.
              </p>
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-stone-900 bg-[#e8a838] hover:bg-[#f0c060] rounded-2xl transition-all shadow-xl shadow-[#e8a838]/25"
              >
                Créer mon compte gratuitement
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d6e3f] to-[#15a85e] flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                ECO<span className="text-[#0d6e3f]">TRANS</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <span>🇨🇲 Cameroun</span>
              <span>↔</span>
              <span>🇨🇦 Canada</span>
            </div>
            <p className="text-sm text-stone-400">
              © {new Date().getFullYear()} ECOTRANS. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}