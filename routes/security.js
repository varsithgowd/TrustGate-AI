const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { scanSchema } = require('../utils/validation');
const { scanText } = require('../services/securityEngine');
const ScanAudit = require('../models/ScanAudit');

// @route   POST /api/security/scan
// @desc    Scan text for threats and PII
// @access  Private
router.post('/scan', authMiddleware, async (req, res) => {
    try {
        const validatedData = scanSchema.parse(req.body);
        const { text } = validatedData;
        
        const scanResult = scanText(text);
        
        // Save Audit
        const audit = new ScanAudit({
            originalLength: text.length,
            riskScore: scanResult.riskScore,
            riskLevel: scanResult.riskLevel,
            action: scanResult.action,
            detectedThreatCount: scanResult.threats.length + scanResult.redactions.length
        });
        
        await audit.save();
        
        res.json(scanResult);
    } catch (err) {
         if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors });
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
