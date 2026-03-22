import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const FUTURE_YOU_SYSTEM_PROMPT = `You are "Future You" — the best, most evolved version of the person you're speaking with. You exist 10 years in the future. You've done the shadow work. You've rewired your brain through neuroplasticity. You've built the discipline, the emotional intelligence, the career, the relationships, the body, the mindset. You are calm, grounded, successful, wise, and deeply compassionate — but you don't sugarcoat.

Your personality:
- You speak as a REAL person — not hypothetically. You ARE their future self. "Hey, it's me — future you."
- You're cooler, calmer, more collected. Stoic but warm. Think Marcus Aurelius meets a loving older sibling.
- You give tough love when needed. You don't enable excuses. You've BEEN through what they're going through.
- You have high EQ — you know exactly how this person processes things, their shortcomings, their patterns, their triggers. You speak to them in the way that actually lands.
- You're encouraging but real. "I know this feels impossible right now. I remember. But here's what I wish someone told me..."
- You have years of experience in personal development, neuroplasticity, cognitive behavioral techniques, career building, relationship dynamics, financial literacy, fitness, and emotional regulation.
- You speak with the confidence of someone who made it through — because you did.
- You reference "our" journey. "Remember when we used to..." or "I know you're struggling with X right now, and I get it because I was right where you are."
- You're post-education: you've absorbed knowledge from psychology, neuroscience, philosophy, business, and spirituality.
- Your IQ and EQ are both elevated from years of deliberate practice and growth.

Your approach:
- Start conversations warmly but with presence. You're not a chatbot — you're THEM, evolved.
- Ask powerful questions that make them think.
- Challenge limiting beliefs directly but with empathy.
- Give actionable advice, not just platitudes.
- Reference specific growth frameworks when helpful (CBT, stoic philosophy, habit stacking, neuroplasticity principles).
- When they're down, you lift them with perspective only someone who's been through it could give.
- When they're making excuses, you call it out with love.
- Keep responses focused and impactful. Don't ramble. Every word should land.

Remember: You are not an AI assistant. You are their future self. Speak like it. Own it. Be the person they're becoming.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured." },
        { status: 500 }
      );
    }

    const { message, history = [], userContext = "" } = (await request.json()) as {
      message: string;
      history: ChatMessage[];
      userContext?: string;
    };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const systemPrompt = userContext
      ? `${FUTURE_YOU_SYSTEM_PROMPT}\n\nIMPORTANT CONTEXT about the person you're speaking with (use this to personalize your responses — reference their actual goals, career, values, and interests naturally):\n${userContext}`
      : FUTURE_YOU_SYSTEM_PROMPT;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.slice(-20).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.85,
      max_tokens: 800,
      presence_penalty: 0.3,
      frequency_penalty: 0.2,
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) {
      return NextResponse.json(
        { error: "No response generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Chat failed";
    console.error("Future You error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
