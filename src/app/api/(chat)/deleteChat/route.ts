import { eq } from "drizzle-orm";
import { database } from "@/db";
import { chats, messages } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    await database.delete(chats).where(eq(chats.id, Number(chatId)));
    await database.delete(messages).where(eq(messages.chatId, Number(chatId)));
    return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
