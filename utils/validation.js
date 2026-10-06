const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" })
});

const scanSchema = z.object({
    text: z.string().min(1, { message: "Text is required for scanning" })
});

module.exports = {
    registerSchema,
    loginSchema,
    scanSchema
};
