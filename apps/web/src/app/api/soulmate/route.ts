import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface GenerateRequest {
  presentation: number; // 0=feminine, 50=androgynous, 100=masculine
  energy: number; // 0=soft, 100=bold
  ageMin: number;
  ageMax: number;
  style: string;
  hairLength: string | null;
  hairColor: string | null;
  facialHair: string | null;
  variation: number; // 0, 1, or 2
}

function buildPrompt(req: GenerateRequest): string {
  // Determine presentation
  const presentation =
    req.presentation < 35
      ? "feminine-presenting"
      : req.presentation > 65
        ? "masculine-presenting"
        : "androgynous";

  // Determine energy/vibe
  const energy =
    req.energy < 35
      ? "soft, gentle, and approachable"
      : req.energy > 65
        ? "bold, confident, and intense"
        : "balanced, warm, and grounded";

  // Age
  const age = Math.round((req.ageMin + req.ageMax) / 2);

  // Style mapping
  const styleMap: Record<string, string> = {
    Casual: "casual everyday clothing, relaxed and natural",
    Natural: "minimal natural styling, effortless beauty",
    Luxury: "elegant luxury fashion, refined and polished",
    "High-Fashion": "avant-garde high fashion editorial styling",
    Streetwear: "modern streetwear, urban and contemporary",
    Classic: "timeless classic attire, sophisticated and clean",
  };
  const styleDesc = styleMap[req.style] || "natural styling";

  // Optional details
  const hairDesc = req.hairLength
    ? `${req.hairLength.toLowerCase()} ${req.hairColor ? req.hairColor.toLowerCase() : ""} hair`
    : "";
  const facialDesc =
    req.facialHair && req.facialHair !== "None"
      ? `with ${req.facialHair.toLowerCase()}`
      : "";

  // Variation adjustments
  const variationTone = [
    "warm golden hour lighting, romantic atmosphere",
    "cool natural daylight, contemplative mood",
    "dramatic cinematic lighting with artistic shadows",
  ][req.variation] || "warm natural lighting";

  return `Cinematic portrait photograph of an attractive ${presentation} person, approximately ${age} years old. ${energy} energy. ${styleDesc}. ${hairDesc} ${facialDesc}. ${variationTone}. Shot on 85mm lens, shallow depth of field, professional studio quality. Beautiful expressive eyes, genuine warmth. Photorealistic, editorial quality portrait. No text, no watermarks.`;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Add OPENAI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as GenerateRequest;
    const prompt = buildPrompt(body);

    const openai = getOpenAI();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: imageUrl, prompt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    console.error("Soulmate generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
