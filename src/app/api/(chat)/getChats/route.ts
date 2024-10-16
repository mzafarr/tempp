import { eq } from "drizzle-orm";
import { database } from "@/db";
import { chats } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const chatList = await database
      .select()
      .from(chats)
      .where(eq(chats.userId, Number(userId)))
      .orderBy(chats.createdAt);

    return NextResponse.json({ chatList: chatList });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { chat: "Internal server error" },
      { status: 500 }
    );
  }
}
