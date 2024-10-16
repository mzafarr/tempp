// "use server";

// import { runLLM } from "@/lib/llms";
// import {
//   ContentGenFormData as FormData,
//   ContentGenFormSchema as FormSchema,
// } from "../dashboard/types";

// export async function generateContent(formData: FormData) {
//   const result = FormSchema.safeParse(formData);
//   if (!result.success) {
//     return { error: result.error.flatten().fieldErrors };
//   }

//   const {
//     language,
//     toneOfVoice,
//     instructions,
//     keywords,
//     creativity,
//     contentLength,
//     llmModel,
//     contentType,
//   } = result.data;

//   const systemMessage = `You are a professional content creator. Generate content based on the following parameters:
//   Language: ${language}
//   Content Type: ${contentType}
//   Tone of Voice: ${toneOfVoice}
//   Creativity Level: ${creativity}
//   Content Length: ${contentLength}`;

//   const userMessage = `Instructions: ${instructions}
//   ${keywords ? `Keywords: ${keywords}` : ""}`;

//   try {
//     const content = await runLLM(llmModel, systemMessage, userMessage);

//     // const content = res.choices[0].message.content;

//     // TODO: Store the result in the database
//     // await storeResultInDatabase({ ...formData, content })

//     return { content };
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return { error: "Failed to generate content. Please try again." };
//   }
// }
