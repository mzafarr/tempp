import { database } from "@/db";
import { messages } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, content } = body;

    if (!chatId || !content) {
      return NextResponse.json({ message: "Invalid input", status: 400 });
    }

    const userMessage = {
      chatId,
      content,
      voiceMessage: null,
      contentType: "text" as const,
      messageType: "user" as const,
      createdAt: new Date(),
    };

    const userInsertedMessage = await database
      .insert(messages)
      .values(userMessage)
      .returning();

    const botMessage = {
      chatId,
      content,
      voiceMessage: null,
      contentType: "text" as const,
      messageType: "bot" as const,
      createdAt: new Date(),
    };

    const botInsertedMessage = await database
      .insert(messages)
      .values(botMessage)
      .returning();

    return NextResponse.json(
      {
        userMessage: userInsertedMessage[0],
        botMessage: botInsertedMessage[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting voice message: ", error);
    NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
