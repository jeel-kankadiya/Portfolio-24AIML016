/**
 * routes/ai.js — AI feature backend proxy
 *
 * POST /api/ai/generate-description
 *   Body: { title: string }
 *   Returns: { description: string }
 *
 * The Gemini API key lives ONLY in .env — never sent to the frontend.
 * If the AI call fails, we return a 503 so the frontend can degrade gracefully.
 */

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const router = express.Router();


// ==========================================
// POST /api/ai/generate-description
// Protected: requires JWT (same as task routes)
// ==========================================

router.post('/generate-description', auth, async (req, res) => {

    const { title } = req.body;

    // Validate input
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'A non-empty task title is required.'
        });
    }

    // Check API key is configured
    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
            error: 'AI Unavailable',
            message: 'AI feature is not configured on this server.'
        });
    }

    try {

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a helpful task management assistant. 
Given the task title below, write a clear, concise task description (2–3 sentences max).
The description should explain what needs to be done and why it matters.
Do NOT include the title itself in the description.
Do NOT use markdown, bullet points, or headers — plain text only.

Task Title: "${title.trim()}"

Description:`;

        // Set a timeout of 10 seconds for the AI call
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI request timed out')), 10000)
        );

        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]);

        const description = result.response.text().trim();

        return res.status(200).json({ description });

    } catch (err) {

        console.error('[AI Route] Gemini error:', err.message);

        // Return 503 so frontend knows AI failed but app still works
        return res.status(503).json({
            error: 'AI Unavailable',
            message: 'The AI service is temporarily unavailable. Please write a description manually.'
        });

    }

});


module.exports = router;
