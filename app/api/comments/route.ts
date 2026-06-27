import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function POST(request: Request) {
  try {
    const { name, message, rating } = await request.json();
    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nom et message requis" },
        { status: 400 }
      );
    }

    const validatedRating = typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 0;

    const newComment = await prisma.comment.create({
      data: {
        name: name.trim(),
        message: message.trim(),
        rating: validatedRating,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}