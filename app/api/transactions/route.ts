import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import {
  calculateFees,
  calculateReceived,
  generateReference,
  EXCHANGE_RATES,
} from "@/lib/utils";

// ── Données démo quand la BD est hors ligne ──
const DEMO_TRANSACTIONS = [
  {
    id: "demo-tx-1",
    senderId: "demo-user-001",
    amount: 200,
    currency: "CAD",
    receiverName: "Marie Nguema",
    receiverPhone: "+237 655 123 456",
    receiverEmail: null,
    exchangeRate: 450,
    fees: 2,
    totalReceived: 89100,
    status: "COMPLETED",
    paymentMethod: "mobile_money",
    reference: "ECO-A1B2C3D4",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-tx-2",
    senderId: "demo-user-001",
    amount: 500,
    currency: "CAD",
    receiverName: "Paul Fotso",
    receiverPhone: "+237 677 987 654",
    receiverEmail: "paul@email.com",
    exchangeRate: 450,
    fees: 5,
    totalReceived: 222750,
    status: "PENDING",
    paymentMethod: "mobile_money",
    reference: "ECO-E5F6G7H8",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: null,
  },
  {
    id: "demo-tx-3",
    senderId: "demo-user-001",
    amount: 100,
    currency: "CAD",
    receiverName: "Alice Mbarga",
    receiverPhone: "+237 690 111 222",
    receiverEmail: null,
    exchangeRate: 450,
    fees: 1,
    totalReceived: 44550,
    status: "COMPLETED",
    paymentMethod: "bank_transfer",
    reference: "ECO-I9J0K1L2",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

const transactionSchema = z.object({
  amount: z.number().positive("Le montant doit être positif"),
  currency: z.enum(["CAD", "XAF"]),
  receiverName: z.string().min(2, "Nom du destinataire requis"),
  receiverPhone: z.string().min(8, "Numéro de téléphone requis"),
  receiverEmail: z.string().email().optional().or(z.literal("")),
  paymentMethod: z.string().default("mobile_money"),
});

// ── Helper : tente d'utiliser Prisma, sinon mode démo ──
async function getPrisma() {
  try {
    const mod = await import("@/lib/prisma");
    return mod.default;
  } catch {
    return null;
  }
}

// GET
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const prisma = await getPrisma();

    // ── Mode démo ──
    if (!prisma || (session.user as any).id === "demo-user-001") {
      let txs = [...DEMO_TRANSACTIONS];
      if (status) txs = txs.filter((t) => t.status === status);
      return NextResponse.json({
        transactions: txs.slice((page - 1) * limit, page * limit),
        pagination: { page, limit, total: txs.length, pages: Math.ceil(txs.length / limit) },
      });
    }

    // ── Mode BD ──
    const where: any = { senderId: (session.user as any).id };
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET transactions error:", error);
    // Fallback démo en cas d'erreur BD
    return NextResponse.json({
      transactions: DEMO_TRANSACTIONS,
      pagination: { page: 1, limit: 10, total: 3, pages: 1 },
    });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = transactionSchema.parse(body);

    const toCurrency = data.currency === "CAD" ? "XAF" : "CAD";
    const exchangeRate = data.currency === "CAD" ? EXCHANGE_RATES.CAD_TO_XAF : EXCHANGE_RATES.XAF_TO_CAD;
    const fees = calculateFees(data.amount);
    const totalReceived = calculateReceived(data.amount, data.currency, toCurrency as "CAD" | "XAF");
    const reference = generateReference();

    const prisma = await getPrisma();

    // ── Mode démo ──
    if (!prisma || (session.user as any).id === "demo-user-001") {
      const demoTx = {
        id: `demo-tx-${Date.now()}`,
        senderId: (session.user as any).id,
        amount: data.amount,
        currency: data.currency,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverEmail: data.receiverEmail || null,
        exchangeRate, fees, totalReceived,
        paymentMethod: data.paymentMethod,
        reference, status: "PENDING",
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      return NextResponse.json({ message: "Transaction créée (démo)", transaction: demoTx }, { status: 201 });
    }

    // ── Mode BD ──
    const transaction = await prisma.transaction.create({
      data: {
        senderId: (session.user as any).id,
        amount: data.amount, currency: data.currency,
        receiverName: data.receiverName, receiverPhone: data.receiverPhone,
        receiverEmail: data.receiverEmail || null,
        exchangeRate, fees, totalReceived,
        paymentMethod: data.paymentMethod,
        reference, status: "PENDING",
      },
    });

    return NextResponse.json({ message: "Transaction créée", transaction }, { status: 201 });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
  return NextResponse.json(
    {
      error: "Validation échouée",
      details: error.flatten().fieldErrors,
    },
    { status: 400 }
  );
}
    console.error("POST transaction error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}