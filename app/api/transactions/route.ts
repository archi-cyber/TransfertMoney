import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  calculateFees,
  calculateReceived,
  generateReference,
  EXCHANGE_RATES,
} from "@/lib/utils";

const transactionSchema = z.object({
  amount: z.number().positive("Le montant doit être positif"),
  currency: z.enum(["CAD", "XAF"]),
  receiverName: z.string().min(2, "Nom du destinataire requis"),
  receiverPhone: z.string().min(8, "Numéro de téléphone requis"),
  receiverEmail: z.string().email().optional().or(z.literal("")),
  paymentMethod: z.string().default("mobile_money"),
});

// GET — liste des transactions du user connecté
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

    const where: any = { senderId: (session.user as any).id };
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — créer une nouvelle transaction
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const data = transactionSchema.parse(body);

    const toCurrency = data.currency === "CAD" ? "XAF" : "CAD";
    const exchangeRate =
      data.currency === "CAD"
        ? EXCHANGE_RATES.CAD_TO_XAF
        : EXCHANGE_RATES.XAF_TO_CAD;

    const fees = calculateFees(data.amount);
    const totalReceived = calculateReceived(
      data.amount,
      data.currency,
      toCurrency as "CAD" | "XAF"
    );

    const transaction = await prisma.transaction.create({
      data: {
        senderId: (session.user as any).id,
        amount: data.amount,
        currency: data.currency,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverEmail: data.receiverEmail || null,
        exchangeRate,
        fees,
        totalReceived,
        paymentMethod: data.paymentMethod,
        reference: generateReference(),
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Transaction créée", transaction },
      { status: 201 }
    );
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
    console.error("Create transaction error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}