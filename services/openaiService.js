/**
 * TrustGate Backend OpenAI Fallback Service
 * Handles fallback communication with OpenAI API securely on the server side.
 * OPENAI_API_KEY is stored strictly in backend environment variables and NEVER exposed.
 */

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Generate a response from OpenAI API as a fallback provider
 * @param {string} prompt - The validated/sanitized text to send to OpenAI
 * @returns {Promise<{ success: boolean, text?: string, error?: string, status?: number, provider?: string }>}
 */
async function generateOpenAIResponse(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      error: 'OPENAI_API_KEY is not configured on the backend server.',
      status: 500
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    console.log(`[TrustGate OpenAI Fallback Service] Requesting fallback model: ${OPENAI_MODEL}`);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;

      if (generatedText) {
        return {
          success: true,
          text: generatedText,
          provider: 'openai'
        };
      }

      return {
        success: false,
        error: 'OpenAI returned an empty response.',
        status: 502
      };
    }

    const errorData = await response.json().catch(() => ({}));
    const rawMsg = errorData?.error?.message || '';
    console.log(`[TrustGate OpenAI Fallback Service] Response status: ${response.status}, message: ${rawMsg}`);

    return {
      success: false,
      error: rawMsg || `OpenAI API returned status ${response.status}`,
      status: response.status
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'OpenAI API request timed out after 25 seconds.',
        status: 504
      };
    }
    return {
      success: false,
      error: err.message || 'Unable to communicate with OpenAI API.',
      status: 502
    };
  }
}

module.exports = {
  generateOpenAIResponse,
  OPENAI_MODEL
};
