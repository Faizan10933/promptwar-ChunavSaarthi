/**
 * @fileoverview Gemini AI client for the Chunav Saarthi application.
 * Provides functions to interact with Google's Gemini AI models for:
 * - General election-related Q&A (chatWithSaarthi)
 * - Model Code of Conduct violation analysis (checkMCCViolation)
 *
 * Uses a fallback chain of models to handle rate limiting gracefully.
 * @module lib/gemini
 */

import { GoogleGenAI } from '@google/genai';

/**
 * Gemini API key loaded from environment variables.
 * Must be set via VITE_GEMINI_API_KEY in the .env file.
 * @type {string}
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/** @type {GoogleGenAI|null} Singleton AI client instance */
let aiClient = null;

/**
 * Returns a singleton instance of the GoogleGenAI client.
 * Lazily initializes the client on first call.
 * @returns {GoogleGenAI|null} The AI client, or null if no API key is configured.
 */
function getAIClient() {
  if (aiClient) return aiClient;
  if (API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

/**
 * System prompt that instructs the AI to behave as an Indian election expert.
 * @constant {string}
 */
const ELECTION_SYSTEM_PROMPT = `You are "Saarthi", an expert AI on Indian Elections. 
Cover ECI, EVM, VVPAT, NOTA, MCC, voter registration, Form 6, NVSP, BLO, cVIGIL, postal ballots. 
Be concise (max 200 words). If user writes Hindi/Hinglish, respond similarly. 
Never express political opinions.`;

/**
 * System prompt for MCC violation analysis.
 * Instructs the AI to return structured JSON responses.
 * @constant {string}
 */
const MCC_SYSTEM_PROMPT = `You are an MCC (Model Code of Conduct) expert. 
The MCC has 8 sections: General Conduct, Meetings, Processions, Polling Day, 
Polling Booth, Observers, Party in Power, Manifestos. 
Analyze the user's scenario and respond ONLY in this JSON: 
{"is_violation":true/false,"confidence":"high/medium/low","section":"which section",
"rule":"specific rule","explanation":"why","how_to_report":"steps via cVIGIL app",
"similar_cases":"any famous cases"}`;

/**
 * Ordered list of Gemini models to try.
 * Each model has an independent quota pool, so fallback provides resilience.
 * @constant {string[]}
 */
const MODEL_FALLBACKS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

/**
 * Attempts a Gemini API call with automatic fallback across multiple models.
 * If one model fails (e.g., due to rate limiting), the next is tried.
 *
 * @param {Function} apiCall - Async function that takes a model name and returns a result.
 * @returns {Promise<*>} The result from the first successful model.
 * @throws {Error} If all models fail.
 */
async function callWithFallback(apiCall) {
  let lastError = null;

  for (const modelName of MODEL_FALLBACKS) {
    try {
      return await apiCall(modelName);
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] Model "${modelName}" failed:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini models failed. Please try again later.');
}

/**
 * Sends a message to the Saarthi AI assistant and returns the response.
 * Maintains conversation context through the chatHistory parameter.
 *
 * @param {string} userMessage - The user's question or message.
 * @param {Array<{role: string, text: string}>} [chatHistory=[]] - Previous messages for context.
 * @returns {Promise<string>} The AI-generated response text.
 * @throws {Error} If the API key is not configured or all models fail.
 *
 * @example
 * const reply = await chatWithSaarthi('What is NOTA?');
 * console.log(reply); // "NOTA stands for None of the Above..."
 */
export async function chatWithSaarthi(userMessage, chatHistory = []) {
  const client = getAIClient();
  if (!client) {
    throw new Error('API key not configured. Set VITE_GEMINI_API_KEY in your .env file.');
  }

  return callWithFallback(async (modelName) => {
    const contents = [
      { role: 'user', parts: [{ text: ELECTION_SYSTEM_PROMPT }] },
      {
        role: 'model',
        parts: [{ text: 'Namaste! I am Saarthi. How can I help you understand Indian elections?' }],
      },
      ...chatHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const response = await client.models.generateContent({
      model: modelName,
      contents,
    });

    return response.text;
  });
}

/**
 * Analyzes a real-world scenario for Model Code of Conduct violations.
 * Returns a structured JSON result with violation details and reporting instructions.
 *
 * @param {string} scenario - The scenario description to analyze.
 * @returns {Promise<Object>} Structured analysis result.
 * @returns {boolean} result.is_violation - Whether the scenario is a violation.
 * @returns {string} result.confidence - Confidence level (high/medium/low).
 * @returns {string} [result.section] - Which MCC section is violated.
 * @returns {string} [result.rule] - Specific rule violated.
 * @returns {string} result.explanation - Explanation of the analysis.
 * @returns {string} result.how_to_report - Steps to report via cVIGIL.
 * @returns {string} [result.similar_cases] - Historical similar cases.
 * @throws {Error} If the API key is not configured or all models fail.
 */
export async function checkMCCViolation(scenario) {
  const client = getAIClient();
  if (!client) {
    throw new Error('API key not configured. Set VITE_GEMINI_API_KEY in your .env file.');
  }

  return callWithFallback(async (modelName) => {
    const prompt = `${MCC_SYSTEM_PROMPT}\n\nAnalyze: "${scenario}"`;

    const response = await client.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text;

    // Parse the JSON from the response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // JSON parsing failed — return raw text as explanation
    }

    return {
      is_violation: false,
      confidence: 'low',
      explanation: text,
      how_to_report: 'Download the cVIGIL app from Google Play Store to report violations.',
    };
  });
}

/**
 * Checks whether the Gemini API key is configured in environment variables.
 * @returns {boolean} True if the API key is set, false otherwise.
 */
export function isAPIKeyConfigured() {
  return Boolean(API_KEY);
}
