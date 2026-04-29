# 🌍 ECOTRANS — Architecture Complète

## Transfert d'argent Cameroun ↔ Canada

---

## 1. Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Framer Motion |
| Auth | NextAuth.js v4 (Credentials Provider) |
| ORM | Prisma |
| Base de données | PostgreSQL (Railway) |
| Hashage | bcryptjs |
| Validation | Zod |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## 2. Pourquoi NextAuth.js + PostgreSQL (pas Firebase)

- **Un seul service** : tout vit dans PostgreSQL (users, sessions, transactions)
- **Prisma Adapter** : sync automatique entre NextAuth et ta DB
- **Contrôle total** : pas de vendor lock-in, données hébergées sur Railway
- **Sessions JWT** : rapide, serverless-friendly, pas de table sessions à gérer
- **Extensible** : ajout facile de providers OAuth (Google, Facebook) plus tard

---

## 3. Structure du Projet

```
ecotrans/
├── prisma/
│   └── schema.prisma          # Modèles DB
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout global
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/
│   │   │   ├── login/page.tsx  # Connexion
│   │   │   └── register/page.tsx # Inscription
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Layout dashboard
│   │   │   ├── page.tsx        # Vue principale
│   │   │   ├── send/page.tsx   # Envoyer argent
│   │   │   ├── history/page.tsx # Historique
│   │   │   └── profile/page.tsx # Profil
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── register/route.ts
│   │       ├── transactions/route.ts
│   │       └── exchange-rate/route.ts
│   ├── components/
│   │   ├── ui/                 # Composants réutilisables
│   │   ├── landing/            # Composants landing page
│   │   └── dashboard/          # Composants dashboard
│   ├── lib/
│   │   ├── prisma.ts           # Client Prisma singleton
│   │   ├── auth.ts             # Config NextAuth
│   │   └── utils.ts            # Helpers
│   └── types/
│       └── index.ts            # Types TypeScript
├── .env.local                  # Variables d'environnement
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 4. Modèles de Données (Prisma)

### User
- id, email, password (hashé), firstName, lastName
- phone, country (CAMEROON | CANADA)
- kycVerified, role (USER | ADMIN)
- createdAt, updatedAt

### Transaction
- id, senderId, amount, currency (XAF | CAD)
- receiverName, receiverPhone, receiverEmail
- exchangeRate, fees, totalReceived
- status (PENDING | PROCESSING | COMPLETED | FAILED | CANCELLED)
- paymentMethod, reference (unique)
- createdAt, completedAt

### ExchangeRate
- id, fromCurrency, toCurrency, rate
- createdAt

---

## 5. Dépendances à Installer

```bash
# Core
npm install next-auth @next-auth/prisma-adapter prisma @prisma/client

# Validation & Sécurité
npm install bcryptjs zod

# UI & Animation
npm install framer-motion react-hot-toast lucide-react

# Types
npm install -D @types/bcryptjs
```

---

## 6. Variables d'Environnement (.env.local)

```env
# Database (Railway)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/railway"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 7. Commandes Prisma

```bash
# Initialiser Prisma
npx prisma init

# Générer le client après modification du schema
npx prisma generate

# Pousser le schema vers Railway
npx prisma db push

# Ouvrir Prisma Studio (GUI)
npx prisma studio
```

---

## 8. Flux Utilisateur

1. **Inscription** → POST /api/register → hash password → save User
2. **Connexion** → NextAuth credentials → vérifie bcrypt → JWT token
3. **Dashboard** → middleware vérifie session → affiche données
4. **Envoi** → calcul taux + frais → POST /api/transactions → save
5. **Historique** → GET /api/transactions → liste filtrée par user

---

## 9. Sécurité

- Mots de passe hashés avec bcryptjs (12 salt rounds)
- Sessions JWT signées avec NEXTAUTH_SECRET
- Validation Zod sur toutes les routes API
- Middleware Next.js pour protéger /dashboard/*
- CSRF protection intégrée via NextAuth