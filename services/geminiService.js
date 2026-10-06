/**
 * TrustGate Backend Gemini Service
 * Handles communication with Google Gemini API securely on the server side.
 * GEMINI_API_KEY is stored strictly in backend environment variables and NEVER exposed.
 */

const GEMINI_MODELS = [
  'gemini-3.8-flash'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const RETRY_DELAYS = [1000, 2000, 4000]; // Retry 1: 1s, Retry 2: 2s, Retry 3: 4s
const MAX_RETRIES = 3;

/**
 * Generate a response from Google Gemini API with exponential backoff on HTTP 503
 * @param {string} prompt - The validated/sanitized text to send to Gemini
 * @returns {Promise<{ success: boolean, text?: string, error?: string, status?: number }>}
 */
async function generateGeminiResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      error: 'GEMINI_API_KEY is not configured on the backend server.',
      status: 500
    };
  }

  const model = GEMINI_MODELS[0] || 'gemini-3.8-flash';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      if (attempt === 0) {
        console.log(`[TrustGate Gemini Service] Requesting model: ${model}`);
      } else {
        console.log(`[TrustGate Gemini Service] Retry attempt ${attempt}/${MAX_RETRIES} for model: ${model}`);
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const generatedText = candidate?.content?.parts?.[0]?.text;

        if (generatedText) {
          return {
            success: true,
            text: generatedText,
            provider: 'gemini'
          };
        }

        if (candidate?.finishReason) {
          return {
            success: true,
            text: `[Model finished with status: ${candidate.finishReason}]`,
            provider: 'gemini'
          };
        }

        return {
          success: false,
          error: 'Gemini returned an empty response.',
          status: 502
        };
      }

      // Handle non-200 responses safely without exposing internal secrets
      const errorData = await response.json().catch(() => ({}));
      const rawMsg = errorData?.error?.message || '';
      console.log(`[TrustGate Gemini Service] Response status: ${response.status}, error message: ${rawMsg}`);

      // Permanent client errors: Do NOT retry 400, 401, 403, 404
      if (response.status === 400) {
        const isKeyError = rawMsg.toLowerCase().includes('api key');
        return {
          success: false,
          error: isKeyError ? 'Gemini API key is invalid or unauthorized.' : (rawMsg || 'Bad request to Gemini API.'),
          status: isKeyError ? 401 : 400
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          error: 'Gemini API authentication failed.',
          status: 401
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: rawMsg || 'Gemini API access forbidden.',
          status: 403
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: `Model ${model} not available`,
          status: 404
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: 'Gemini API rate limit or quota exceeded. Please try again shortly.',
          status: 429
        };
      }

      // Transient 503 Service Unavailable / High demand / Overloaded
      const is503 = response.status === 503 ||
        errorData?.error?.code === 503 ||
        errorData?.error?.status === 'UNAVAILABLE' ||
        rawMsg.toLowerCase().includes('high demand') ||
        rawMsg.toLowerCase().includes('overloaded');

      if (is503) {
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS[attempt];
          console.warn(`[TrustGate Gemini Service] Gemini 503 High Demand (Attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${delay / 1000}s (Retry ${attempt + 1}/${MAX_RETRIES})...`);
          await sleep(delay);
          continue; // Execute retry
        }

        console.error(`[TrustGate Gemini Service] Gemini 503: Exhausted all ${MAX_RETRIES} retries.`);
        return {
          success: false,
          error: 'Gemini is temporarily busy. TrustGate is still protecting your request. Please try again in a moment.',
          status: 503
        };
      }

      // Other 5xx errors (e.g. 500, 502, 504)
      return {
        success: false,
        error: rawMsg || `Gemini API returned status ${response.status}`,
        status: response.status
      };

    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return {
          success: false,
          error: 'Gemini API request timed out after 25 seconds.',
          status: 504
        };
      }
      return {
        success: false,
        error: err.message || 'Unable to communicate with the Gemini API service.',
        status: 502
      };
    }
  }

  return {
    success: false,
    error: 'Gemini is temporarily busy. TrustGate is still protecting your request. Please try again in a moment.',
    status: 503
  };
}

module.exports = {
  generateGeminiResponse
};
