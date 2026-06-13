"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Taux de frais à 0,5%
const FEE_RATE = 0.005;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

// Type pour un commentaire (identique au modèle Prisma)
type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // État pour les commentaires (via API)
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentMessage, setNewCommentMessage] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toCurrency = fromCurrency === "CAD" ? "XAF" : "CAD";

  // Récupération des commentaires depuis la BDD
  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Erreur chargement commentaires", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Ajout d'un commentaire via API
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentMessage.trim()) {
      setCommentError("Veuillez entrer votre nom et un message.");
      return;
    }
    setIsSubmitting(true);
    setCommentError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCommentName.trim(),
          message: newCommentMessage.trim(),
        }),
      });
      if (res.ok) {
        setNewCommentName("");
        setNewCommentMessage("");
        fetchComments(); // recharge la liste
      } else {
        const error = await res.json();
        setCommentError(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      setCommentError("Erreur réseau, veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression d'un commentaire (admin seulement si vous ajoutez un rôle, ici on garde simple)
  // Pour l'exemple, on supprime uniquement si l'utilisateur est admin (vous pouvez ajuster)
  // Ici on désactive la suppression publique pour éviter les abus – on peut l'activer côté admin plus tard.
  // Je laisse le bouton mais sans fonction pour l'instant. 
  // Pour une démo, vous pouvez ajouter une vérification d'admin ou simplement supprimer l'icône.
  const handleDeleteComment = async (id: string) => {
    // Cette route n'existe pas encore – à ajouter si besoin avec authentification admin.
    console.log("Suppression à implémenter avec authentification", id);
  };

  // (Le reste de votre logique de taux de change est inchangé)

  // Récupération du taux de change avec plusieurs sources
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoadingRate(true);
      setRateError(false);

      const apis = [
        async () => {
          const res = await fetch("https://api.allorigins.win/raw?url=https://api.frankfurter.app/latest?from=CAD&to=XAF");
          if (!res.ok) throw new Error();
          const data = await res.json();
          return data.rates.XAF;
        },
        async () => {
          const res = await fetch("https://api.exchangerate.host/convert?from=CAD&to=XAF");
          if (!res.ok) throw new Error();
          const data = await res.json();
          return data.result;
        },
        async () => 406.47,
      ];

      for (const fetchFn of apis) {
        try {
          const rate = await fetchFn();
          if (rate && typeof rate === "number" && rate > 0) {
            setCadToXafRate(rate);
            setXafToCadRate(1 / rate);
            setLastUpdate(new Date());
            setIsLoadingRate(false);
            return;
          }
        } catch (error) {
          console.warn("API échouée, tentative suivante...");
        }
      }

      setRateError(true);
      setCadToXafRate(406.47);
      setXafToCadRate(1 / 406.47);
      setIsLoadingRate(false);
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
    {
      name: "Clear Radiology",
      logo: "/parteners/clear.png",
      alt: "Clear Radiology",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* NAVBAR (identique, j'omets pour la lisibilité) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 relative">
              <Image src="/logo.png" alt="EcoTrans logo" width={36} height={36} className="rounded-xl object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight">ECO<span className="text-[#0d6e3f]">TRANS</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#features" className="hover:text-[#0d6e3f] transition-colors">Fonctionnalités</a>
            <a href="#services" className="hover:text-[#0d6e3f] transition-colors">Services</a>
            <a href="#calculator" className="hover:text-[#0d6e3f] transition-colors">Simulateur</a>
            <a href="#how-it-works" className="hover:text-[#0d6e3f] transition-colors">Comment ça marche</a>
            <a href="#partners" className="hover:text-[#0d6e3f] transition-colors">Partenaires</a>
            <a href="#contact" className="hover:text-[#0d6e3f] transition-colors">Contact</a>
            <a href="#comments" className="hover:text-[#0d6e3f] transition-colors">Commentaires</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="px-5 py-2.5 text-sm font-semibold text-stone-700 hover:text-[#0d6e3f] transition-colors">Connexion</Link>
            <Link href="/auth/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] rounded-xl transition-all shadow-lg shadow-[#0d6e3f]/20 hover:shadow-[#0d6e3f]/40">Créer un compte</Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden border-t border-stone-200 bg-white px-6 pb-6">
            <div className="flex flex-col gap-4 pt-4">
              <a href="#features" className="text-stone-600 font-medium">Fonctionnalités</a>
              <a href="#services" className="text-stone-600 font-medium">Services</a>
              <a href="#calculator" className="text-stone-600 font-medium">Simulateur</a>
              <a href="#how-it-works" className="text-stone-600 font-medium">Comment ça marche</a>
              <a href="#partners" className="text-stone-600 font-medium">Partenaires</a>
              <a href="#contact" className="text-stone-600 font-medium">Contact</a>
              <a href="#comments" className="text-stone-600 font-medium">Commentaires</a>
              <hr className="border-stone-200" />
              <Link href="/auth/login" className="text-stone-700 font-semibold">Connexion</Link>
              <Link href="/auth/register" className="px-5 py-3 text-center font-semibold text-white bg-[#0d6e3f] rounded-xl">Créer un compte</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ===== HERO ===== (inchangé) – je ne répète pas pour gagner de la place, mais vous devez le conserver. */}
      {/* ... toute la section hero, features, services, calculator, how-it-works, partners, contact ... */}

      {/* Je donne la section commentaires modifiée, le reste doit être identique à votre code existant (que vous avez déjà). */}

      {/* ===== COMMENTAIRES SECTION ===== (avec API BDD) */}
      <section id="comments" className="py-20 md:py-28 bg-stone-50 scroll-mt-20">
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
              <MessageCircle className="w-4 h-4" />
              Votre avis compte
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Ce que nos <span className="text-[#0d6e3f]">utilisateurs</span> disent
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              Partagez votre expérience avec ECOTRANS. Vos commentaires nous aident à nous améliorer.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Formulaire d'ajout */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="bg-white rounded-2xl p-6 shadow-md mb-10 border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#0d6e3f]" />
                Ajouter un commentaire
              </h3>
              <form onSubmit={handleAddComment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Votre nom</label>
                  <input
                    type="text"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-[#0d6e3f] focus:ring-1 focus:ring-[#0d6e3f] transition-colors"
                    placeholder="ex: Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Votre message</label>
                  <textarea
                    value={newCommentMessage}
                    onChange={(e) => setNewCommentMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-[#0d6e3f] focus:ring-1 focus:ring-[#0d6e3f] transition-colors"
                    placeholder="Partagez votre expérience..."
                  />
                </div>
                {commentError && <p className="text-red-500 text-sm">{commentError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d6e3f] hover:bg-[#094d2c] text-white font-semibold rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Envoi..." : "Publier"}
                </button>
              </form>
            </motion.div>

            {/* Liste des commentaires */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="space-y-5"
            >
              {comments.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-stone-200">
                  <p className="text-stone-400">Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-[#0d6e3f]" />
                        </div>
                        <span className="font-semibold text-stone-800">{comment.name}</span>
                      </div>
                      {/* Suppression désactivée pour l'exemple (nécessite auth admin) */}
                      {/* <button onClick={() => handleDeleteComment(comment.id)} className="text-stone-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button> */}
                    </div>
                    <p className="text-stone-600 mt-2">{comment.message}</p>
                    <p className="text-xs text-stone-400 mt-3">
                      {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA et FOOTER ===== (inchangés) */}
      {/* ... vous devez conserver le reste de votre code (CTA, footer) ... */}
    </div>
  );
}