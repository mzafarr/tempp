import React from "react";
import ChatInterface from "./_components/ChatInterface";
import { getCurrentUser } from "@/lib/session";

async function Page() {
  const user = await getCurrentUser();
  return (
    <div>
      <ChatInterface user={user} />
    </div>
  );
}

export default Page;
