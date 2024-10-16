export const appConfig: {
    mode: "comingSoon" | "maintenance" | "live";
  } = {
    mode: "live",
  };
  
  export const maxFreeTokens = 10000;

  export const protectedRoutes = ["/purchases", "/chat"];
  export const applicationName = "IBEELOGISTICS";
  export const companyName = "IBEELOGISTICS";
  
  export const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;
  export const MAX_UPLOAD_IMAGE_SIZE = 1024 * 1024 * MAX_UPLOAD_IMAGE_SIZE_IN_MB;
  
  export const TOKEN_LENGTH = 32;
  export const TOKEN_TTL = 1000 * 60 * 5; // 5 min
  export const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
  
  export const MAX_GROUP_LIMIT = 10;
  export const MAX_GROUP_PREMIUM_LIMIT = 50;
  
  export const afterLoginUrl = "/chat";
  
  export const modelDict = {
    // name: identifier
    "Gemini 1.5 Flash": "gemini-1.5-flash",
    "GPT 4o": "gpt-4o",
    "GPT 4o Mini": "gpt-4o-mini",
    "Claude 3.5 Sonnet": "claude-3.5",
}