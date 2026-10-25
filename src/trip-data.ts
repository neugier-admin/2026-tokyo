export type ItemType = "activity" | "transit" | "meal" | "flight" | "hotel" | "free";

export interface PlanItem {
  type: ItemType;
  startTime: string;
  endTime: string;
  title: string;
  locationName: string;
  mapsUrl: string;
  highlight: boolean;
  notes: string;
  mode?: string;
  durationMin?: number;
  costJPY?: number;
  from?: string;
  to?: string;
}

export interface DayPlan {
  date: string;
  weekday: string;
  title: string;
  city: string;
  lat: number;
  lon: number;
  stay?: string;
  arrivalConstraint: string;
  departureConstraint: string;
  planA: PlanItem[];
  planB: PlanItem[];
}

export interface FoodRec {
  name: string;
  city: string;
  category: string;
  reason: string;
  mapsQuery: string;
  priceBand: string;
}

export interface Coupon {
  name: string;
  discount: string;
  expiry: string;
  expired: boolean;
  tags: string[];
  region: string | null;
  link: string;
  final_url: string;
  kind: "page" | "image";
}

export interface TripData {
  tripTitle: string;
  theme: string;
  startDate: string;
  endDate: string;
  flights: {
    outbound: {
      flightNo: string;
      from: string;
      to: string;
      depart: string;
      arrive: string;
      notes: string;
    };
    inbound: {
      flightNo: string;
      from: string;
      to: string;
      depart: string;
      arrive: string;
      notes: string;
    };
  };
  openTasks: string[];
  days: DayPlan[];
  foods: FoodRec[];
  coupons: Coupon[];
}

const TODAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function mapsUrl(q: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}`;
}

function item(
  type: ItemType,
  startTime: string,
  endTime: string,
  title: string,
  locationName: string,
  extra: Partial<PlanItem> = {},
): PlanItem {
  return {
    type,
    startTime,
    endTime,
    title,
    locationName,
    mapsUrl: mapsUrl(locationName),
    highlight: false,
    notes: "",
    ...extra,
  };
}

function transit(
  startTime: string,
  endTime: string,
  mode: string,
  durationMin: number,
  costJPY: number,
  from: string,
  to: string,
  notes = "",
): PlanItem {
  return {
    type: "transit",
    startTime,
    endTime,
    title: `${mode} ${from} → ${to}`,
    locationName: `${from} → ${to}`,
    mapsUrl: mapsUrl(to),
    highlight: false,
    notes,
    mode,
    durationMin,
    costJPY,
    from,
    to,
  };
}

function isExpired(expiry: string): boolean {
  if (!expiry || expiry === "無期限") return false;
  const m = expiry.replace(/[./]/g, "-").match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return false;
  const iso = `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return iso < TODAY;
}

function coupon(c: Omit<Coupon, "expired"> & { expired?: boolean }): Coupon {
  return { ...c, expired: c.expired ?? isExpired(c.expiry) };
}

export const TRIP: TripData = {
  tripTitle: "東京 2026-10-25 ~ 11-04",
  theme: "Fan Fest × 演唱會 × 購物",
  startDate: "2026-10-25",
  endDate: "2026-11-04",
  flights: {
    outbound: {
      flightNo: "UO624",
      from: "澳門（經 HKG）",
      to: "HND T3",
      depart: "2026-10-25 23:55",
      arrive: "2026-10-26 04:45",
      notes: "澳門金巴／機場直達去 HKG，再 UO624 紅眼",
    },
    inbound: {
      flightNo: "CX505",
      from: "NRT T2",
      to: "澳門（經 HKG）",
      depart: "2026-11-04 18:00",
      arrive: "當日晚上",
      notes: "16:00 到成田 T2；國泰；到港後金巴返澳",
    },
  },
  openTasks: ["東橫兩間付款", "鬼怒川素泊（三餐自理）", "東武特急指定席 11/02+11/03"],
  days: [
    {
      date: "2026-10-25",
      weekday: "日",
      title: "澳門出發紅眼",
      city: "澳門",
      lat: 22.1987,
      lon: 113.5439,
      arrivalConstraint: "無",
      departureConstraint: "23:55 UO624 香港國際機場；建議 19:00 前到港珠澳澳門口岸",
      planA: [
        item("free", "17:30", "18:45", "出發前晚餐", "澳門市區", {
          notes: "喺澳門食完再出發，唔好指望機場晚餐。",
        }),
        transit("19:00", "21:10", "金巴＋B4", 130, 1400, "港珠澳澳門口岸", "香港國際機場", "金巴約 MOP/HK$65–70，轉 B4 約 HK$9.8。過關＋等車預留充足。日圓欄僅作佔位。"),
        item("activity", "21:10", "23:40", "辦理登機與候機", "香港國際機場", {
          notes: "UO624 紅眼，帶頸枕同耳塞。",
        }),
        item("flight", "23:55", "04:45+1", "UO624 紅眼飛羽田", "HKG → HND T3", {
          highlight: true,
          notes: "澳門出發經港珠澳。飛行約 3 小時 50 分，到埗日本時間 26 日 04:45。",
        }),
      ],
      planB: [
        item("meal", "16:00", "17:10", "提早晚餐", "澳門市區", {
          notes: "趕封關巴士就要提早食。",
        }),
        transit("17:40", "19:40", "澳門香港機場直達", 120, 5200, "澳門口岸", "香港國際機場海天", "直達禁區、免入香港關。末班約 20:30，票約 MOP 280。建議搭 18:30–19:30 班。"),
        item("activity", "19:40", "23:40", "機場候機（室內備案）", "香港國際機場", {
          notes: "直達巴士入海天後過關登機，避開地面交通。",
        }),
        item("flight", "23:55", "04:45+1", "UO624 紅眼飛羽田", "HKG → HND T3", {
          highlight: true,
          notes: "航班不變，只係提早過關。",
        }),
      ],
    },
    {
      date: "2026-10-26",
      weekday: "一",
      title: "初到＋新宿＋池袋",
      city: "東京",
      lat: 35.6896,
      lon: 139.7006,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "04:45 羽田空港 T3 出關後才可入城",
      departureConstraint: "晚上回神田秋葉原酒店休息",
      planA: [
        item("activity", "04:45", "06:00", "抵達＋出關", "羽田空港 第3航廈", {
          notes: "紅眼入境。提款、西瓜卡可在航廈搞掂。",
        }),
        transit("06:00", "07:00", "京急＋JR", 50, 580, "羽田空港 T3", "淺草橋", "京急機場快特→品川，轉 JR 至秋葉原，再行去淺草橋。"),
        item("hotel", "07:00", "08:10", "寄行李＋早餐", "東橫INN 神田秋葉原", {
          notes: "CI 通常 16:00，早到寄袋。酒店早餐約 06:30–09:00。",
        }),
        transit("08:20", "08:50", "JR 總武線快速", 20, 200, "秋葉原", "新宿", "快速約 16 分。"),
        item("activity", "09:00", "10:20", "伊勢丹", "伊勢丹新宿店", {
          highlight: true,
          notes: "本館。小田急、京王就喺附近，有券可順路。",
        }),
        transit("10:20", "10:30", "步行", 8, 0, "伊勢丹新宿店", "Alpen Tokyo", "東南口方向。"),
        item("activity", "10:30", "11:15", "Alpen Tokyo", "Alpen Tokyo", {
          highlight: true,
          notes: "免稅再折 5%，2026/12/31 前。",
        }),
        transit("11:15", "11:25", "步行", 8, 0, "Alpen Tokyo", "ビックカメラ 新宿東口", ""),
        item("activity", "11:25", "12:40", "BicCamera", "ビックカメラ 新宿東口", {
          highlight: true,
          notes: "Bic 券 10/31 到期，今日用得切。",
        }),
        item("meal", "12:40", "13:20", "午餐", "ルミネ新宿", { notes: "食街，出站即食。" }),
        item("activity", "13:25", "14:15", "剪頭髮", "新宿", {
          notes: "店未指定，預早預約。紅眼當日唔好排太長。",
        }),
        transit("14:25", "14:40", "JR 山手線", 10, 170, "新宿", "池袋", "北行約 8 分。"),
        item("activity", "14:45", "16:15", "池袋 PARCO", "池袋パルコ", {
          highlight: true,
          notes: "室內。樓層多，睇體力。",
        }),
        item("activity", "16:20", "17:30", "Yodobashi 池袋", "ヨドバシカメラ マルチメディア池袋", {
          notes: "同 PARCO 都喺池袋站一帶。",
        }),
        item("meal", "17:35", "18:15", "晚餐", "池袋", { notes: "簡單食完即返，補紅眼。"}),
        transit("18:25", "18:55", "JR 山手線", 22, 200, "池袋", "秋葉原", ""),
        item("hotel", "19:00", "22:00", "入住休息", "東橫INN 神田秋葉原", {
          notes: "10/26–30 連住。早瞓。",
        }),
      ],
      planB: [
        item("activity", "04:45", "06:00", "抵達＋出關", "羽田空港 第3航廈", { notes: "同方案 A。" }),
        transit("06:00", "07:00", "京急＋JR", 50, 580, "羽田空港 T3", "淺草橋", ""),
        item("hotel", "07:00", "10:00", "寄袋＋補眠", "東橫INN 神田秋葉原", {
          notes: "紅眼頂唔順就先瞓。問酒店可否早入房。",
        }),
        transit("10:10", "10:40", "JR 總武線快速", 20, 200, "秋葉原", "新宿", ""),
        item("activity", "10:45", "12:30", "伊勢丹（室內）", "伊勢丹新宿店", { highlight: true, notes: "落雨都係室內。" }),
        item("meal", "12:30", "13:15", "午餐", "ルミネ新宿", {}),
        item("activity", "13:20", "14:10", "剪頭髮", "新宿", { notes: "室內。店未指定。" }),
        item("activity", "14:20", "15:20", "BicCamera", "ビックカメラ 新宿東口", { highlight: true, notes: "Alpen 可改明日體力好先去。" }),
        transit("15:30", "15:45", "JR 山手線", 10, 170, "新宿", "池袋", ""),
        item("activity", "15:50", "17:20", "池袋 PARCO", "池袋パルコ", { highlight: true, notes: "全室內，Yodobashi 睇時間先加。" }),
        transit("17:30", "18:00", "JR 山手線", 22, 200, "池袋", "秋葉原", ""),
        item("meal", "18:10", "19:00", "晚餐", "秋葉原", {}),
        item("hotel", "19:10", "22:00", "休息", "東橫INN 神田秋葉原", {}),
      ],
    },
    {
      date: "2026-10-27",
      weekday: "二",
      title: "豐洲＋ユーフォ",
      city: "東京",
      lat: 35.6498,
      lon: 139.7898,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "teamLab 要預先買 09:00 時段",
      departureConstraint: "20:25 丸之內 Piccadilly；散場後回酒店",
      planA: [
        item("meal", "07:15", "07:45", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("07:50", "08:40", "JR＋百合海鷗", 40, 330, "淺草橋", "新豊洲", "淺草橋→新橋，轉ゆりかもめ。"),
        item("activity", "09:00", "11:00", "teamLab Planets", "チームラボプラネッツ TOKYO DMM", {
          highlight: true,
          notes: "預早買時段。赤腳涉水，帶短襪同毛巾。室內。",
        }),
        transit("11:00", "11:15", "步行", 12, 0, "teamLab Planets", "豊洲 千客万来", "有蓋通道。"),
        item("meal", "11:15", "13:00", "午餐", "豊洲 千客万来", {
          highlight: true,
          notes: "市場食堂或拉麵橫丁。溫泉有時間先加。",
        }),
        transit("13:00", "13:20", "步行／百合海鷗", 15, 190, "豊洲 千客万来", "ららぽーと豊洲", "一站或步行。"),
        item("activity", "13:20", "17:00", "LaLaport 豐洲", "ららぽーと豊洲", {
          highlight: true,
          notes: "全室內購物。",
        }),
        item("activity", "17:10", "18:20", "海邊散步", "豊洲ぐるり公園", {
          notes: "傍晚行海濱。大風就縮短，直接去戲院。",
        }),
        transit("18:30", "19:15", "百合海鷗＋步行", 35, 370, "豊洲", "有楽町", "ゆりかもめ至新橋，行去有楽町マリオン。"),
        item("meal", "19:15", "20:05", "晚餐", "有楽町マリオン", { notes: "開場前食完。戲約 127 分，散場約 22:35。" }),
        item("activity", "20:25", "22:35", "最終楽章 響け！ユーフォニアム", "丸の内ピカデリー", {
          highlight: true,
          notes: "後編，20:25 場，約 127 分。有楽町マリオン 9F。預早買票。",
        }),
        transit("22:45", "23:10", "JR 京濱東北", 18, 170, "有楽町", "秋葉原", "直達後行返酒店。"),
      ],
      planB: [
        item("meal", "07:30", "08:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("08:05", "08:55", "JR＋百合海鷗", 40, 330, "淺草橋", "豊洲", "落雨跳過海邊。"),
        item("activity", "09:00", "11:00", "teamLab Planets", "チームラボプラネッツ TOKYO DMM", {
          highlight: true,
          notes: "室內。時段取消就改全日 LaLaport。",
        }),
        item("meal", "11:15", "12:30", "午餐", "ららぽーと豊洲", {}),
        item("activity", "12:30", "17:00", "LaLaport 豐洲", "ららぽーと豊洲", {
          highlight: true,
          notes: "全室內，當落雨主場。",
        }),
        transit("17:15", "18:00", "百合海鷗＋JR", 40, 400, "豊洲", "有楽町", ""),
        item("meal", "18:10", "19:40", "晚餐", "有楽町マリオン", { notes: "唔行海邊，早到戲院避雨。" }),
        item("activity", "20:25", "22:35", "最終楽章 響け！ユーフォニアム", "丸の内ピカデリー", {
          highlight: true,
          notes: "戲院室內，場次不變。",
        }),
        transit("22:45", "23:10", "JR 京濱東北", 18, 170, "有楽町", "秋葉原", ""),
      ],
    },
    {
      date: "2026-10-28",
      weekday: "三",
      title: "神宮＋原宿＋秋葉原",
      city: "東京",
      lat: 35.6694,
      lon: 139.7029,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "無",
      departureConstraint: "晚上回秋葉原酒店",
      planA: [
        item("meal", "08:00", "08:40", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("08:50", "09:25", "JR 山手線", 25, 210, "秋葉原", "原宿", "經東京方向或新宿方向都行，約 25 分。"),
        item("activity", "09:30", "11:10", "明治神宮", "明治神宮", {
          highlight: true,
          notes: "免費。上午人少過午後。行參道同本殿。大雨改 Plan B。",
        }),
        transit("11:15", "11:30", "步行", 10, 0, "明治神宮", "原宿クエスト", "出原宿站一側。"),
        item("meal", "11:30", "12:30", "午餐", "原宿", { notes: "QUEST 或竹下通附近。" }),
        item("activity", "12:30", "15:00", "原宿 QUEST＋周邊", "原宿クエスト", {
          highlight: true,
          notes: "中午至下午購物。竹下通人多就留喺 QUEST、Laforet。",
        }),
        transit("15:10", "15:40", "JR 山手線", 25, 210, "原宿", "上野", "約 25 分。"),
        item("activity", "15:45", "17:05", "OS Drug 上野", "OSドラッグ 上野店", {
          highlight: true,
          notes: "アメ横，上野 6-11-5。10:00–19:45。藥妝券可用。",
        }),
        transit("17:10", "17:20", "JR 山手線", 6, 150, "上野", "秋葉原", "一站。"),
        item("activity", "17:25", "19:00", "秋葉原購物", "秋葉原中央通", {
          highlight: true,
          notes: "Yodobashi、Animate。袋唔好太重。",
        }),
        item("meal", "19:05", "20:10", "晚餐", "秋葉原", {}),
      ],
      planB: [
        item("meal", "08:15", "08:50", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("09:00", "09:30", "JR 山手線", 25, 210, "秋葉原", "原宿", "大雨縮短神宮，改以原宿室內為主。"),
        item("activity", "09:35", "10:20", "明治神宮（短）", "明治神宮", {
          notes: "細雨可撐傘行本殿即走。大雨就取消。",
        }),
        item("activity", "10:30", "12:30", "原宿 QUEST", "原宿クエスト", {
          highlight: true,
          notes: "全室內。",
        }),
        item("meal", "12:30", "13:20", "午餐", "原宿クエスト", {}),
        item("activity", "13:20", "15:00", "ラフォーレ原宿", "ラフォーレ原宿", { highlight: true, notes: "室內續行。" }),
        transit("15:10", "15:40", "JR 山手線", 25, 210, "原宿", "上野", ""),
        item("activity", "15:45", "17:00", "OS Drug 上野", "OSドラッグ 上野店", {
          highlight: true,
          notes: "舖內購物，唔使入上野公園。",
        }),
        transit("17:10", "17:20", "JR", 6, 150, "上野", "秋葉原", ""),
        item("activity", "17:25", "19:00", "秋葉原室內", "ヨドバシカメラ 秋葉原", { notes: "行完即食。" }),
        item("meal", "19:05", "20:00", "晚餐", "秋葉原", {}),
      ],
    },
    {
      date: "2026-10-29",
      weekday: "四",
      title: "立川電影＋昭和公園",
      city: "立川",
      lat: 35.703,
      lon: 139.407,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "09:00 立川 Cinema City，要早出門",
      departureConstraint: "晚上去澀谷，之後回秋葉原",
      planA: [
        item("meal", "07:10", "07:40", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("07:45", "08:45", "JR 中央線快速", 50, 580, "御茶ノ水", "立川", "秋葉原行去御茶之水轉中央線快速，約 40 分車程。"),
        item("activity", "09:00", "10:59", "青春ブタ野郎はディアフレンドの夢を見ない", "立川シネマシティ", {
          highlight: true,
          notes: "立川站北口。預早買票。",
        }),
        transit("11:05", "11:20", "多摩都市モノレール", 12, 200, "立川北", "立飛", "北口行去立川北站。"),
        item("activity", "11:20", "14:30", "LaLaport 立川立飛", "ららぽーと立川立飛", {
          highlight: true,
          notes: "購物同午餐都喺商場搞掂。",
        }),
        transit("14:35", "15:05", "モノレール＋步行", 25, 200, "立飛", "昭和記念公園", "返立川再行去立川口。"),
        item("activity", "15:05", "18:40", "昭和記念公園", "国営昭和記念公園", {
          highlight: true,
          notes: "秋季祭典、銀杏、入夜活動視當日公告。10 月底銀杏可能未全黃。門票約 ¥450。",
        }),
        transit("18:50", "19:45", "JR 中央線＋山手", 45, 500, "立川", "渋谷", "中央線至新宿，轉山手一站。"),
        item("activity", "19:50", "20:20", "澀谷夜景", "渋谷スクランブル交差点", {
          notes: "短停影十字路口，唔好再加長購物。",
        }),
        item("meal", "20:20", "21:10", "晚餐", "渋谷", { notes: "站內或道玄坂，食完即返。" }),
        transit("21:20", "21:55", "JR 山手線", 25, 210, "渋谷", "秋葉原", ""),
      ],
      planB: [
        item("meal", "07:10", "07:40", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("07:45", "08:45", "JR 中央線快速", 50, 580, "御茶ノ水", "立川", ""),
        item("activity", "09:00", "10:59", "青春ブタ野郎はディアフレンドの夢を見ない", "立川シネマシティ", {
          highlight: true,
          notes: "戲院室內，場次不變。",
        }),
        transit("11:05", "11:20", "多摩都市モノレール", 12, 200, "立川北", "立飛", ""),
        item("meal", "11:25", "12:20", "午餐", "ららぽーと立川立飛", {}),
        item("activity", "12:20", "14:30", "LaLaport 立川立飛", "ららぽーと立川立飛", {
          highlight: true,
          notes: "落雨主場，全室內。",
        }),
        item("activity", "14:45", "16:00", "昭和記念公園（短）", "国営昭和記念公園", {
          notes: "大雨就取消公園，直接去澀谷室內。細雨可入花木園溫室。",
        }),
        transit("16:15", "17:10", "JR 中央線＋山手", 45, 500, "立川", "渋谷", ""),
        item("activity", "17:15", "19:30", "渋谷スクランブルスクエア", "渋谷スクランブルスクエア", {
          highlight: true,
          notes: "室內頂替公園夜晚。",
        }),
        item("meal", "19:30", "20:20", "晚餐", "渋谷ヒカリエ", {}),
        transit("20:30", "21:05", "JR 山手線", 25, 210, "渋谷", "秋葉原", ""),
      ],
    },
    {
      date: "2026-10-30",
      weekday: "五",
      title: "拉麵祭＋Cross Store",
      city: "東京",
      lat: 35.6256,
      lon: 139.6617,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "無",
      departureConstraint: "今晚仍住神田；明早 checkout",
      planA: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:00", "11:00", "JR＋東急田園都市線", 50, 280, "秋葉原", "駒沢大学", "秋葉原→澀谷，轉田園都市線。"),
        item("activity", "11:00", "15:30", "東京拉麵祭", "駒沢オリンピック公園", {
          highlight: true,
          notes: "室外為主。帶現金、濕紙巾、遮。人潮大，先食再影。",
        }),
        transit("15:40", "16:30", "東急＋JR 山手", 40, 280, "駒沢大学", "池袋", "返澀谷轉山手北行。"),
        item("activity", "16:30", "18:00", "行店", "Animate 池袋本店", {
          highlight: true,
          notes: "本店樓層多。買完再行去 Sunshine。",
        }),
        transit("18:00", "18:15", "步行", 12, 0, "Animate 池袋本店", "サンシャインシティ", "東池袋，約 10–15 分。"),
        item("meal", "18:15", "19:00", "晚餐", "サンシャインシティ", { notes: "食完上 3 樓，店 21:00 關門。" }),
        item("activity", "19:00", "21:00", "Bandai Namco Cross Store", "バンダイナムコ Cross Store 東京", {
          highlight: true,
          notes: "Sunshine 世界進口商場 3F。10:00–21:00，全年無休。",
        }),
        item("activity", "21:00", "22:00", "池ハロ Night", "サンシャインシティ", {
          notes: "Cross Store 打烊後先行。室內為主，視人流。",
        }),
        transit("22:10", "22:40", "JR 山手線", 22, 200, "池袋", "秋葉原", "末班前好充足。"),
      ],
      planB: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:30", "11:10", "JR 山手線", 25, 200, "秋葉原", "池袋", "落雨取消室外拉麵祭。"),
        item("activity", "11:15", "13:00", "Sunshine 水族館", "サンシャイン水族館", {
          highlight: true,
          notes: "全室內。可現場或提早網上票。",
        }),
        item("meal", "13:00", "14:00", "午餐", "サンシャインシティ", {}),
        item("activity", "14:00", "16:00", "Animate 池袋本店", "Animate 池袋本店", {
          highlight: true,
          notes: "全室內。",
        }),
        transit("16:00", "16:15", "步行", 12, 0, "Animate 池袋本店", "サンシャインシティ", ""),
        item("activity", "16:15", "18:15", "Bandai Namco Cross Store", "バンダイナムコ Cross Store 東京", {
          highlight: true,
          notes: "Sunshine 3F，室內。21:00 關門，下午場時間鬆。",
        }),
        item("meal", "18:15", "19:00", "晚餐", "サンシャインシティ", {}),
        item("activity", "19:00", "21:00", "池ハロ（室內場）", "サンシャインシティ", {
          notes: "改行商場內活動，少企室外廣場。",
        }),
        transit("21:15", "21:45", "JR 山手線", 22, 200, "池袋", "秋葉原", ""),
      ],
    },
    {
      date: "2026-10-31",
      weekday: "六",
      title: "Fan Fest Day 1",
      city: "千葉",
      lat: 35.6483,
      lon: 140.0346,
      stay: "Livemax 蘇我駅前",
      arrivalConstraint: "要先寄走神田大袋；蘇我酒店只帶當日袋",
      departureConstraint: "晚上住蘇我，方便 D2 早場",
      planA: [
        item("hotel", "08:30", "09:30", "Check out，大袋寄走／暫存", "東橫INN 神田秋葉原", {
          notes: "大袋寄去 11/01 東橫INN 秋葉淺草橋，或酒店暫存。只帶當日袋去蘇我。",
        }),
        transit("09:30", "10:30", "JR 總武快速＋內房", 50, 820, "秋葉原", "蘇我", "總武快速至千葉，轉內房一線至蘇我。"),
        item("hotel", "10:30", "10:50", "入酒店（只帶當日袋）", "ホテルリブマックス千葉蘇我駅前", {
          notes: "駅前 1 分鐘。放袋即走。",
        }),
        transit("10:50", "11:15", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", "直達幕張メッセ最近駅。"),
        item("activity", "11:15", "20:30", "Fan Fest Day 1", "幕張メッセ", {
          highlight: true,
          notes: "FF14 Fan Festival。20:30 結束。室內。帶證、水、行動電源。",
        }),
        transit("20:45", "21:05", "JR 京葉線", 15, 200, "海浜幕張", "蘇我", "散場人多，預多時間出站。"),
        item("meal", "21:15", "22:15", "晚餐", "蘇我駅前", {
          notes: "駅前食肆。早瞓備戰 D2 THE PRIMALS。",
        }),
        item("hotel", "22:15", "23:00", "入住", "ホテルリブマックス千葉蘇我駅前", {}),
      ],
      planB: [
        item("hotel", "08:30", "09:30", "Check out，寄大袋", "東橫INN 神田秋葉原", {
          notes: "同方案 A。活動本身係室內，備案只加緩衝。",
        }),
        transit("09:40", "10:40", "JR 總武快速＋內房", 50, 820, "秋葉原", "蘇我", "落雨多 10 分鐘出酒店。"),
        item("hotel", "10:40", "11:00", "入酒店放袋", "ホテルリブマックス千葉蘇我駅前", {}),
        transit("11:00", "11:20", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", ""),
        item("activity", "11:20", "20:30", "Fan Fest Day 1", "幕張メッセ", {
          highlight: true,
          notes: "20:30 結束。活動室內。要避開會場先去イオンモール幕張新都心。",
        }),
        transit("20:45", "21:05", "JR 京葉線", 15, 200, "海浜幕張", "蘇我", ""),
        item("meal", "21:15", "22:15", "晚餐", "蘇我駅前", {}),
      ],
    },
    {
      date: "2026-11-01",
      weekday: "日",
      title: "Fan Fest Day 2",
      city: "千葉",
      lat: 35.6483,
      lon: 140.0346,
      stay: "東橫INN 秋葉淺草橋",
      arrivalConstraint: "D2 早場；蘇我 09:10 出發",
      departureConstraint: "20:30 散場後轉住淺草橋，取回大袋",
      planA: [
        transit("09:10", "09:30", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", "住駅前，出門即上車。"),
        item("activity", "09:30", "20:30", "Fan Fest Day 2 THE PRIMALS", "幕張メッセ", {
          highlight: true,
          notes: "THE PRIMALS。20:30 結束。提早入座／排隊。散場人多。",
        }),
        transit("20:45", "22:05", "京葉線＋JR", 75, 820, "海浜幕張", "淺草橋", "京葉至東京，轉總武。預多 15 分出站。"),
        item("hotel", "22:05", "22:30", "入酒店（取回大袋）", "東橫INN 秋葉淺草橋", {
          notes: "11/01 同 11/03 住呢間。確認大袋已到。",
        }),
        item("meal", "22:30", "23:15", "晚餐", "淺草橋／秋葉原", {
          notes: "散場後簡單食或便利店。明日 08:00 出發日光。",
        }),
      ],
      planB: [
        transit("09:10", "09:30", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", ""),
        item("activity", "09:30", "20:30", "Fan Fest Day 2 THE PRIMALS", "幕張メッセ", {
          highlight: true,
          notes: "20:30 先完。演出仍係主軸。戶外排隊遇雨用會場連廊。",
        }),
        transit("20:45", "22:05", "京葉線＋JR", 75, 820, "海浜幕張", "淺草橋", ""),
        item("hotel", "22:05", "22:30", "入酒店取袋", "東橫INN 秋葉淺草橋", {}),
        item("meal", "22:30", "23:15", "晚餐", "淺草橋", { notes: "簡單食。明日 08:00 日光。" }),
      ],
    },
    {
      date: "2026-11-02",
      weekday: "一",
      title: "日光社寺＋鬼怒川",
      city: "日光",
      lat: 36.7581,
      lon: 139.5995,
      stay: "Tabist 鬼怒川パークコテージ",
      arrivalConstraint: "東武特急指定席；淺草 08:00 出發",
      departureConstraint: "旅館遲 CI，要預先講；今晚住鬼怒川",
      planA: [
        transit("08:00", "10:10", "東武特急（指定席）", 125, 2940, "淺草", "東武日光", "Spacia X／Revaty。指定席要提早買。"),
        transit("10:10", "10:30", "東武巴士", 15, 350, "東武日光", "神橋", "世界遺產巴士，下車即見神橋。"),
        item("activity", "10:30", "12:30", "神橋＋東照宮", "日光東照宮", {
          highlight: true,
          notes: "陽明門、三猿、眠貓。陽明門維修要查當日告示。",
        }),
        item("meal", "12:30", "13:30", "午餐", "東照宮表參道", {
          notes: "湯葉定食或烤鱒魚。表參道有蓋店鋪。",
        }),
        item("activity", "13:30", "16:10", "輪王寺＋二荒山", "輪王寺", {
          highlight: true,
          notes: "三社寺套票划算。二荒山石階視體力。",
        }),
        transit("16:15", "16:45", "東武巴士", 20, 350, "東照宮", "東武日光駅", ""),
        item("meal", "17:30", "19:00", "晚飯", "東武日光駅前", {
          notes: "駅前鄉土料理。轉車前食飽，旅館素泊無晚餐。",
        }),
        transit("19:10", "19:50", "東武線", 35, 760, "東武日光", "鬼怒川温泉", "特急或普通。"),
        item("hotel", "19:50", "20:20", "入旅館（遲 CI）", "Tabist 鬼怒川パークコテージ", {
          highlight: true,
          notes: "素泊、三餐自理。遲 CI 必須預先講。自助／超商解決宵夜。",
        }),
      ],
      planB: [
        transit("08:00", "10:10", "東武特急（指定席）", 125, 2940, "淺草", "東武日光", "列車照坐，改室內動線。"),
        item("activity", "10:25", "12:00", "日光駅 世界遺產會館", "日光世界遺産会館", {
          notes: "室內展覽，等雨勢細再上山。",
        }),
        transit("12:10", "12:30", "東武巴士", 15, 350, "東武日光", "輪王寺", "先去有大殿嘅輪王寺。"),
        item("activity", "12:30", "14:00", "輪王寺（室內）", "輪王寺", {
          highlight: true,
          notes: "三佛堂室內。東照宮宝物館可加。",
        }),
        item("meal", "14:00", "15:00", "午餐", "東照宮表參道", { notes: "有蓋店鋪。" }),
        item("activity", "15:00", "16:00", "東照宮宝物館", "日光東照宮宝物館", {
          highlight: true,
          notes: "少行室外參道。陽明門外觀看雨勢決定。",
        }),
        transit("16:10", "16:50", "東武巴士＋電車", 40, 760, "東照宮", "鬼怒川温泉", "提早入旅館浸湯。"),
        item("hotel", "17:00", "19:00", "提早 CI＋溫泉", "Tabist 鬼怒川パークコテージ", {
          highlight: true,
          notes: "雨天把浸湯當主行程。",
        }),
        item("meal", "19:00", "20:00", "自理晚餐", "鬼怒川温泉駅前", {
          notes: "セブン／駅前食堂。素泊。",
        }),
      ],
    },
    {
      date: "2026-11-03",
      weekday: "二",
      title: "橫濱演唱會",
      city: "橫濱",
      lat: 35.4578,
      lon: 139.6322,
      stay: "東橫INN 秋葉淺草橋",
      arrivalConstraint: "鬼怒川早上 checkout；東武特急指定席回淺草",
      departureConstraint: "ぴあアリーナMM 17:00 開場；散場後返淺草橋",
      planA: [
        item("meal", "07:30", "08:15", "早餐", "セブンイレブン 鬼怒川立岩", {
          notes: "素泊。駅前 7-11。",
        }),
        item("hotel", "08:15", "09:40", "Check out", "Tabist 鬼怒川パークコテージ", {
          notes: "預留行去駅時間。確認鎖門同鑰匙。",
        }),
        transit("10:00", "12:35", "東武特急（指定席）", 150, 2940, "鬼怒川温泉", "淺草", "11/03 指定席。到淺草後轉北千住較順。"),
        item("meal", "12:35", "12:55", "車站速食", "淺草駅／北千住", {
          notes: "只係墊肚，正餐留去みなとみらい。",
        }),
        transit("13:00", "14:15", "日比谷線＋東急東橫", 70, 580, "北千住", "みなとみらい", "日比谷直通東橫至みなとみらい。時間緊，唔好喺淺草逗留。"),
        item("free", "14:20", "16:00", "會場周邊＋早晚餐", "みなとみらい Queen's Square", {
          notes: "Queen's Square／MARK IS 室內。開場前食飽。",
        }),
        item("activity", "16:00", "17:00", "會場附近等開場", "ぴあアリーナMM", {
          notes: "確認入口、袋檢、周邊 enta。",
        }),
        item("activity", "17:00", "21:00", "赤色の響祭", "ぴあアリーナMM", {
          highlight: true,
          notes: "室內演唱會。散場人潮大，預先記新高島／櫻木町出口。",
        }),
        transit("21:15", "22:30", "東急東橫＋日比谷／JR", 70, 700, "新高島／櫻木町", "淺草橋", "末班足夠。可北千住轉。"),
        item("hotel", "22:30", "23:30", "回酒店", "東橫INN 秋葉淺草橋", {
          notes: "明日伴手禮＋回程。",
        }),
      ],
      planB: [
        item("meal", "07:30", "08:15", "早餐", "セブンイレブン 鬼怒川立岩", {}),
        item("hotel", "08:15", "09:40", "Check out", "Tabist 鬼怒川パークコテージ", {}),
        transit("10:00", "12:35", "東武特急（指定席）", 150, 2940, "鬼怒川温泉", "淺草", ""),
        transit("12:50", "14:10", "日比谷線＋東急東橫", 75, 580, "北千住", "みなとみらい", "落雨唔好行淺草室外。"),
        item("activity", "14:10", "16:00", "Landmark／Queen's Square 室內", "横浜ランドマークタワー", {
          highlight: true,
          notes: "全室內殺時間。展望台可選。",
        }),
        item("meal", "15:30", "16:20", "早晚餐", "Queen's Square 横浜", {
          notes: "開場前食完。",
        }),
        item("activity", "16:30", "21:00", "赤色の響祭", "ぴあアリーナMM", {
          highlight: true,
          notes: "演唱會室內，風雨唔影響。",
        }),
        transit("21:15", "22:30", "東急東橫＋日比谷", 70, 700, "新高島", "淺草橋", ""),
      ],
    },
    {
      date: "2026-11-04",
      weekday: "三",
      title: "MAPPA＋伴手禮回程",
      city: "東京",
      lat: 35.6812,
      lon: 139.7671,
      arrivalConstraint: "10:30 MAPPA 入場；早上退房淺草橋",
      departureConstraint: "16:00 到成田 T2；CX505 18:00",
      planA: [
        item("hotel", "08:15", "08:45", "Check out", "東橫INN 秋葉淺草橋", {
          notes: "大袋帶住。手信留到東京駅先買。",
        }),
        transit("08:50", "09:15", "JR 京濱東北", 18, 170, "秋葉原", "有楽町", "淺草橋行一站秋葉原再轉。"),
        item("free", "09:20", "10:25", "入場緩衝", "YURAKUCHO MUSEUM 東京国際フォーラム", {
          notes: "09:45 前到。10:30 入場，預早買時段票。",
        }),
        item("activity", "10:30", "12:00", "MAPPA EXPO", "YURAKUCHO MUSEUM 東京国際フォーラム", {
          highlight: true,
          notes: "約中午離場。最後入場平日約 17:30，但今日要趕機，12:00 必須走。",
        }),
        transit("12:05", "12:20", "步行", 12, 0, "東京国際フォーラム", "東京駅", "地下街或丸之內，約 10 分。"),
        item("activity", "12:20", "13:15", "伴手禮", "東京駅一番街", {
          highlight: true,
          notes: "Kit Kat、ROYCE、東京香蕉。液體記住安檢。",
        }),
        item("meal", "13:15", "13:45", "午餐", "東京駅 GRANSTA", { notes: "食完即去月台。" }),
        transit("13:55", "15:15", "成田エクスプレス", 65, 3250, "東京駅", "成田空港 T2", "N'EX 指定席。目標 16:00 前入航廈。"),
        item("activity", "15:15", "17:40", "辦理登機＋免稅", "成田空港 第2航廈", {
          highlight: true,
          notes: "成田免稅券 95 折。16:00 到場，18:00 起飛。",
        }),
        item("flight", "18:00", "22:00", "CX505 返澳（經香港）", "NRT T2 → HKG", {
          highlight: true,
          notes: "國泰。約 21:20–22:00 到 HKG，再金巴返澳門。",
        }),
        transit("22:20", "00:20+1", "B4＋金巴返澳門", 120, 1400, "香港國際機場", "港珠澳澳門口岸", "趕唔切機場直達末班（約 21:30）就用金巴通宵。日圓欄僅作佔位。"),
      ],
      planB: [
        item("hotel", "08:00", "08:30", "提早 Check out", "東橫INN 秋葉淺草橋", {
          notes: "風雨或展覽排隊就縮短 MAPPA。",
        }),
        transit("08:35", "09:00", "JR 京濱東北", 18, 170, "秋葉原", "有楽町", ""),
        item("activity", "10:30", "11:30", "MAPPA EXPO（短）", "YURAKUCHO MUSEUM 東京国際フォーラム", {
          highlight: true,
          notes: "只行一小時，確保趕得切 N'EX。",
        }),
        transit("11:35", "11:50", "步行", 12, 0, "東京国際フォーラム", "東京駅", ""),
        item("activity", "11:50", "12:30", "伴手禮（全室內）", "東京駅一番街", { notes: "唔出丸之內室外。" }),
        item("meal", "12:30", "13:00", "午餐", "東京駅 GRANSTA", {}),
        transit("13:10", "14:30", "成田エクスプレス（早班）", 65, 3250, "東京駅", "成田空港 T2", "提早一班。"),
        item("activity", "14:30", "17:40", "免稅＋候機", "成田空港 第2航廈", {
          highlight: true,
          notes: "多餘時間留喺禁區。",
        }),
        item("flight", "18:00", "22:00", "CX505 返澳（經香港）", "NRT T2 → HKG", {
          highlight: true,
          notes: "航班不變。",
        }),
        transit("22:10", "23:40", "機場直達／金巴返澳門", 90, 1400, "香港國際機場", "澳門口岸", "提早班較有機會搭到直達巴士；否則金巴通宵。"),
      ],
    },
  ],
  foods: [
    {
      name: "牛かつ もと村 秋葉原店",
      city: "東京",
      category: "炸牛排",
      reason: "上野買完藥一站到秋葉原，出餐快、外國人友善，適合 10/26 早午餐。",
      mapsQuery: "牛かつ もと村 秋葉原",
      priceBand: "¥1,200–1,800",
    },
    {
      name: "ジャンクガレッジ 秋葉原店",
      city: "東京",
      category: "拉麵",
      reason: "中央通行完好補，分量大，紅眼當日晚餐夠飽。",
      mapsQuery: "ジャンクガレッジ 秋葉原",
      priceBand: "¥1,000–1,500",
    },
    {
      name: "麺屋武蔵 武骨 新宿店",
      city: "東京",
      category: "拉麵",
      reason: "新宿電器同 Alpen 行完可走去，濃厚魚介豚骨，夜晚觀光客龍較短。",
      mapsQuery: "麺屋武蔵 武骨 新宿",
      priceBand: "¥1,000–1,400",
    },
    {
      name: "豊洲 千客万来 ラーメン横丁",
      city: "東京",
      category: "市場食堂",
      reason: "teamLab 完場步行可達，多家名店輪替，比築地容易入座。",
      mapsQuery: "豊洲 千客万来",
      priceBand: "¥1,000–2,000",
    },
    {
      name: "日光湯波料理 梅の家",
      city: "日光",
      category: "鄉土料理",
      reason: "東照宮表參道，湯葉定食同社寺行程夾，比駅前更近參觀動線。",
      mapsQuery: "日光湯波料理 梅の家",
      priceBand: "¥1,500–2,800",
    },
  ],
  coupons: [
    coupon({
      name: "Donki唐吉訶德",
      discount: "滿額免稅，最高再折7%",
      expiry: "無期限",
      tags: ["綜合"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-9",
      final_url: "https://japanportal.donki-global.com/coupon/?ptcd=0076003303",
      kind: "page",
    }),
    coupon({
      name: "Bic Camera",
      discount: "滿額免稅，最高再折7%",
      expiry: "2026/10/31",
      tags: ["電器"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-1",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/BicCamera_260820.png",
      kind: "image",
    }),
    coupon({
      name: "SALONIA",
      discount: "購買指定商品，享有95折優惠（需與 Bic Camera優惠券 一同使用）",
      expiry: "2026/11/30",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-19",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/salonia_260820.jpg",
      kind: "image",
    }),
    coupon({
      name: "愛電王Edion",
      discount: "滿額免稅，最高再折7%",
      expiry: "2026/12/31",
      tags: ["電器"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-10",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/edion2025.jpg",
      kind: "image",
    }),
    coupon({
      name: "Laox",
      discount: "滿額免稅，再折8%",
      expiry: "2026/10/31",
      tags: ["電器"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-15",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/LAOX_2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "成田機場免稅店",
      discount: "享有95折優惠",
      expiry: "2027/3/31",
      tags: ["機場", "免稅"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-16",
      final_url: "https://duty-free-japan.jp/narita/ta/content/coupon2833-30.html",
      kind: "page",
    }),
    coupon({
      name: "成田/羽田機場 免稅商品線上訂",
      discount: "享有95折優惠",
      expiry: "無期限",
      tags: ["機場", "免稅"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-17",
      final_url: "https://duty-free-japan.jp/qrposter/tc/?agentid=123",
      kind: "page",
    }),
    coupon({
      name: "SUNDRUG",
      discount: "滿額免稅，再享3~7%折扣",
      expiry: "無期限",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/b2s50T",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/sundrug%20_funtime.jpg",
      kind: "image",
    }),
    coupon({
      name: "鶴羽藥妝",
      discount: "滿額免稅，最高享免稅+7%優惠",
      expiry: "2027/12/31",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-11",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/tsuruha2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "札幌藥妝",
      discount: "滿額免稅，最高享免稅+7%優惠",
      expiry: "無期限",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-13",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/2026sapporo.jpg",
      kind: "image",
    }),
    coupon({
      name: "cosmos",
      discount: "滿額免稅，最高享免稅+9%優惠",
      expiry: "2026/12/31",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/DsrcXF",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/cosmos2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "DRUG ELEVEN",
      discount: "滿額免稅，最高享免稅+7%優惠",
      expiry: "2027/2/28",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-22",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/DRUGELEVEN_2027.jpg",
      kind: "image",
    }),
    coupon({
      name: "小田急百貨",
      discount: "消費滿1千日圓(含稅)，可享6%優惠",
      expiry: "2028/3/31",
      tags: ["百貨"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-12",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/odakyu.png",
      kind: "image",
    }),
    coupon({
      name: "近鐵百貨店",
      discount: "滿2千日圓(不含稅)，可享有95折優惠",
      expiry: "2026/12/31",
      tags: ["百貨"],
      region: "關西",
      link: "https://funtime.tw/c/blog-68172-14",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/kintetsu2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "銀座樂天免稅店",
      discount: "滿1萬日圓，折1千日圓；滿2萬日圓，折2千日圓",
      expiry: "2027/1/31",
      tags: ["機場", "免稅"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-7",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/Lottedutyfree_GINZA_FunTime2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "大丸松坂屋",
      discount: "單筆消費含稅滿3千日圓，享95折",
      expiry: "2026/8/31",
      tags: ["百貨"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-6",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/daimaru_250820.pdf",
      kind: "page",
    }),
    coupon({
      name: "西武百貨",
      discount: "消費滿1千日圓，享95折",
      expiry: "2027/12/31",
      tags: ["百貨"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-2",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/seibu2027.jpg",
      kind: "image",
    }),
    coupon({
      name: "京王百貨",
      discount: "單筆消費滿3千日圓，享95折",
      expiry: "2027/3/31",
      tags: ["百貨"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-3",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/Keio_2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "Alpen",
      discount: "免稅再折5%",
      expiry: "2026/12/31",
      tags: ["運動"],
      region: null,
      link: "https://www.funtime.com.tw/travelstore/coupon/2026Alpen.png",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/2026Alpen.png",
      kind: "image",
    }),
    coupon({
      name: "Victoria運動用品",
      discount: "免稅再折5%",
      expiry: "2026/12/31",
      tags: ["運動"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-8",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/FunTime_Victoria_202612.jpg",
      kind: "image",
    }),
  ],
};

export const AI_FOOD_PROMPT = `你是日本旅遊美食顧問。只回 JSON array，不要 markdown、不要前言。
必須剛好 3 間餐廳，欄位僅限：name, city, category, reason, mapsQuery, priceBand。
reason 用繁體中文 1–2 句。priceBand 用日圓區間例如 "¥1,000–1,800"。
行程：澳門出發（經香港機場 UO624）東京 2026-10-25 至 11-04。10/26 新宿、池袋；10/27 豐洲 teamLab、有樂町睇戲；10/28 明治神宮、原宿、上野 OS Drug、秋葉原；10/29 立川電影院、LaLaport 立川立飛、昭和記念公園、晚上澀谷；10/30 駒澤拉麵祭、池袋；幕張 Fan Fest；日光；鬼怒川；橫濱演唱會；11/04 有樂町 MAPPA 後東京駅手信再去成田。
請推薦行程沿線、外國人友善、不必抽籤的店。`;
