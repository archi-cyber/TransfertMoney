"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Loader2, Filter, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  receiverName: string;
  receiverPhone: string;
  totalReceived: number;
  fees: number;
  status: string;
  reference: string;
  paymentMethod: string;
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

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: "10" });
    if (filter) params.set("status", filter);

    fetch(`/api/transactions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setTotalPages(data.pagination?.pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, filter]);

  const filtered = transactions.filter(
    (tx) =>
      !searchQuery ||
      tx.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl tracking-tight mb-2"
      >
        Historique des transactions
      </motion.h1>
      <p className="text-stone-500 mb-8">Suivez tous vos transferts en un seul endroit</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou référence..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors text-sm placeholder:text-stone-400"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="pl-11 pr-8 py-3 rounded-xl border border-stone-200 bg-white focus:border-[#0d6e3f] transition-colors text-sm font-medium appearance-none"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="PROCESSING">En cours</option>
            <option value="COMPLETED">Complétés</option>
            <option value="FAILED">Échoués</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">Aucune transaction trouvée</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left font-semibold text-stone-500 px-6 py-4">Référence</th>
                    <th className="text-left font-semibold text-stone-500 px-6 py-4">Destinataire</th>
                    <th className="text-left font-semibold text-stone-500 px-6 py-4">Montant</th>
                    <th className="text-left font-semibold text-stone-500 px-6 py-4">Reçu</th>
                    <th className="text-left font-semibold text-stone-500 px-6 py-4">Statut</th>
                    <th className="text-left font-semibold text-stone-500 px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-stone-700">{tx.reference}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{tx.receiverName}</p>
                        <p className="text-xs text-stone-500">{tx.receiverPhone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">{formatCurrency(tx.amount, tx.currency as "CAD" | "XAF")}</td>
                      <td className="px-6 py-4 font-semibold text-[#0d6e3f]">
                        {formatCurrency(tx.totalReceived, tx.currency === "CAD" ? "XAF" : "CAD")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[tx.status]}`}>
                          {statusLabels[tx.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-stone-100">
              {filtered.map((tx) => (
                <div key={tx.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#0d6e3f]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tx.receiverName}</p>
                        <p className="text-xs text-stone-500">{tx.reference}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[tx.status]}`}>
                      {statusLabels[tx.status]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{formatCurrency(tx.amount, tx.currency as "CAD" | "XAF")}</span>
                    <span className="font-bold text-[#0d6e3f]">
                      → {formatCurrency(tx.totalReceived, tx.currency === "CAD" ? "XAF" : "CAD")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-40 transition-colors"
            >
              Précédent
            </button>
            <span className="text-sm text-stone-500">Page {page} sur {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-40 transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}