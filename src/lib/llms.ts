import { env } from "@/env";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { modelDict } from "@/app-config";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];
const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export const runLLM = async (
  modelName: string,
  systemMessage: string,
  userMessage: string
) => {
  switch (modelName) {
    case "Gemini 1.5 Flash":
      const model = gemini.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings,
      });
      const result = await model.generateContent(
        `systemMessage: ${systemMessage}\n\n\nuserMessage: ${userMessage}`
      );
      console.log(result.response.text());
    case "GPT 4o" || "GPT 4o Mini":
      const gptRes = await openai.chat.completions.create({
        model: modelDict[modelName],
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
      });

      return gptRes.choices[0].message.content;
    case "Claude 3.5 Sonnet":
      const claudeRes = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          { role: "assistant", content: systemMessage },
          { role: "user", content: userMessage },
        ],
      });
      //@ts-ignore
      return claudeRes.content[0].text;
    default:
      return gemini;
  }
};
