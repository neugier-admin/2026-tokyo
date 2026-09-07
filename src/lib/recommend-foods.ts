import { createServerFn } from "@tanstack/react-start";
import type { FoodRec } from "@/trip-data";

const PROMPT = `你是日本旅遊美食顧問。只回 JSON array，不要 markdown、不要前言。
必須剛好 3 間餐廳，欄位僅限：name, city, category, reason, mapsQuery, priceBand。
reason 用繁體中文 1–2 句。priceBand 用日圓區間例如 "¥1,000–1,800"。
行程：澳門出發（經香港機場 UO624）東京 2026-10-25 至 11-04，景點含淺草、押上、秋葉原、新宿、川崎、豐洲 teamLab、駒澤拉麵祭、池袋、幕張 Fan Fest、日光東照宮、鬼怒川、橫濱ぴあアリーナMM、東京駅伴手禮。
請推薦行程沿線、外國人友善、不必抽籤的店。`;

function parseFoods(text: string): FoodRec[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end <= start) throw new Error("no json array");
  const raw = JSON.parse(text.slice(start, end + 1)) as unknown;
  if (!Array.isArray(raw)) throw new Error("not array");
  const foods: FoodRec[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = String(r.name ?? "").trim();
    const city = String(r.city ?? "").trim();
    const category = String(r.category ?? "").trim();
    const reason = String(r.reason ?? "").trim();
    const mapsQuery = String(r.mapsQuery ?? r.name ?? "").trim();
    const priceBand = String(r.priceBand ?? "").trim();
    if (!name || !mapsQuery) continue;
    foods.push({ name, city, category, reason, mapsQuery, priceBand });
  }
  if (foods.length < 3) throw new Error("need 3 foods");
  return foods.slice(0, 3);
}

export const recommendFoods = createServerFn({ method: "POST" }).handler(async () => {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false as const, error: "no_key" };

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.7,
        max_tokens: 800,
        messages: [{ role: "user", content: PROMPT }],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `http_${res.status}` };
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const foods = parseFoods(text);
    return { ok: true as const, foods };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "fail" };
  }
});
