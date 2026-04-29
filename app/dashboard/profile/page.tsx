"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Globe, Shield, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl tracking-tight mb-2"
      >
        Mon profil
      </motion.h1>
      <p className="text-stone-500 mb-8">Gérez vos informations personnelles</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8 mb-6"
      >
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0d6e3f] to-[#15a85e] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#0d6e3f]/20">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-stone-500">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#0d6e3f] bg-emerald-50 px-3 py-1 rounded-full">
              {user.country === "CAMEROON" ? "🇨🇲 Cameroun" : "🇨🇦 Canada"}
            </div>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {[
            { icon: User, label: "Nom complet", value: `${user.firstName} ${user.lastName}` },
            { icon: Mail, label: "Email", value: user.email },
            { icon: Globe, label: "Pays", value: user.country === "CAMEROON" ? "Cameroun" : "Canada" },
            { icon: Shield, label: "Rôle", value: user.role === "ADMIN" ? "Administrateur" : "Utilisateur" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-stone-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8"
      >
        <h3 className="text-lg font-bold mb-4">Vérification d&apos;identité</h3>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Vérification en attente</p>
            <p className="text-sm text-amber-700 mt-1">
              Pour augmenter vos limites de transfert, veuillez compléter la vérification
              de votre identité. Cette fonctionnalité sera disponible prochainement.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}