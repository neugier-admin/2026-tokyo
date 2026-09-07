import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BedDouble,
  CalendarRange,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  ExternalLink,
  MapPin,
  Plane,
  Snowflake,
  Sun,
  Ticket,
  TrainFront,
  Utensils,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  X,
  Clock,
  Wallet,
  RefreshCw,
  Star,
  LoaderCircle,
} from "lucide-react";
import { recommendFoods } from "@/lib/recommend-foods";
import { fetchWeather } from "@/lib/weather";
import {
  AI_FOOD_PROMPT,
  TRIP,
  type Coupon,
  type DayPlan,
  type FoodRec,
  type ItemType,
  type PlanItem,
} from "@/trip-data";

const config = {
  aiProvider: "xai" as const,
  xai: {
    apiKey: "",
    endpoint: "https://api.x.ai/v1/chat/completions",
    model: "grok-4.6",
  },
  gemini: {
    apiKey: "",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  },
};

type TabId = "itinerary" | "food" | "coupons";
type PlanKey = "A" | "B";

const PLAN_STORAGE = "tokyo-aurora-plan-choice";
const TAB_STORAGE = "tokyo-aurora-tab";
const DAY_STORAGE = "tokyo-aurora-day";
const TODAY_ISO = "2026-09-07";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function mapsLink(name: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(name)}`;
}

function inferCouponTags(name: string, existing: string[]): string[] {
  if (existing.length) return existing;
  const n = name.toLowerCase();
  const tags: string[] = [];
  if (/bic|愛電王|edion|laox|victoria/i.test(name) || n.includes("victoria")) tags.push("電器");
  if (/sundrug|鶴羽|札幌|cosmos|salonia|drug/i.test(n + name)) tags.push("藥妝");
  if (/近鐵|大丸|西武|名鐵|京王|小田急/.test(name)) tags.push("百貨");
  if (/donki|唐吉/.test(name)) tags.push("綜合");
  if (/機場|成田|羽田|免稅/.test(name)) tags.push("機場");
  if (/alpen|victoria|運動/.test(n + name) && !tags.includes("電器")) tags.push("運動");
  return tags.length ? tags : ["其他"];
}

function defaultDay(): string {
  const start = TRIP.startDate;
  const end = TRIP.endDate;
  if (TODAY_ISO < start) return start;
  if (TODAY_ISO > end) return end;
  const hit = TRIP.days.find((d) => d.date === TODAY_ISO);
  return hit?.date ?? start;
}

function daysUntil(date: string) {
  const a = new Date(`${TODAY_ISO}T00:00:00+09:00`).getTime();
  const b = new Date(`${date}T00:00:00+09:00`).getTime();
  return Math.round((b - a) / 86400000);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function weatherLabel(code: number): { label: string; Icon: typeof Sun } {
  if (code === 0) return { label: "晴", Icon: Sun };
  if (code === 1) return { label: "大致晴", Icon: Sun };
  if (code === 2) return { label: "間中有雲", Icon: CloudSun };
  if (code === 3) return { label: "陰", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "霧", Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "毛毛雨", Icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67].includes(code)) return { label: "雨", Icon: CloudRain };
  if ([71, 73, 75, 77].includes(code)) return { label: "雪", Icon: Snowflake };
  if ([80, 81, 82].includes(code)) return { label: "驟雨", Icon: CloudRain };
  if ([85, 86].includes(code)) return { label: "雪驟", Icon: Snowflake };
  if ([95, 96, 99].includes(code)) return { label: "雷雨", Icon: CloudLightning };
  return { label: "天氣", Icon: Cloud };
}

type WeatherState =
  | { status: "loading" }
  | { status: "empty" }
  | {
      status: "ok";
      code: number;
      tMin: number;
      tMax: number;
      source: "forecast" | "archive";
    };

function useWeather(lat: number, lon: number, date: string): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setState({ status: "loading" });
      try {
        const result = await fetchWeather({ data: { lat, lon, date } });
        if (cancelled) return;
        if (result.ok) {
          setState({
            status: "ok",
            code: result.code,
            tMin: result.tMin,
            tMax: result.tMax,
            source: result.source,
          });
          return;
        }
        setState({ status: "empty" });
      } catch {
        if (!cancelled) setState({ status: "empty" });
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [lat, lon, date]);

  return state;
}

function TypeIcon({ type }: { type: ItemType }) {
  const cls = "size-3.5 shrink-0";
  if (type === "transit") return <TrainFront className={cls} />;
  if (type === "meal") return <Utensils className={cls} />;
  if (type === "flight") return <Plane className={cls} />;
  if (type === "hotel") return <BedDouble className={cls} />;
  if (type === "free") return <Coffee className={cls} />;
  return <MapPin className={cls} />;
}

function typeLabel(type: ItemType) {
  switch (type) {
    case "transit":
      return "交通";
    case "meal":
      return "用餐";
    case "flight":
      return "航班";
    case "hotel":
      return "住宿";
    case "free":
      return "自由";
    default:
      return "活動";
  }
}

function WeatherPill({ lat, lon, date }: { lat: number; lon: number; date: string }) {
  const weather = useWeather(lat, lon, date);
  if (weather.status === "loading") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface/80 px-2.5 py-1 text-xs text-muted">
        <LoaderCircle className="size-3 animate-spin" />
        讀取天氣
      </span>
    );
  }
  if (weather.status === "empty") {
    return (
      <span className="inline-flex items-center rounded-full bg-surface/80 px-2.5 py-1 text-xs text-muted">
        天氣暫無
      </span>
    );
  }
  const { label, Icon } = weatherLabel(weather.code);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-2.5 py-1 text-xs text-fg"
      title={weather.source === "archive" ? "參考去年同期" : "預報"}
    >
      <Icon className="size-3.5 text-accent" />
      <span>{label}</span>
      <span className="tabular-nums text-muted">
        {Math.round(weather.tMin)}° / {Math.round(weather.tMax)}°
      </span>
      {weather.source === "archive" ? (
        <span className="rounded-full bg-highlight/15 px-1.5 py-px text-xs font-medium tracking-wide text-highlight">
          Ref
        </span>
      ) : null}
    </span>
  );
}

function TimelineCard({ item }: { item: PlanItem }) {
  const isTransit = item.type === "transit";
  return (
    <article
      className={cn(
        "rounded-xl p-3.5 transition-shadow duration-150",
        item.highlight
          ? "bg-highlight/10 shadow-[0_0_0_1px_rgba(251,191,36,0.45)]"
          : isTransit
            ? "bg-surface-2/80 shadow-border"
            : "glass rounded-xl",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted">
          <TypeIcon type={item.type} />
          <span>{typeLabel(item.type)}</span>
          <span className="tabular-nums text-fg/90">
            {item.startTime} – {item.endTime}
          </span>
        </div>
        {item.highlight ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-highlight/20 px-2 py-0.5 text-xs font-semibold text-highlight">
            <Star className="size-2.5" />
            重點
          </span>
        ) : null}
      </div>
      <h3 className="mt-1.5 font-medium leading-snug text-fg">{item.title}</h3>
      <a
        href={item.mapsUrl || mapsLink(item.locationName)}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-sm text-accent hover:text-primary"
      >
        <MapPin className="size-3.5" />
        <span className="underline-offset-2 hover:underline">{item.locationName}</span>
        <ExternalLink className="size-3 opacity-70" />
      </a>
      {isTransit ? (
        <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-lg bg-bg/40 px-2.5 py-2 text-xs">
          <div>
            <p className="text-subtle">工具</p>
            <p className="mt-0.5 font-medium text-fg">{item.mode}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-subtle">
              <Clock className="size-3" />
              耗時
            </p>
            <p className="mt-0.5 font-medium tabular-nums text-fg">{item.durationMin} 分</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-subtle">
              <Wallet className="size-3" />
              預估
            </p>
            <p className="mt-0.5 font-medium tabular-nums text-fg">
              {item.costJPY ? `¥${item.costJPY.toLocaleString()}` : "—"}
            </p>
          </div>
        </div>
      ) : null}
      {item.notes ? <p className="mt-2 text-xs leading-relaxed text-muted">{item.notes}</p> : null}
    </article>
  );
}

function DayTimeline({ items }: { items: PlanItem[] }) {
  return (
    <ol className="relative ml-2 space-y-3 border-l border-border pl-5">
      {items.map((it, idx) => (
        <li key={`${it.startTime}-${it.title}-${idx}`} className="relative">
          <span
            className={cn(
              "absolute -left-[25px] top-4 size-2.5 rounded-full",
              it.highlight ? "bg-highlight" : it.type === "transit" ? "bg-accent/70" : "bg-primary",
            )}
          />
          <TimelineCard item={it} />
        </li>
      ))}
    </ol>
  );
}

function ItineraryTab({
  day,
  planKey,
  onTogglePlan,
}: {
  day: DayPlan;
  planKey: PlanKey;
  onTogglePlan: () => void;
}) {
  const items = planKey === "B" ? day.planB : day.planA;
  const hasB = day.planB.length > 0;
  const countdown = daysUntil(TRIP.startDate);
  return (
    <div className="space-y-4">
      <section className="glass-strong relative overflow-hidden rounded-2xl p-4">
        <div className="absolute right-0 top-0 h-20 w-32 aurora-line opacity-40" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-muted">
              {day.date.replace("2026-", "")} · {day.weekday} · {day.city}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-fg">{day.title}</h2>
            {day.stay ? <p className="mt-1 text-xs text-muted">住宿 {day.stay}</p> : null}
          </div>
          <WeatherPill lat={day.lat} lon={day.lon} date={day.date} />
        </div>
        <div className="mt-3 space-y-1 text-xs text-muted">
          {day.arrivalConstraint !== "無" ? <p>抵達限制：{day.arrivalConstraint}</p> : null}
          {day.departureConstraint !== "無" ? <p>離開限制：{day.departureConstraint}</p> : null}
        </div>
        {countdown > 0 ? (
          <p className="mt-3 text-xs text-primary">出發倒數 {countdown} 日</p>
        ) : countdown === 0 ? (
          <p className="mt-3 text-xs text-primary">今日出發</p>
        ) : null}
        {hasB ? (
          <button
            type="button"
            onClick={onTogglePlan}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg transition-transform duration-150 active:scale-[0.98]"
          >
            <RefreshCw className="size-4" />
            切換方案 / 雨天備案
          </button>
        ) : null}
        <p className="mt-2 text-xs text-muted">
          目前：方案 {planKey}
          {planKey === "A" ? "（主行程）" : "（雨天／室內備案）"}
        </p>
      </section>
      <DayTimeline items={items} />
    </div>
  );
}

function parseFoodArray(text: string): FoodRec[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end <= start) throw new Error("no json");
  const raw = JSON.parse(text.slice(start, end + 1)) as unknown;
  if (!Array.isArray(raw)) throw new Error("not array");
  const foods: FoodRec[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const name = String(r.name ?? "").trim();
    if (!name) continue;
    foods.push({
      name,
      city: String(r.city ?? "").trim(),
      category: String(r.category ?? "").trim(),
      reason: String(r.reason ?? "").trim(),
      mapsQuery: String(r.mapsQuery ?? name).trim(),
      priceBand: String(r.priceBand ?? "").trim(),
    });
  }
  if (foods.length < 3) throw new Error("need 3");
  return foods.slice(0, 3);
}

async function fetchClientXai(): Promise<FoodRec[]> {
  const key = config.xai.apiKey.trim();
  if (!key) throw new Error("empty key");
  const res = await fetch(config.xai.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: config.xai.model,
      temperature: 0.7,
      max_tokens: 800,
      messages: [{ role: "user", content: AI_FOOD_PROMPT }],
    }),
  });
  if (!res.ok) throw new Error(`http_${res.status}`);
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return parseFoodArray(body.choices?.[0]?.message?.content ?? "");
}

function FoodCard({ food }: { food: FoodRec }) {
  return (
    <article className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">
            {food.city}
            {food.category ? ` · ${food.category}` : ""}
          </p>
          <h3 className="mt-1 text-base font-semibold text-fg">{food.name}</h3>
        </div>
        {food.priceBand ? (
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-1 text-xs tabular-nums text-primary">
            {food.priceBand}
          </span>
        ) : null}
      </div>
      {food.reason ? <p className="mt-2 text-sm leading-relaxed text-muted">{food.reason}</p> : null}
      <a
        href={mapsLink(food.mapsQuery || food.name)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface-2 px-4 text-sm font-medium text-accent shadow-border"
      >
        <MapPin className="size-4" />
        Map
      </a>
    </article>
  );
}

function FoodTab() {
  const [foods, setFoods] = useState<FoodRec[]>(TRIP.foods);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAi = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const server = await recommendFoods();
        if (server.ok && server.foods.length >= 3) {
          setFoods(server.foods);
          setOffline(false);
          return;
        }
      } catch {
        /* try client config next */
      }
      try {
        const client = await fetchClientXai();
        setFoods(client);
        setOffline(false);
      } catch {
        setFoods(TRIP.foods);
        setOffline(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">沿線推薦</h2>
          <p className="text-xs text-muted">先睇預先揀好嘅店，再叫 AI 補三間</p>
        </div>
        <button
          type="button"
          onClick={() => void onAi()}
          disabled={loading}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 self-start whitespace-nowrap rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          AI 智能推薦
        </button>
      </div>
      {offline ? (
        <div className="rounded-xl bg-highlight/12 px-3 py-2 text-sm text-highlight shadow-[0_0_0_1px_rgba(251,191,36,0.28)]">
          目前使用離線推薦
        </div>
      ) : null}
      <div className="space-y-3">
        {foods.map((f) => (
          <FoodCard key={f.name} food={f} />
        ))}
      </div>
    </div>
  );
}

function CouponModal({
  coupon,
  onClose,
}: {
  coupon: Coupon;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-strong max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-2xl p-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={coupon.name}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{coupon.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-fg"
            aria-label="關閉"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-fg">{coupon.discount}</p>
        <p className="mt-1 text-xs text-muted">到期：{coupon.expiry}</p>
        {coupon.region ? <p className="mt-1 text-xs text-muted">地區：{coupon.region}</p> : null}
        {coupon.expired ? (
          <p className="mt-2 text-sm font-medium text-danger">已過期</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {inferCouponTags(coupon.name, coupon.tags).map((t) => (
            <span key={t} className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
              {t}
            </span>
          ))}
        </div>
        <a
          href={coupon.final_url || coupon.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-fg"
        >
          開啟優惠
          <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  );
}

function CouponsTab() {
  const allTags = useMemo(() => {
    const set = new Set<string>(["全部"]);
    for (const c of TRIP.coupons) {
      for (const t of inferCouponTags(c.name, c.tags)) set.add(t);
    }
    return [...set];
  }, []);
  const [filter, setFilter] = useState("全部");
  const [open, setOpen] = useState<Coupon | null>(null);

  const list = TRIP.coupons.filter((c) => {
    if (filter === "全部") return true;
    return inferCouponTags(c.name, c.tags).includes(filter);
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">優惠券</h2>
        <p className="text-xs text-muted">點卡片睇詳情同外連 · 過期會變暗</p>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFilter(tag)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150",
              filter === tag ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted shadow-border",
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setOpen(c)}
            className={cn(
              "glass rounded-2xl p-4 text-left transition-shadow duration-150 hover:shadow-border-hover",
              c.expired && "opacity-45",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug">{c.name}</h3>
              {c.expired ? (
                <span className="shrink-0 rounded-full bg-danger/20 px-2 py-0.5 text-xs font-semibold text-danger">
                  已過期
                </span>
              ) : null}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{c.discount}</p>
            <p className="mt-1 text-xs text-subtle">到期 {c.expiry}</p>
            {c.region ? <p className="mt-0.5 text-xs text-subtle">{c.region}</p> : null}
            <div className="mt-2 flex flex-wrap gap-1">
              {inferCouponTags(c.name, c.tags).map((t) => (
                <span key={t} className="rounded-full bg-primary/12 px-2 py-0.5 text-xs text-primary">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      {open ? <CouponModal coupon={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function BottomNav({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) {
  const items: { id: TabId; label: string; Icon: typeof CalendarRange }[] = [
    { id: "itinerary", label: "行程", Icon: CalendarRange },
    { id: "food", label: "美食", Icon: UtensilsCrossed },
    { id: "coupons", label: "優惠券", Icon: Ticket },
  ];
  return (
    <nav className="glass-strong fixed bottom-0 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 border-t border-glass-border pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-3">
        {items.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onTab(id)}
                className={cn(
                  "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-xs font-medium",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function isTabId(v: unknown): v is TabId {
  return v === "itinerary" || v === "food" || v === "coupons";
}

function BootSplash() {
  return (
    <div
      className="flex h-dvh w-full items-center justify-center bg-bg"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-lg font-semibold tracking-tight text-fg">東京 2026</p>
        <p className="text-xs text-muted">載入中…</p>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabId>("itinerary");
  const [dayId, setDayId] = useState<string>(TRIP.startDate);
  const [plans, setPlans] = useState<Record<string, PlanKey>>({});
  const [ready, setReady] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const tabRaw = readJson<unknown>(TAB_STORAGE, "itinerary");
    const nextTab: TabId = isTabId(tabRaw) ? tabRaw : "itinerary";
    const dayRaw = readJson<string>(DAY_STORAGE, defaultDay());
    const nextDay = TRIP.days.some((d) => d.date === dayRaw) ? dayRaw : defaultDay();
    const storedPlans = readJson<Record<string, unknown>>(PLAN_STORAGE, {});
    const nextPlans: Record<string, PlanKey> = {};
    for (const [key, value] of Object.entries(storedPlans)) {
      if (value === "A" || value === "B") nextPlans[key] = value;
    }
    setTab(nextTab);
    setDayId(nextDay);
    setPlans(nextPlans);

    const finish = () => {
      if (!cancelled) setReady(true);
    };
    const timer = window.setTimeout(finish, 1000);
    const fonts = document.fonts?.ready ?? Promise.resolve();
    void fonts.finally(() => {
      window.clearTimeout(timer);
      requestAnimationFrame(finish);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(TAB_STORAGE, JSON.stringify(tab));
  }, [tab, ready]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(DAY_STORAGE, JSON.stringify(dayId));
  }, [dayId, ready]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(PLAN_STORAGE, JSON.stringify(plans));
  }, [plans, ready]);

  useEffect(() => {
    if (!ready) return;
    mainRef.current?.scrollTo({ top: 0 });
  }, [dayId, tab, ready]);

  if (!ready) return <BootSplash />;

  const selected = TRIP.days.find((d) => d.date === dayId) ?? TRIP.days[0];
  if (!selected) return <BootSplash />;
  const day = selected;
  const planKey: PlanKey = plans[day.date] ?? "A";

  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden">
      <div className="flex h-dvh w-full max-w-2xl flex-col">
        <header className="shrink-0 border-b border-glass-border bg-bg/80 pt-3 backdrop-blur-xl">
          <div className="px-4 pb-2">
            <h1 className="text-lg font-semibold tracking-tight text-fg">東京 2026</h1>
          </div>
          {tab === "itinerary" ? (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
              {TRIP.days.map((d) => {
                const active = d.date === day.date;
                const md = d.date.slice(5).replace("-", "/");
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setDayId(d.date)}
                    className={cn(
                      "flex min-h-14 w-20 shrink-0 flex-col items-center justify-center rounded-2xl px-3 text-center transition-colors duration-150",
                      active ? "bg-primary text-primary-fg" : "glass text-muted",
                    )}
                  >
                    <span className="text-xs">{d.weekday}</span>
                    <span className="text-sm font-semibold tabular-nums">{md}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </header>

        <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-28">
          {tab === "itinerary" ? (
            <ItineraryTab
              day={day}
              planKey={planKey}
              onTogglePlan={() =>
                setPlans((prev) => ({
                  ...prev,
                  [day.date]: (prev[day.date] ?? "A") === "A" ? "B" : "A",
                }))
              }
            />
          ) : null}
          {tab === "food" ? <FoodTab /> : null}
          {tab === "coupons" ? <CouponsTab /> : null}
        </main>

        <BottomNav tab={tab} onTab={setTab} />
      </div>
    </div>
  );
}
