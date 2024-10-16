import { eq } from "drizzle-orm";
import { database } from "@/db";
import { messages } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const messageList = await database
      .select()
      .from(messages)
      .where(eq(messages.chatId, Number(chatId)))
      .orderBy(messages.createdAt);

    return NextResponse.json({ messageList: messageList });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
