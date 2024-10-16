import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader, Mic, Square } from "lucide-react";

// Update the type declarations
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface InputAreaProps {
  onSendMessage: (content: string, type: 'text') => void;
}

export default function InputArea({ onSendMessage }: InputAreaProps) {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    try {
      await onSendMessage(message, 'text');
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [message, onSendMessage]);

  const startTranscription = useCallback(() => {
    try {
      setIsTranscribing(true);
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionConstructor) {
        throw new Error('SpeechRecognition is not supported in this browser');
      }
      const recognition = new SpeechRecognitionConstructor();
      
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        if (finalTranscript) {
          setMessage((prevMessage) => prevMessage + finalTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsTranscribing(false);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Error starting transcription:", error);
      setIsTranscribing(false);
    }
  }, []);

  const stopTranscription = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsTranscribing(false);
    }
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto relative">
        <Textarea
          placeholder="Message ChatGPT..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full pr-24 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          rows={1}
        />
        <div className="absolute right-2 bottom-2 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className={`${isTranscribing ? 'bg-red-500 hover:bg-red-600 text-white' : 'text-gray-400'}`}
            onClick={isTranscribing ? stopTranscription : startTranscription}
          >
            {isTranscribing ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        ChatGPT can make mistakes. Consider checking important information.
      </p>
    </footer>
  );
}
