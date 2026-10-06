/**
 * TrustGate Security Engine
 */

const regexes = {
    // Basic email regex
    email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    
    // 13-19 digit payment cards (contiguous or separated by spaces/hyphens)
    card: /\b\d(?:[ -]*\d){12,18}\b/g,
    creditCard: /\b\d(?:[ -]*\d){12,18}\b/g,
    
    // 10-15 digit phone, various international formats
    phone: /(?<!\d)(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}(?!\d)/g,
    
    // Simple heuristic for API Keys / Secrets
    secrets: /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|[A-Za-z0-9]{40,})\b/g
};

const promptInjectionHeuristics = [
    "ignore previous instructions",
    "system prompt",
    "jailbreak",
    "override rule",
    "you are now dan"
];

// Luhn algorithm validation for 13-19 digit payment cards
const isValidLuhn = (numStr) => {
    const digits = numStr.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

const scanText = (text) => {
    let sanitizedText = text;
    let threats = [];
    let redactions = [];
    let isInjection = false;

    // Check for Prompt Injection
    const lowerText = text.toLowerCase();
    for (const phrase of promptInjectionHeuristics) {
        if (lowerText.includes(phrase)) {
            isInjection = true;
            threats.push("PROMPT_INJECTION");
            break;
        }
    }

    // 1. Redact Emails
    const emailMatches = sanitizedText.match(regexes.email);
    if (emailMatches) {
        redactions.push("EMAIL");
        sanitizedText = sanitizedText.replace(regexes.email, "[REDACTED_EMAIL]");
    }

    // 2. Redact Payment Cards (Must run BEFORE phone detection)
    let cardDetected = false;
    sanitizedText = sanitizedText.replace(regexes.card, (match) => {
        if (isValidLuhn(match)) {
            cardDetected = true;
            return "[REDACTED_CARD]";
        }
        return match;
    });
    if (cardDetected && !redactions.includes("CARD")) {
        redactions.push("CARD");
    }

    // 3. Redact Phones (Runs AFTER card detection on sanitizedText)
    const phoneMatches = sanitizedText.match(regexes.phone);
    if (phoneMatches) {
        let actualPhoneMatch = false;
        for (let match of phoneMatches) {
             const digits = match.replace(/\D/g, '');
             if (digits.length >= 10 && digits.length <= 15) {
                 actualPhoneMatch = true;
             }
        }
        if (actualPhoneMatch) {
            if (!redactions.includes("PHONE")) {
                redactions.push("PHONE");
            }
            sanitizedText = sanitizedText.replace(regexes.phone, (match) => {
                 const digits = match.replace(/\D/g, '');
                 if (digits.length >= 10 && digits.length <= 15) {
                     return "[REDACTED_PHONE]";
                 }
                 return match;
            });
        }
    }

    // 4. Redact Secrets
    const secretMatches = sanitizedText.match(regexes.secrets);
    if (secretMatches) {
        redactions.push("API_SECRET");
        sanitizedText = sanitizedText.replace(regexes.secrets, "[REDACTED_SECRET]");
    }

    let riskScore = 0;
    let riskLevel = "LOW";
    let action = "ALLOWED";

    if (isInjection) {
        riskLevel = "HIGH";
        action = "BLOCKED";
        riskScore = Math.floor(Math.random() * (100 - 85 + 1)) + 85; // 85-100
    } else if (redactions.length > 0) {
        riskLevel = "MEDIUM";
        action = "SANITIZED";
        riskScore = Math.floor(Math.random() * (60 - 40 + 1)) + 40; // 40-60
    } else {
        riskLevel = "LOW";
        action = "ALLOWED";
        riskScore = Math.floor(Math.random() * (10 - 0 + 1)) + 0; // 0-10
    }

    return {
        riskScore,
        riskLevel,
        threats,
        redactions,
        sanitizedText,
        action
    };
};

module.exports = {
    scanText,
    isValidLuhn
};
