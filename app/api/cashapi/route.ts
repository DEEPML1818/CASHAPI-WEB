import { NextRequest, NextResponse } from 'next/server';

const MERCHANT_ADDRESS = process.env.CASHAPI_MERCHANT_ADDRESS || 'bchtest:qpqu57emm855p4jcx08daj5caehv74226qj5u437en';
const PRICE_SATS = 1200;
const NETWORK = 'chipnet';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

// In-memory replay protection (resets on server restart — fine for demo)
const usedTxIds = new Set<string>();

/**
 * Validates a BCH transaction on chipnet using imaginary.cash Esplora.
 * Includes a retry loop to handle indexer propagation lag.
 */
async function validateChipnetPayment(txId: string, targetAddress: string, requiredSats: number): Promise<boolean> {
    const cleanAddr = targetAddress.replace('bitcoincash:', '').replace('bchtest:', '').toLowerCase();
    console.log(`[CashApi] Validating TX ${txId} on chipnet...`);
    console.log(`[CashApi] Searching for target: ...${cleanAddr.substring(cleanAddr.length - 10)} with >= ${requiredSats} sats`);

    for (let attempt = 1; attempt <= 10; attempt++) {
        if (attempt > 1) {
            console.log(`[CashApi] Attempt ${attempt}/10 — pausing 2s...`);
            await new Promise(r => setTimeout(r, 2000));
        }

        // Primary: imaginary.cash Esplora
        try {
            const res = await fetch(`https://chipnet.imaginary.cash/api/tx/${txId}`, {
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(7000),
            });
            if (res.ok) {
                const tx = await res.json();
                console.log(`[CashApi] TX found! Checking ${tx.vout?.length || 0} outputs...`);

                const hit = tx?.vout?.find((o: any, idx: number) => {
                    const rawAddr = o.scriptpubkey_address || '';
                    const cleanRaw = rawAddr.replace('bitcoincash:', '').replace('bchtest:', '').toLowerCase();
                    const val = o.value || 0;

                    console.log(`   [Output ${idx}] ${rawAddr} | ${val} sats`);

                    const isAddrMatch = cleanRaw === cleanAddr || cleanRaw.includes(cleanAddr) || cleanAddr.includes(cleanRaw);
                    const isValueMatch = val >= requiredSats;

                    return isAddrMatch && isValueMatch;
                });

                if (hit) {
                    console.log(`[CashApi] ✅ Verified via imaginary.cash (Attempt ${attempt})`);
                    return true;
                }
            } else if (res.status === 404) {
                console.log(`[CashApi] 404: TX not found on imaginary.cash mempool/chain yet.`);
            }
        } catch (err) {
            console.warn('[CashApi] Indexer fetch error (Attempt ' + attempt + ')');
        }

        // Fallback: chaingraph
        try {
            const res = await fetch(`https://chipnet.chaingraph.cash/v1/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query { transaction(hash: "${txId}") { outputs { value_satoshis, locking_bytecode } } }`
                }),
                signal: AbortSignal.timeout(7000),
            });
            if (res.ok) {
                const data = await res.json();
                const outputs = data?.data?.transaction?.[0]?.outputs || [];
                if (outputs.length > 0) {
                    console.log(`[CashApi] Chaingraph found ${outputs.length} outputs. Checking values...`);
                    const validOutput = outputs.find((o: any) => parseInt(o.value_satoshis) >= requiredSats);
                    if (validOutput) {
                        console.log(`[CashApi] ✅ Verified via Chaingraph (Estimate: Address check skipped)`);
                        return true;
                    }
                }
            }
        } catch (err) { /* Silently fallback to next attempt */ }
    }

    console.error(`[CashApi] ❌ Verification failed after 10 attempts.`);
    return false;
}

const OPENROUTER_MODELS = [
    'openai/gpt-4o-mini',
    'openai/gpt-4o-mini:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free',
];

/**
 * Calls OpenRouter AI — tries models in priority order until one works.
 */
async function callAI(agentName: string, agentTask: string, priceSats: number, userQuery: string = ''): Promise<string> {
    if (!OPENROUTER_API_KEY) return '[AI] API key missing — set NEXT_PUBLIC_OPENROUTER_API_KEY in .env.local';

    const prompt = `You are an AI agent named ${agentName} specializing in ${agentTask}. 
A user just paid ${priceSats} satoshis of Bitcoin Cash on chipnet to access your service.
${userQuery ? `The user is asking: "${userQuery}"` : "Provide a brief, specific insight (under 140 characters) related to your specialty, as if this were a real paid AI oracle response."}
Provide a high-quality, professional response. If it's a financial query, focus on analysis/sentiment. Keep it concise.`;

    for (const model of OPENROUTER_MODELS) {
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'CashApi'
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 200
                }),
                signal: AbortSignal.timeout(15000),
            });
            const data = await res.json();
            if (data?.choices?.[0]?.message?.content) {
                return data.choices[0].message.content.trim();
            }
            if (data?.error) {
                console.warn(`[CashApi/AI] Model ${model} failed: ${data.error.message}`);
                if (data.error.message?.includes('No endpoints found')) continue;
                return `[AI Error] ${data.error.message}`;
            }
        } catch (err: any) {
            console.warn(`[CashApi/AI] Model ${model} threw: ${err?.message}`);
        }
    }

    return '[AI] All models failed — check your OpenRouter key.';
}


export async function GET(req: NextRequest) { return handleCashApi(req); }
export async function POST(req: NextRequest) { return handleCashApi(req); }

async function handleCashApi(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);

    // Discovery manifest
    if (searchParams.get('discover') === '1') {
        return NextResponse.json({
            name: 'CashApi',
            protocol_version: 'x402-bch-v2',
            asset: 'bch',
            network: NETWORK,
            endpoints: [
                { path: '/api/cashapi', method: 'POST', amount: PRICE_SATS, asset: 'bch' },
                { path: '/api/cashapi', method: 'GET', amount: PRICE_SATS, asset: 'bch' },
            ],
            address: MERCHANT_ADDRESS,
            discovery_date: new Date().toISOString(),
        });
    }

    // Parse Authorization: x402 <token>:<txid>
    const authHeader = req.headers.get('authorization') || '';
    let token: string | null = req.headers.get('x-cashapi-token');
    let txId: string | null = req.headers.get('x-payment');

    if (authHeader.startsWith('x402 ')) {
        const authContent = authHeader.substring(5).trim();
        if (authContent.includes(':')) {
            const colonIdx = authContent.indexOf(':');
            token = token || authContent.substring(0, colonIdx);
            txId = txId || authContent.substring(colonIdx + 1);
        } else {
            txId = txId || authContent;
        }
    }

    // Parse agent info from token
    let agentName = 'Alpha-Trader';
    let agentTask = 'Sentiment Analysis';
    let priceSats = PRICE_SATS;
    let userQuery = '';

    if (token) {
        try {
            const decoded = JSON.parse(
                Buffer.from(token.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
            );
            agentName = decoded.agentName || agentName;
            agentTask = decoded.agentTask || agentTask;
            priceSats = decoded.amount || priceSats;
        } catch { /* token format mismatch — use defaults */ }
    }

    // Read body fields (agent name/task overrides + user's query)
    if (req.method === 'POST') {
        try {
            const body = await req.json();
            agentName = body.agent || agentName;
            agentTask = body.task || agentTask;
            userQuery = body.query || '';
        } catch { /* body may be empty for GET requests */ }
    }

    // If payment proof provided
    if (txId && txId.length > 10) {

        // Replay protection
        if (usedTxIds.has(txId)) {
            return NextResponse.json(
                { error: 'Replay attack detected: TX already used.' },
                { status: 402 }
            );
        }

        const isValid = await validateChipnetPayment(txId, MERCHANT_ADDRESS, priceSats);

        if (isValid) {
            usedTxIds.add(txId);
            const aiResult = await callAI(agentName, agentTask, priceSats, userQuery);

            return NextResponse.json(
                {
                    status: 'success',
                    message: 'Payment verified on chipnet. AI result delivered.',
                    agent: agentName,
                    task: agentTask,
                    ai_result: aiResult,
                    verified_txid: txId,
                    network: NETWORK,
                    merchant: MERCHANT_ADDRESS,
                    sats_paid: priceSats,
                },
                {
                    headers: {
                        'X-PAYMENT-RESPONSE': token || '',
                        'X-CashApi-Status': 'paid',
                    }
                }
            );
        }

        return NextResponse.json(
            { error: 'Payment verification failed. TX not found or amount insufficient.' },
            { status: 402 }
        );
    }

    // No payment proof — issue 402 challenge
    const challengeToken = Buffer.from(JSON.stringify({
        address: MERCHANT_ADDRESS,
        amount: PRICE_SATS,
        network: NETWORK,
        agentName,
        agentTask,
        iat: Date.now(),
    })).toString('base64url');

    return NextResponse.json(
        {
            message: 'Payment Required',
            network: NETWORK,
            address: MERCHANT_ADDRESS,
            amount_sats: PRICE_SATS,
            hint: 'Send BCH on chipnet, then retry with Authorization: x402 <token>:<txid>',
        },
        {
            status: 402,
            headers: {
                'WWW-Authenticate': `x402 network="${NETWORK}", address="${MERCHANT_ADDRESS}", amount="${PRICE_SATS}", asset="bch", token="${challengeToken}"`,
                'X-CashApi-Network': NETWORK,
                'X-CashApi-Address': MERCHANT_ADDRESS,
                'X-CashApi-Amount': String(PRICE_SATS),
            }
        }
    );
}
