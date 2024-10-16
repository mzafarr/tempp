import { database } from "@/db";
import { messages } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chatId = formData.get('chatId');
    const voiceMessageFile = formData.get('voiceMessage') as File;

    if (!chatId || !voiceMessageFile) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const voiceMessageArrayBuffer = await voiceMessageFile.arrayBuffer();
    const voiceMessageBuffer = Buffer.from(voiceMessageArrayBuffer);
    const userMessage = {
      chatId,
      content: null,
      voiceMessage: voiceMessageFile,
      contentType: "voice" as const,
      messageType: "user" as const,
      createdAt: new Date(),
    };

    const userInsertedMessage = await database
      .insert(messages)
      .values(userMessage)
      .returning();

    const botMessage = {
      chatId,
      content: null,
      voiceMessage: Buffer.from(voiceMessage, "base64"),
      contentType: "voice" as const,
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
