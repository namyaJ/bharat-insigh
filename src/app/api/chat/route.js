/**
 * Server-side AI Chat Route
 * This runs ONLY on the server — no API keys or SDK references
 * are ever sent to the client bundle.
 */
import { OpenAI } from 'openai';

export async function POST(req) {
  const { messages, context } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // The env var is named generically so it doesn't reveal the provider
      const apiKey = process.env.AI_SERVICE_KEY;

      if (!apiKey) {
        const dummyText = `Based on your current view, there are ${context.count} active rows under the "${context.department}" department filter${context.query ? ` matching "${context.query}"` : ''}. The data shows government scheme allocation patterns across Indian states. Configure AI_SERVICE_KEY in your environment to enable live AI analysis.`;
        const words = dummyText.split(' ');
        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          await new Promise(r => setTimeout(r, 60));
        }
        controller.close();
        return;
      }

      try {
        const client = new OpenAI({ apiKey });

        const userQuery = messages[messages.length - 1]?.content || messages[messages.length - 1]?.parts?.[0]?.text || '';

        const systemPrompt = `You are the AI insight assistant embedded inside the GovData Analytics Dashboard — a government data platform for India.

CURRENT USER CONTEXT (use this in every answer):
- Active Department Filter: ${context.department || 'All'}
- Active State Filter: ${context.state || 'All'}
- Active Year Filter: ${context.year || 'All'}
- Search Query: ${context.query || 'none'}
- Rows Currently Visible: ${context.count}

GUIDELINES:
1. Always reference the user's active filters. Example: "Since you're viewing Health department data for Maharashtra..."
2. Be specific with numbers. Don't say "various schemes" — say "the 20,269 filtered records".
3. Keep answers SHORT and scannable — use **bold** for key figures, ### headings for sections, and - bullet points.
4. Act like a smart data analyst sitting next to the user. Give actionable insights, not textbook explanations.
5. When asked "explain everything", give a brief dashboard summary: what the KPI cards show, what the charts reveal, and notable patterns — all in context of their current filters.
6. Never mention which AI model or provider you are. You are "GovData AI".
7. Format all currency in ₹ Crores.
8. Maximum response length: 250 words. Be concise.`;

        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          stream: true,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
          ],
        });

        for await (const chunk of completion) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (err) {
        // Generic error messages — never expose SDK or provider details
        let friendlyMsg;
        if (err.status === 429 || err.message?.includes('429')) {
          friendlyMsg = "⏳ Rate limit reached. Please wait a moment and try again.";
        } else if (err.status === 401 || err.message?.includes('Incorrect API key')) {
          friendlyMsg = "⚠️ AI service authentication failed. Please check your configuration.";
        } else {
          friendlyMsg = "⚠️ Could not reach the AI service right now. Please try again shortly.";
        }
        controller.enqueue(encoder.encode(friendlyMsg));
        controller.close();
      }
    }
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
