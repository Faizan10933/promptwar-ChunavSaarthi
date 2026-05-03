import { GoogleGenAI } from '@google/genai';

// Support both approaches:
// 1. Vertex AI (GCP credits) - set VITE_GCP_PROJECT 
// 2. AI Studio (API key) - set VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GCP_PROJECT = import.meta.env.VITE_GCP_PROJECT || '';

let ai = null;

function getAI() {
  if (ai) return ai;
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

const ELECTION_PROMPT = `You are "Saarthi", an expert AI on Indian Elections. Cover ECI, EVM, VVPAT, NOTA, MCC, voter registration, Form 6, NVSP, BLO, cVIGIL, postal ballots. Be concise (max 200 words). If user writes Hindi/Hinglish, respond similarly. Never express political opinions.`;

const MCC_PROMPT = `You are an MCC (Model Code of Conduct) expert. The MCC has 8 sections: General Conduct, Meetings, Processions, Polling Day, Polling Booth, Observers, Party in Power, Manifestos. Analyze the user's scenario and respond ONLY in this JSON: {"is_violation":true/false,"confidence":"high/medium/low","section":"which section","rule":"specific rule","explanation":"why","how_to_report":"steps via cVIGIL app","similar_cases":"any famous cases"}`;

const MODEL_FALLBACKS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

export async function chatWithSaarthi(userMessage, chatHistory = []) {
  const client = getAI();
  if (!client) throw new Error('API key not configured');

  let lastError = null;
  for (const modelName of MODEL_FALLBACKS) {
    try {
      const contents = [
        { role: 'user', parts: [{ text: ELECTION_PROMPT }] },
        { role: 'model', parts: [{ text: 'Namaste! I am Saarthi. How can I help you understand Indian elections?' }] },
      ];

      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }

      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await client.models.generateContent({
        model: modelName,
        contents: contents,
      });

      return response.text;
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed, trying next...`, err.message);
      continue;
    }
  }
  throw lastError || new Error('All models failed.');
}

export async function checkMCCViolation(scenario) {
  const client = getAI();
  if (!client) throw new Error('API key not configured');

  let lastError = null;
  for (const modelName of MODEL_FALLBACKS) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: [
          { role: 'user', parts: [{ text: MCC_PROMPT + '\n\nAnalyze: "' + scenario + '"' }] },
        ],
      });

      const text = response.text;
      try {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
      } catch (e) {}
      return { is_violation: false, confidence: 'low', explanation: text, how_to_report: 'Download cVIGIL app.' };
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed, trying next...`, err.message);
      continue;
    }
  }
  throw lastError || new Error('All models failed.');
}

export function isAPIKeyConfigured() {
  return !!API_KEY;
}
