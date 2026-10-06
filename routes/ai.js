const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { scanText } = require('../services/securityEngine');
const { generateGeminiResponse } = require('../services/geminiService');
const { generateOpenAIResponse } = require('../services/openaiService');
const ScanAudit = require('../models/ScanAudit');

/**
 * @route   POST /api/ai/chat
 * @desc    Protected AI chat endpoint with real-time TrustGate security scanning
 * @access  Private (Requires Bearer JWT)
 */
router.post('/chat', authMiddleware, async (req, res) => {
    try {
        const { message } = req.body || {};

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ message: 'A non-empty message string is required.' });
        }

        const trimmedMessage = message.trim();

        // 1. Run message through TrustGate Security Engine
        const security = scanText(trimmedMessage);

        // 2. Persist audit telemetry
        try {
            const audit = new ScanAudit({
                originalLength: trimmedMessage.length,
                riskScore: security.riskScore,
                riskLevel: security.riskLevel,
                action: security.action,
                detectedThreatCount: (security.threats?.length || 0) + (security.redactions?.length || 0)
            });
            await audit.save();
        } catch (auditErr) {
            // Non-blocking if audit persistence fails
            console.error('Audit save error:', auditErr.message);
        }

        // 3. PROMPT INJECTION / CRITICAL THREAT: STOP, DO NOT CALL ANY AI PROVIDER
        if (security.action === 'BLOCKED') {
            return res.json({
                security: {
                    riskScore: security.riskScore,
                    riskLevel: security.riskLevel,
                    threats: security.threats,
                    redactions: security.redactions,
                    action: security.action,
                    sanitizedText: security.sanitizedText
                },
                response: null,
                provider: null,
                blocked: true
            });
        }

        // 4. PREPARE PAYLOAD FOR AI PROVIDERS
        // When SANITIZED, forward the redacted text; when ALLOWED, forward the original text
        const promptForAI = security.action === 'SANITIZED'
            ? security.sanitizedText
            : trimmedMessage;

        // 5. CALL GEMINI API (PRIMARY PROVIDER)
        const geminiResult = await generateGeminiResponse(promptForAI);

        if (geminiResult.success) {
            return res.json({
                security: {
                    riskScore: security.riskScore,
                    riskLevel: security.riskLevel,
                    threats: security.threats,
                    redactions: security.redactions,
                    action: security.action,
                    sanitizedText: security.sanitizedText
                },
                response: geminiResult.text,
                provider: 'gemini'
            });
        }

        // 6. GEMINI TEMPORARY FAILURE (503 / Quota / Rate-limit / Timeout): ENGAGE OPENAI FALLBACK
        console.warn(`[TrustGate AI Route] Gemini primary returned failure (${geminiResult.status}: ${geminiResult.error}). Engaging OpenAI fallback...`);
        const openaiResult = await generateOpenAIResponse(promptForAI);

        if (openaiResult.success) {
            console.log('[TrustGate AI Route] OpenAI fallback response succeeded.');
            return res.json({
                security: {
                    riskScore: security.riskScore,
                    riskLevel: security.riskLevel,
                    threats: security.threats,
                    redactions: security.redactions,
                    action: security.action,
                    sanitizedText: security.sanitizedText
                },
                response: openaiResult.text,
                provider: 'openai'
            });
        }

        // 7. BOTH PROVIDERS UNAVAILABLE
        console.error(`[TrustGate AI Route] Both providers failed. Gemini: ${geminiResult.error} | OpenAI: ${openaiResult.error}`);
        return res.json({
            security: {
                riskScore: security.riskScore,
                riskLevel: security.riskLevel,
                threats: security.threats,
                redactions: security.redactions,
                action: security.action,
                sanitizedText: security.sanitizedText
            },
            response: null,
            provider: null,
            status: 503,
            error: 'All AI services (Gemini and OpenAI) are temporarily unavailable. TrustGate is still protecting your request. Please try again in a moment.'
        });

    } catch (err) {
        console.error('AI chat endpoint error:', err.message);
        return res.status(500).json({ message: 'Internal server error processing AI chat request.' });
    }
});

module.exports = router;
