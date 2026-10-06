/**
 * TrustGate Backend Gemini Service
 * Handles communication with Google Gemini API securely on the server side.
 * GEMINI_API_KEY is stored strictly in backend environment variables and NEVER exposed.
 */

const GEMINI_MODELS = [
  'gemini-2.5-flash'
];

/**
 * Generate a response from Google Gemini API
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

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      console.log(`[TrustGate Gemini Service] Requesting model: ${model}`);
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
            text: generatedText
          };
        }

        if (candidate?.finishReason) {
          return {
            success: true,
            text: `[Model finished with status: ${candidate.finishReason}]`
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

      if (response.status === 400 && rawMsg.toLowerCase().includes('api key')) {
        return {
          success: false,
          error: 'Gemini API key is invalid or unauthorized.',
          status: 401
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: 'Gemini API rate limit or quota exceeded. Please try again shortly.',
          status: 429
        };
      }

      if (response.status === 404) {
        lastError = `Model ${model} not available`;
        continue; // Try next fallback model
      }

      if (response.status === 503) {
        lastError = rawMsg || 'The Gemini model is currently experiencing high demand from Google. Please try again in a few moments.';
        continue;
      }

      if (response.status >= 500) {
        lastError = rawMsg || 'Gemini service is temporarily unavailable. Please try again.';
        continue;
      }

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
      lastError = err.message;
    }
  }

  return {
    success: false,
    error: lastError || 'Unable to communicate with the Gemini API service.',
    status: 502
  };
}

module.exports = {
  generateGeminiResponse
};
