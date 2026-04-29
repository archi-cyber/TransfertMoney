"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { formatCurrency, EXCHANGE_RATES } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  receiverName: string;
  totalReceived: number;
  status: string;
  reference: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  CANCELLED: "bg-stone-100 text-stone-500 border-stone-200",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En cours",
  COMPLETED: "Complété",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as any;

  useEffect(() => {
    fetch("/api/transactions?limit=5")
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalSent = transactions
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl tracking-tight mb-2"
        >
          Bonjour, {user?.firstName} 👋
        </motion.h1>
        <p className="text-stone-500">Voici un résumé de votre activité ECOTRANS</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total envoyé", value: formatCurrency(totalSent, "CAD"), icon: ArrowUpRight, color: "text-[#0d6e3f] bg-emerald-50" },
          { label: "Transactions", value: transactions.length.toString(), icon: Clock, color: "text-sky-600 bg-sky-50" },
          { label: "Taux CAD→XAF", value: `${EXCHANGE_RATES.CAD_TO_XAF} XAF`, icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
          { label: "Frais appliqués", value: "1%", icon: ArrowDownLeft, color: "text-emerald-600 bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-white border border-stone-200/60 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stone-500">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick send */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#094d2c] to-[#0d6e3f] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <Send className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Envoyer de l&apos;argent</h3>
              <p className="text-white/70 text-sm mb-6">Transférez rapidement vers le Cameroun ou le Canada</p>
              <Link
                href="/dashboard/send"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0d6e3f] font-semibold rounded-xl hover:bg-stone-100 transition-colors text-sm"
              >
                Nouveau transfert
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-lg font-bold">Transactions récentes</h3>
              <Link href="/dashboard/history" className="text-sm text-[#0d6e3f] font-medium hover:underline">
                Voir tout
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Clock className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">Aucune transaction pour l&apos;instant</p>
                <p className="text-sm text-stone-400 mt-1">Commencez par envoyer votre premier transfert</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-[#0d6e3f]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tx.receiverName}</p>
                        <p className="text-xs text-stone-500">{tx.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {formatCurrency(tx.amount, tx.currency as "CAD" | "XAF")}
                      </p>
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[tx.status]}`}>
                        {statusLabels[tx.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 