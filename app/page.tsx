"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
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
  Wifi,
  Tv,
  Hospital,
  Building2,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Taux de frais à 0.5%
const FEE_RATE = 0.005;

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

  // Taux de change dynamiques
  const [cadToXafRate, setCadToXafRate] = useState<number | null>(null);
  const [xafToCadRate, setXafToCadRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [rateError, setRateError] = useState(false);

  // Déclarer toCurrency tout de suite après fromCurrency
  const toCurrency = fromCurrency === "CAD" ? "XAF" : "CAD";

  // Récupération du taux de change
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoadingRate(true);
        setRateError(false);
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/CAD");
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        const rate = data.rates["XAF"];
        if (rate && typeof rate === "number") {
          setCadToXafRate(rate);
          setXafToCadRate(1 / rate);
        } else {
          throw new Error("Taux invalide");
        }
      } catch (error) {
        console.error("Erreur chargement taux:", error);
        setRateError(true);
        setCadToXafRate(450);
        setXafToCadRate(1 / 450);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fonctions de calcul
  const calculateFeesLocal = (amount: number) => amount * FEE_RATE;

  const calculateReceivedLocal = (
    amount: number,
    fromCurr: "CAD" | "XAF",
    toCurr: "CAD" | "XAF",
    cadRate: number,
    xafRate: number
  ) => {
    const feesAmount = calculateFeesLocal(amount);
    const amountAfterFees = amount - feesAmount;
    if (fromCurr === "CAD" && toCurr === "XAF") {
      return amountAfterFees * cadRate;
    } else if (fromCurr === "XAF" && toCurr === "CAD") {
      return amountAfterFees * xafRate;
    }
    return amountAfterFees;
  };

  const fees = calculateFeesLocal(amount);
  const received = cadToXafRate && xafToCadRate
    ? calculateReceivedLocal(amount, fromCurrency, toCurrency, cadToXafRate, xafToCadRate)
    : 0;

  const servicesList = [
    {
      icon: Wifi,
      title: "Facture SOCADEL",
      description: "Réglez vos factures d'eau SOCADEL en quelques clics. Paiement sécurisé et reçu immédiat.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: Tv,
      title: "Abonnement CanalSat",
      description: "Rechargez ou payez votre abonnement CanalSat sans frais cachés. Service disponible 24/7.",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      icon: Hospital,
      title: "Facture Hospitalière",
      description: "Payez vos factures d'hôpitaux et cliniques partenaires directement depuis ECOTRANS.",
      color: "bg-red-50 text-red-600 border-red-100",
    },
  ];

  const partnersList = [
    {
      name: "Vitacare",
      logo: "/parteners/logo_clean.png",
      alt: "Vitacare",
    },
  ];

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
            <a href="#services" className="hover:text-[#0d6e3f] transition-colors">
              Services
            </a>
            <a href="#calculator" className="hover:text-[#0d6e3f] transition-colors">
              Simulateur
            </a>
            <a href="#how-it-works" className="hover:text-[#0d6e3f] transition-colors">
              Comment ça marche
            </a>
            <a href="#partners" className="hover:text-[#0d6e3f] transition-colors">
              Partenaires
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
              <a href="#services" className="text-stone-600 font-medium">Services</a>
              <a href="#calculator" className="text-stone-600 font-medium">Simulateur</a>
              <a href="#how-it-works" className="text-stone-600 font-medium">Comment ça marche</a>
              <a href="#partners" className="text-stone-600 font-medium">Partenaires</a>
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
              Seulement 0,5% de frais de transfert
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
              Une plateforme moderne, sécurisée et pensée pour la diaspora camerounaise. 
              Nous combinons rapidité, transparence et innovation pour faciliter vos 
              transferts d'argent et paiements de factures entre le Canada et le Cameroun.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Ultra rapide",
                desc: "Vos transferts sont traités instantanément et arrivent généralement en moins de 24h, souvent en quelques heures. Suivez l'état de votre transaction à chaque étape via notre interface en temps réel.",
                color: "bg-amber-50 text-amber-600 border-amber-100",
              },
              {
                icon: Shield,
                title: "100% sécurisé",
                desc: "Authentification à deux facteurs, chiffrement bancaire SSL 256-bit et conformité aux normes KYC internationales. Vos fonds sont assurés et vos données personnelles protégées.",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
              {
                icon: Globe,
                title: "0,5% de frais seulement",
                desc: "Seulement 0,5% de frais de transfert, bien en dessous de la moyenne du marché. Pas de coûts cachés, ni de marge cachée sur le taux de change. Ce que vous voyez est ce que votre destinataire reçoit.",
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

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-20 md:py-28 bg-gradient-to-br from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d6e3f]/5 border border-[#0d6e3f]/10 text-[#0d6e3f] text-sm font-medium mb-6">
              <CreditCard className="w-4 h-4" />
              Paiement de factures
            </div>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">
              Nos <span className="text-[#0d6e3f]">services</span> exclusifs
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              En plus des transferts d'argent, réglez vos factures directement depuis ECOTRANS. 
              Simple, rapide et sans frais supplémentaires.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {servicesList.map((service, i) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="group p-8 rounded-3xl bg-white border border-stone-200/60 hover:border-[#0d6e3f]/20 hover:shadow-xl hover:shadow-stone-200/40 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.color} border flex items-center justify-center mb-6`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-stone-500 leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-sm text-[#0d6e3f] font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Paiement instantané</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="mt-12 text-center"
          >
            <p className="text-stone-400 text-sm">
              Plus de services à venir : électricité (ENEO), scolarité, impôts, et bien d'autres.
            </p>
          </motion.div>
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
                  <span className="text-stone-500">Frais (0,5%)</span>
                  <span className="font-semibold text-stone-700">
                    {formatCurrency(fees, fromCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Taux de change</span>
                  {isLoadingRate ? (
                    <span className="text-stone-400 italic">Chargement...</span>
                  ) : rateError ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Taux indicatif
                    </span>
                  ) : (
                    <span className="font-semibold text-stone-700">
                      1 {fromCurrency} ={" "}
                      {fromCurrency === "CAD"
                        ? `${cadToXafRate?.toFixed(2)} XAF`
                        : `${xafToCadRate?.toFixed(6)} CAD`}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-500 mb-2">
                  Le destinataire reçoit
                </label>
                <div className="px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  {isLoadingRate ? (
                    <span className="text-stone-500">Calcul en cours...</span>
                  ) : (
                    <span className="text-3xl font-bold text-[#0d6e3f]">
                      {formatCurrency(received, toCurrency)}
                    </span>
                  )}
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

      {/* ===== PARTNERS SECTION ===== */}
      <section id="partners" className="py-20 md:py-28 bg-stone-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d6e3f]/5 border border-[#0d6e3f]/10 text-[#0d6e3f] text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Ils nous font confiance
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Nos <span className="text-[#0d6e3f]">partenaires</span>
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              ECOTRANS collabore avec les plus grandes institutions financières et 
              opérateurs télécoms pour vous offrir un service fiable.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {partnersList.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 min-w-[140px]"
              >
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  className="h-16 w-auto object-contain transition-all duration-300"
                />
                <span className="text-xs text-stone-400 font-medium text-center">
                  {partner.name}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="text-center text-stone-400 text-sm mt-8"
          >
            * Les logos sont des marques déposées par leurs propriétaires respectifs
          </motion.p>
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