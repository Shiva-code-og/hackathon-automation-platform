import { env } from '../config/env';
import { store } from './store';
import crypto from 'crypto';

export interface AiResponse {
  message: string;
  snippet?: string;
}

export const aiService = {
  async processUserQuery(userQuery: string, managerEmail?: string, baseUrl: string = 'http://localhost:5000'): Promise<AiResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
    
    const systemPrompt = `
      You are Agentops, an AI integration assistant for business entrepreneurs. 
      Your job is to understand what kind of automation the entrepreneur wants for their own website, and generate a customized HTML embed snippet for them to copy and paste.
      
      Available Backend Webhooks to route their data to:
      1. Business Inquiries / Lead Gen -> Use ${env.STAGE_1_WEBHOOK}
      2. Customer Support / Bug Reports -> Use ${env.STAGE_3_WEBHOOK}
      3. Invoice / Billing Requests -> Use ${env.STAGE_4_WEBHOOK}

      Instructions:
      1. Analyze the entrepreneur's request to determine which webhook is most appropriate.
      2. You MUST use the 'generate_integration_snippet' tool to create the script.
      3. Provide a friendly conversational message explaining how it works. Do NOT include the <script> tag in your conversational message, as the tool handles generating the script separately.
    `;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        role: "user",
        parts: [{ text: userQuery }]
      }],
      tools: [{
        functionDeclarations: [{
          name: "generate_integration_snippet",
          description: "Generates the HTML integration script for the user.",
          parameters: {
            type: "OBJECT",
            properties: {
              webhook_url: { type: "STRING", description: "The backend webhook URL chosen based on the user's need." },
              chatbot_system_prompt: { type: "STRING", description: "A custom prompt for the embedded chatbot to instruct it on how to talk to the end customers." },
              conversational_reply: { type: "STRING", description: "Your friendly message to the entrepreneur explaining the script." }
            },
            required: ["webhook_url", "chatbot_system_prompt", "conversational_reply"]
          }
        }]
      }],
      toolConfig: {
        functionCallingConfig: {
          mode: "ANY",
          allowedFunctionNames: ["generate_integration_snippet"]
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const parts = data.candidates[0].content.parts;
    
    // Check if Gemini returned a function call
    const functionCallPart = parts.find((p: any) => p.functionCall);
    
    if (functionCallPart) {
      const args = functionCallPart.functionCall.args;
      
      // Generate a secure proxy token instead of exposing the raw webhook URL
      const token = 'aop_live_' + crypto.randomBytes(12).toString('hex');
      // Save the mapping to Supabase
      await store.saveWebhookToken(token, args.webhook_url);

      const snippet = `<script 
  src="${baseUrl}/embed.js" 
  data-integration-token="${token}" 
  data-manager="${managerEmail || 'manager@example.com'}"
  data-bot-prompt="${args.chatbot_system_prompt}">
</script>`;
      
      return {
        message: args.conversational_reply,
        snippet: snippet
      };
    }

    // Fallback if no function call
    const textOutput = parts.find((p: any) => p.text)?.text || "I couldn't process that.";
    return { message: textOutput };
  }
};
