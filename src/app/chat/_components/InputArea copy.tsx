import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Loader, Mic, StopCircle } from "lucide-react";

interface InputAreaProps {
  onSendMessage: (content: string, type: 'text' | 'voice') => void;
}

export default function InputArea({ onSendMessage }: InputAreaProps) {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() && !audioBlob) return;
    setIsLoading(true);
    try {
      if (audioBlob) {
        // In a real app, you would upload the audio file to your server here
        // and get a URL or ID in return. For now, we'll use a dummy URL.
        const dummyAudioUrl = URL.createObjectURL(audioBlob);
        await onSendMessage(dummyAudioUrl, 'voice');
      } else {
        await onSendMessage(message, 'text');
      }
      setMessage("");
      setAudioBlob(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [message, audioBlob, onSendMessage]);

//   const handleFileAttach = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       if (event.target.files?.[0]) {
//         console.log("File attached:", event.target.files[0].name);
//         // Handle file attachment logic here
//       }
//     },
//     []
//   );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto relative">
        {audioBlob ? (
          <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
            <audio src={URL.createObjectURL(audioBlob)} controls className="w-[70%]" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAudioBlob(null)}
              className="ml-2 text-red-500"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        ) : (
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
        )}
        <div className="absolute right-2 bottom-2 flex space-x-2">
          {/* <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <input
              type="file"
              className="hidden"
              onChange={handleFileAttach}
            />
            <Paperclip className="h-5 w-5" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            className={`${isRecording ? 'text-red-500 hover:text-red-500 animate-pulse' : 'text-gray-400'}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isLoading || (!message.trim() && !audioBlob)}
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