const mongoose = require('mongoose');

const scanAuditSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    originalLength: {
        type: Number,
        required: true,
    },
    riskScore: {
        type: Number,
        required: true,
    },
    riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        required: true,
    },
    action: {
        type: String,
        enum: ['ALLOWED', 'SANITIZED', 'BLOCKED'],
        required: true,
    },
    detectedThreatCount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('ScanAudit', scanAuditSchema);
