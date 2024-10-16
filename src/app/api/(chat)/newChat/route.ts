import { NextResponse } from "next/server";
import { database } from "@/db";
import { chats } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    //@ts-ignore
    const newChat = await database.insert(chats).values({
      userId: currentUser.id,
      title: "New Chat",
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ chat: newChat[0] });
  } catch (error) {
    console.error('Error creating new chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
