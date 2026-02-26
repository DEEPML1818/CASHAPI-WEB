// OpenRouter — OpenAI-compatible API, works with free models
// Model priority: tries free models in order until one responds
const OPENROUTER_MODELS = [
    'openai/gpt-4o-mini',           // Best quality free option
    'openai/gpt-4o-mini:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free',
];

export async function getAICompletion(prompt: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
        return '[AI] API key missing — set NEXT_PUBLIC_OPENROUTER_API_KEY in .env.local';
    }

    for (const model of OPENROUTER_MODELS) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'CashApi'
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 200
                })
            });

            const data = await response.json();

            if (data?.choices?.[0]?.message?.content) {
                return data.choices[0].message.content.trim();
            }

            if (data?.error) {
                console.warn(`[OpenRouter] Model ${model} failed: ${data.error.message}`);
                // 404 = model not found, try next
                if (data.error.code === 404 || data.error.message?.includes('No endpoints found')) continue;
                return `[AI Error] ${data.error.message}`;
            }

        } catch (err: any) {
            console.warn(`[OpenRouter] Model ${model} threw: ${err?.message}`);
        }
    }

    return '[AI] All models failed — check your OpenRouter key at openrouter.ai/keys';
}

// Keep old name as alias for backwards compatibility
export const getGeminiCompletion = getAICompletion;
