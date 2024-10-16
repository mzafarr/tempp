"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import { Chat, Message } from "@/db/schema";
import { useSearchParams } from "next/navigation";

export default function ChatInterface({ user }: any) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const id = useSearchParams().get("id");
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(Number(id));

  useEffect(() => {
    getChats(user.id);
    if (currentChatId) {
      getMessages(currentChatId);
    }
  }, [currentChatId]);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const getChats = async (userId: number) => {
    const response = await fetch(`/api/getChats?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    const data = await response.json();
    setChats(data.chatList);
  };

  const getMessages = async (id: number) => {
    try {
      const response = await fetch(`/api/getMessages?chatId=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      const messageList = data.messageList;
      setMessages(messageList);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Optionally, add error handling UI here
    }
  };

  const deleteChat = useCallback(
    async (id: number) => {
      setChats((prev) => prev.filter((conv) => conv.id !== id));
      if (currentChatId === id) {
        setCurrentChatId(null);
        setMessages([]);
      }
      const res = await fetch(`/api/deleteChat?chatId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete chat");
      }
    },
    [currentChatId]
  );

  const startNewChat = useCallback(async () => {
    try {
      const response = await fetch("/api/newChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: "current-user-id" }), // Replace with actual user ID
      });

      if (!response.ok) {
        throw new Error("Failed to create new chat");
      }

      const { chat: newChat } = await response.json();

      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      console.error("Error starting new chat:", error);
      // Handle error (e.g., show error message to user)
    }
  }, []);

  const selectChat = useCallback(
    async (id: number) => {
      setCurrentChatId(id);
      const chat = chats.find((chat) => chat.id === id);
      if (!chat) return;
      getMessages(id);
    },
    [chats]
  );

  const handleSendMessage = useCallback(
    async (content: string, type: "text" | "voice") => {
      if (!currentChatId) return;

      const newMessage: Message = {
        id: Date.now(),
        content,
        messageType: "user",
        createdAt: new Date(),
        contentType: type,
        chatId: currentChatId,
        voiceMessage: null,
      };
      setMessages((prev) => [...prev, newMessage]);

      try {
        const response = await fetch("/api/sendTextMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatId: currentChatId, content }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        const assistantResponse: Message = data.botMessage;
        setMessages((prev) => [...prev, assistantResponse]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally, you can add error handling UI here
      }
    },
    [currentChatId]
  );

  return (
    <div
      className={`flex h-screen ${darkMode ? "dark bg-gray-900" : "bg-white"}`}
    >
      <Sidebar
        isOpen={sidebarOpen}
        chats={chats}
        currentChatId={currentChatId}
        onToggle={toggleSidebar}
        onDelete={deleteChat}
        onSelect={selectChat}
        onNewChat={startNewChat}
      />
      <main className="flex-grow flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
        <Header onToggleSidebar={toggleSidebar} />
        <MessageList messages={messages} />
        <InputArea onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
