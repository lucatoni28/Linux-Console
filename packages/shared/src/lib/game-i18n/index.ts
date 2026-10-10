/**
 * 游戏内翻译（引擎 + 游戏 UI 共用）
 *
 * 以中文原文为 key 的轻量翻译：
 *   tr("银两不足！")                    → 越南语译文（无译文时返回原文）
 *   tr("获得{name}", { name: "长剑" })  → 支持 {占位符}
 *
 * 游戏内容（对话、物品/武功/NPC 名称）使用 trc()，词典按游戏从
 * /i18n/vi/{gameSlug}.json 加载，见 loadGameContentDict()。
 *
 * 纯 TypeScript，不依赖 React，可在 @miu2d/engine 中使用。
 */

import { uiVi } from "./ui-vi";

export type GameLocale = "vi" | "zh";

/** 与 @miu2d/shared/i18n 的 i18next 缓存 key 保持一致 */
const LOCALE_STORAGE_KEY = "Miu2D_locale";

let forcedLocale: GameLocale | null = null;

/** 当前游戏语言：用户显式选择中文时为 zh，其余（含默认）为越南语 */
export function getGameLocale(): GameLocale {
  if (forcedLocale) return forcedLocale;
  try {
    const stored = globalThis.localStorage?.getItem(LOCALE_STORAGE_KEY);
    if (stored?.toLowerCase().startsWith("zh")) return "zh";
  } catch {
    // localStorage 不可用（隐私模式等），使用默认语言
  }
  return "vi";
}

/** 测试或嵌入场景下强制语言，传 null 恢复自动检测 */
export function setGameLocale(locale: GameLocale | null): void {
  forcedLocale = locale;
}

export type TrParams = Record<string, string | number | undefined | null>;

function interpolate(text: string, params?: TrParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (m, key: string) => {
    const v = params[key];
    return v === undefined || v === null ? m : String(v);
  });
}

/** 翻译界面文本（key 为中文原文） */
export function tr(zh: string, params?: TrParams): string {
  const text = getGameLocale() === "vi" ? (uiVi[zh] ?? zh) : zh;
  return interpolate(text, params);
}

// ============= 游戏内容词典 =============

let contentDict: Record<string, string> = {};
let contentDictSlug: string | null = null;

/**
 * 加载游戏内容词典：/i18n/vi/{gameSlug}.json
 * 格式：{ "中文原文": "Bản dịch", ... }；文件不存在时静默使用原文。
 */
export async function loadGameContentDict(gameSlug: string, baseUrl = ""): Promise<number> {
  if (contentDictSlug === gameSlug) return Object.keys(contentDict).length;
  contentDict = {};
  contentDictSlug = gameSlug;
  if (getGameLocale() !== "vi") return 0;
  try {
    const res = await fetch(`${baseUrl}/i18n/vi/${encodeURIComponent(gameSlug)}.json`);
    if (!res.ok) return 0;
    const data: unknown = await res.json();
    if (data && typeof data === "object") {
      contentDict = data as Record<string, string>;
    }
  } catch {
    // 词典缺失或解析失败：保持原文
  }
  return Object.keys(contentDict).length;
}

/** 直接注册内容译文（供编辑器/测试使用） */
export function registerGameContent(entries: Record<string, string>): void {
  Object.assign(contentDict, entries);
}

/** 翻译游戏内容（对话、名称、介绍）；无译文时返回原文 */
export function trc<T extends string | null | undefined>(text: T): T {
  if (!text || getGameLocale() !== "vi") return text;
  // 空字符串表示尚未翻译，回退原文
  const exact = contentDict[text];
  if (exact) return exact as T;
  const trimmed = text.trim();
  if (trimmed !== text) {
    const t = contentDict[trimmed];
    if (t) return text.replace(trimmed, t) as T;
  }
  return text;
}

/** 日期时间本地化格式 */
export function gameDateLocale(): string {
  return getGameLocale() === "vi" ? "vi-VN" : "zh-CN";
}
