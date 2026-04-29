"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeftRight,
  Send,
  User,
  Phone,
  Mail,
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  formatCurrency,
  EXCHANGE_RATES,
  calculateFees,
  calculateReceived,
} from "@/lib/utils";

type Step = "amount" | "receiver" | "confirm" | "success";

export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("amount");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    amount: 100,
    currency: "CAD" as "CAD" | "XAF",
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    paymentMethod: "mobile_money",
  });

  const toCurrency = form.currency === "CAD" ? "XAF" : "CAD";
  const fees = calculateFees(form.amount);
  const received = calculateReceived(form.amount, form.currency, toCurrency);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      setResult(data.transaction);
      setStep("success");
      toast.success("Transaction créée avec succès !");
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl tracking-tight mb-2"
      >
        Envoyer de l&apos;argent
      </motion.h1>
      <p className="text-stone-500 mb-8">Cameroun ↔ Canada · 1% de frais</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {(["amount", "receiver", "confirm", "success"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              (["amount", "receiver", "confirm", "success"] as Step[]).indexOf(step) >= i
                ? "bg-[#0d6e3f]"
                : "bg-stone-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === "amount" && (
          <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8"
          >
            <h2 className="text-xl font-bold mb-6">Montant du transfert</h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-stone-500 mb-2">Vous envoyez</label>
              <div className="flex gap-3">
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || 0 })}
                  className="flex-1 px-4 py-3.5 rounded-xl border border-stone-200 text-2xl font-bold focus:border-[#0d6e3f] transition-colors" min={1}
                />
                <button onClick={() => setForm({ ...form, currency: form.currency === "CAD" ? "XAF" : "CAD" })}
                  className="px-5 py-3.5 rounded-xl border border-stone-200 font-semibold bg-stone-50 hover:bg-stone-100 transition-colors flex items-center gap-2"
                >
                  {form.currency === "CAD" ? "🇨🇦" : "🇨🇲"} {form.currency}
                  <ArrowLeftRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            </div>

            <div className="space-y-3 py-5 border-y border-stone-100 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Frais (1%)</span>
                <span className="font-semibold">{formatCurrency(fees, form.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Taux de change</span>
                <span className="font-semibold">
                  1 {form.currency} = {form.currency === "CAD" ? `${EXCHANGE_RATES.CAD_TO_XAF} XAF` : `${EXCHANGE_RATES.XAF_TO_CAD.toFixed(6)} CAD`}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100 mb-8">
              <p className="text-sm text-[#0d6e3f] font-medium mb-1">Le destinataire reçoit</p>
              <p className="text-3xl font-bold text-[#0d6e3f]">
                {formatCurrency(received, toCurrency as "CAD" | "XAF")}
              </p>
            </div>

            <button onClick={() => setStep("receiver")} disabled={form.amount <= 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] disabled:opacity-50 rounded-xl transition-all"
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === "receiver" && (
          <motion.div key="receiver" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8"
          >
            <h2 className="text-xl font-bold mb-6">Informations du destinataire</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="text" required value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400" placeholder="Nom du destinataire"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="tel" required value={form.receiverPhone} onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400" placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email (optionnel)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="email" value={form.receiverEmail} onChange={(e) => setForm({ ...form, receiverEmail: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:border-[#0d6e3f] transition-colors placeholder:text-stone-400" placeholder="email@exemple.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Mode de réception</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
                    { value: "bank_transfer", label: "Virement bancaire", icon: CreditCard },
                  ].map((method) => (
                    <button key={method.value} type="button" onClick={() => setForm({ ...form, paymentMethod: method.value })}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm ${
                        form.paymentMethod === method.value ? "border-[#0d6e3f] bg-emerald-50 text-[#0d6e3f]" : "border-stone-200 text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      <method.icon className="w-4 h-4" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep("amount")} className="flex-1 px-6 py-3.5 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
                Retour
              </button>
              <button onClick={() => setStep("confirm")} disabled={!form.receiverName || !form.receiverPhone}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] disabled:opacity-50 rounded-xl transition-all"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8"
          >
            <h2 className="text-xl font-bold mb-6">Confirmer le transfert</h2>
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-xs font-medium text-stone-500 mb-1">Montant envoyé</p>
                <p className="text-xl font-bold">{formatCurrency(form.amount, form.currency)}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-medium text-[#0d6e3f] mb-1">Montant reçu</p>
                <p className="text-xl font-bold text-[#0d6e3f]">{formatCurrency(received, toCurrency as "CAD" | "XAF")}</p>
              </div>
              <div className="divide-y divide-stone-100">
                {[
                  { label: "Destinataire", value: form.receiverName },
                  { label: "Téléphone", value: form.receiverPhone },
                  { label: "Frais", value: formatCurrency(fees, form.currency) },
                  { label: "Mode", value: form.paymentMethod === "mobile_money" ? "Mobile Money" : "Virement bancaire" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-3 text-sm">
                    <span className="text-stone-500">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("receiver")} className="flex-1 px-6 py-3.5 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
                Retour
              </button>
              <button onClick={handleSend} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] disabled:opacity-60 rounded-xl transition-all shadow-lg shadow-[#0d6e3f]/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" />Confirmer l&apos;envoi</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4 */}
        {step === "success" && result && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#0d6e3f]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Transfert initié !</h2>
            <p className="text-stone-500 mb-6">Votre transfert est en cours de traitement.</p>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 inline-block mb-8">
              <p className="text-xs text-stone-500 mb-1">Référence</p>
              <p className="text-lg font-mono font-bold">{result.reference}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setStep("amount"); setForm({ amount: 100, currency: "CAD", receiverName: "", receiverPhone: "", receiverEmail: "", paymentMethod: "mobile_money" }); }}
                className="flex-1 px-6 py-3.5 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Nouveau transfert
              </button>
              <button onClick={() => router.push("/dashboard/history")}
                className="flex-1 px-6 py-3.5 text-sm font-semibold text-white bg-[#0d6e3f] hover:bg-[#094d2c] rounded-xl transition-all"
              >
                Voir l&apos;historique
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}