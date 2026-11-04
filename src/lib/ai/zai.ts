/**
 * ZhipuAI (ZAI) client — uses the OpenAI-compatible endpoint.
 * Model is configurable via ZAI_MODEL (default glm-4.5-flash).
 * Docs: https://open.bigmodel.cn/dev/api
 */

const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';
// glm-4.5-flash is the free tier on ZhipuAI; glm-4.5-flash was retired.
const MODEL = process.env.ZAI_MODEL ?? 'glm-4.5-flash';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZaiResponse {
  choices: { message: { content: string } }[];
  error?: { message: string };
}

export async function zaiChat(messages: Message[], maxTokens = 300): Promise<string | null> {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    console.warn('[zai] ZAI_API_KEY not set — skipping AI callout');
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[zai] API error ${res.status}: ${body}`);
      return null;
    }

    const data = (await res.json()) as ZaiResponse;
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.error('[zai] fetch error:', err);
    return null;
  }
}
