import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // à adapter selon votre config

// GET : récupérer tous les commentaires (du plus récent au plus ancien)
export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST : ajouter un nouveau commentaire
export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();
    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nom et message requis" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        name: name.trim(),
        message: message.trim(),
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}