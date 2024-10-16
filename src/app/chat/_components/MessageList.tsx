import React, { useEffect, useRef, useState } from "react";
import { Loader, Volume2, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/db/schema";

interface MessageListProps {
  messages: Message[];
}

const suggestedMessages = [
  { icon: "🎨", text: "Create an illustration for a bakery" },
  { icon: "📧", text: "Email for plumber quote" },
  { icon: "📊", text: "Make a recommendation based on my data" },
  { icon: "🌐", text: "Make me a personal webpage" },
];

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakMessage = (content: string, messageId: string) => {
    if (speakingMessageId === messageId && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (speakingMessageId === messageId && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utteranceRef.current = utterance;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const word = content.slice(
          event.charIndex,
          event.charIndex + event.charLength
        );
        setHighlightedWord(word);
      }
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
      setIsPaused(false);
      setHighlightedWord(null);
    };

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(messageId);
    setIsPaused(false);
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const restartSpeech = () => {
    window.speechSynthesis.cancel();
    if (utteranceRef.current && speakingMessageId) {
      window.speechSynthesis.speak(utteranceRef.current);
      setIsPaused(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.contentType === "text") {
      if (speakingMessageId === msg.id.toString()) {
        return (
          <p>
            {msg.content.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  word === highlightedWord
                    ? "bg-yellow-200 dark:bg-yellow-600"
                    : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </p>
        );
      }
      return <p>{msg.content}</p>;
    } else if (msg.contentType === "voice" && msg.voiceMessage) {
      return (
        <audio controls>
          <source
            src={`data:audio/wav;base64,${msg.voiceMessage}`}
            type="audio/wav"
          />
          Your browser does not support the audio element.
        </audio>
      );
    }
    return null;
  };

  return (
    <div className="flex-grow p-6 overflow-y-auto">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.messageType === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.messageType === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`inline-block p-3 px-4 rounded-lg ${
                    msg.messageType === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white"
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <div className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speakMessage(msg.content, msg.id.toString())}
                    title={
                      speakingMessageId === msg.id.toString() && !isPaused
                        ? "Pause"
                        : "Read aloud"
                    }
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  {speakingMessageId === msg.id.toString() && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={pauseSpeech}
                        title="Pause"
                        disabled={isPaused}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={restartSpeech}
                        title="Restart"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            No messages yet. Start a conversation!
          </p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedMessages.map((suggestion, index) => (
              <Button key={index} variant="outline" className="text-left">
                <span className="mr-2">{suggestion.icon}</span>
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
