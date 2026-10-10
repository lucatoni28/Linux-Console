#!/usr/bin/env node
/**
 * 提取游戏内容文本，生成 / 更新越南语内容词典
 * Trích xuất văn bản game và tạo / cập nhật từ điển tiếng Việt
 *
 * 词典供前端 trc() 使用：packages/web/public/i18n/vi/{gameSlug}.json
 * 格式：{ "中文原文": "Bản dịch tiếng Việt" }，空字符串表示尚未翻译（运行时回退原文）。
 *
 * 用法:
 *   # 1) 从运行中的 Miu2D 后端提取（对话、物品、武功、NPC、物体、角色名…）
 *   node scripts/extract-game-text.mjs --base http://localhost:4000 --game sword1
 *
 *   # 2) 额外扫描本地脚本目录中的内联文本（Say("…") / Choose("…") 等）
 *   node scripts/extract-game-text.mjs --base http://localhost:4000 --game sword1 --scripts ./resources/sword1/script
 *
 *   # 3) 用 Claude 自动翻译所有空条目（需要 @anthropic-ai/sdk 与 ANTHROPIC_API_KEY 或 `ant auth login`）
 *   node scripts/extract-game-text.mjs --base http://localhost:4000 --game sword1 --translate
 *
 * 选项:
 *   --base <url>       后端地址（提供 /game/{slug}/api/config 与 /api/data）
 *   --game <slug>      游戏标识：sword1 | demo（月影传说） | sword2 | …
 *   --scripts <dir>    可选：递归扫描 .txt/.lua 脚本中的中文字符串
 *   --out <file>       输出文件（默认 packages/web/public/i18n/vi/{slug}.json）
 *   --translate        调用 Claude 翻译空条目（已有译文不会被覆盖）
 *   --batch <n>        每次请求翻译的条目数（默认 80）
 *   --model <id>       Claude 模型（默认 claude-opus-5-5）
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CJK = /[\u3400-\u9fff]/;

function parseArgs(argv) {
  const args = { batch: 80, model: "claude-opus-5-5" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--translate") args.translate = true;
    else if (a.startsWith("--")) args[a.slice(2)] = argv[++i];
  }
  args.batch = Number(args.batch) || 80;
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (!args.game || (!args.base && !args.scripts && !args.translate)) {
  console.error("Cần --game và ít nhất một trong --base / --scripts / --translate. Xem đầu file để biết cách dùng.");
  process.exit(1);
}
const outFile = args.out ?? join(root, "packages/web/public/i18n/vi", `${args.game}.json`);

// ============= 读取现有词典 =============

/** @type {Record<string, string>} */
let dict = {};
if (existsSync(outFile)) {
  dict = JSON.parse(readFileSync(outFile, "utf8"));
}
/** 名称类条目（先翻译，作为对话翻译时的术语表） */
const nameKeys = new Set();

function add(text, isName = false) {
  if (typeof text !== "string") return;
  const t = text.trim();
  if (!t || !CJK.test(t)) return;
  if (!(t in dict)) dict[t] = "";
  if (isName) nameKeys.add(t);
}

// ============= 从后端 API 提取 =============

const NAME_FIELDS = new Set(["name", "gameName", "objName", "mapName", "displayName", "title"]);
const TEXT_FIELDS = new Set(["intro", "text", "desc", "description", "message"]);

/** 递归收集 JSON 中的名称与文本字段 */
function collect(value) {
  if (Array.isArray(value)) {
    for (const v of value) collect(v);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === "string") {
        if (NAME_FIELDS.has(k)) add(v, true);
        else if (TEXT_FIELDS.has(k)) add(v);
      } else {
        collect(v);
      }
    }
  }
}

async function fetchJson(path) {
  const url = `${args.base.replace(/\/+$/, "")}/game/${encodeURIComponent(args.game)}/api/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

if (args.base) {
  const before = Object.keys(dict).length;
  const config = await fetchJson("config");
  add(config?.gameName, true);
  const data = await fetchJson("data");
  collect(data);
  console.log(`API: +${Object.keys(dict).length - before} mục mới`);
}

// ============= 扫描脚本内联文本 =============

if (args.scripts) {
  const before = Object.keys(dict).length;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(txt|lua)$/i.test(name)) {
        let src = readFileSync(p);
        // 原版脚本多为 GBK 编码；Node 内置 TextDecoder 支持 gbk
        let text = src.toString("utf8");
        if (text.includes("\uFFFD")) text = new TextDecoder("gbk").decode(src);
        for (const m of text.matchAll(/"([^"\r\n]*)"/g)) add(m[1]);
      }
    }
  };
  walk(args.scripts);
  console.log(`Scripts: +${Object.keys(dict).length - before} mục mới`);
}

function save() {
  mkdirSync(dirname(outFile), { recursive: true });
  const sorted = Object.fromEntries(Object.entries(dict).sort(([a], [b]) => a.localeCompare(b, "zh")));
  writeFileSync(outFile, `${JSON.stringify(sorted, null, 2)}\n`);
}
save();

const pending = Object.keys(dict).filter((k) => !dict[k]);
console.log(`${outFile}: ${Object.keys(dict).length} mục, ${pending.length} chưa dịch`);

// ============= Claude 自动翻译 =============

if (args.translate && pending.length > 0) {
  let Anthropic;
  try {
    ({ default: Anthropic } = await import("@anthropic-ai/sdk"));
  } catch {
    console.error("Thiếu @anthropic-ai/sdk. Cài bằng: pnpm add -Dw @anthropic-ai/sdk");
    process.exit(1);
  }
  const client = new Anthropic();

  const SYSTEM = `Bạn là dịch giả game kiếm hiệp Trung Quốc sang tiếng Việt (bộ Kiếm Hiệp Tình Duyên của Kingsoft).
Quy tắc:
- Tên người, địa danh, môn phái, võ công, vật phẩm: dùng âm Hán-Việt chuẩn, viết hoa từng chữ (杨影枫 → Dương Ảnh Phong, 独孤剑 → Độc Cô Kiếm).
- Lời thoại: văn phong kiếm hiệp tự nhiên, xưng hô hợp ngữ cảnh (ta/ngươi, huynh/muội, tại hạ, cô nương...).
- Giữ nguyên mọi ký hiệu không phải chữ Hán: số, dấu xuống dòng, mã màu, thẻ <...>, ký tự đặc biệt, khoảng trắng đầu/cuối.
- Không thêm giải thích. Mỗi mục trả về đúng một bản dịch, cùng id.`;

  const schema = {
    type: "object",
    properties: {
      translations: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "integer" }, vi: { type: "string" } },
          required: ["id", "vi"],
          additionalProperties: false,
        },
      },
    },
    required: ["translations"],
    additionalProperties: false,
  };

  async function translateBatch(keys, glossary) {
    const items = keys.map((k, id) => ({ id, zh: k }));
    const glossaryText = glossary.length
      ? `Bảng thuật ngữ đã dịch (dùng thống nhất):\n${glossary.map(([zh, vi]) => `${zh} = ${vi}`).join("\n")}\n\n`
      : "";
    const stream = client.beta.messages.stream({
      model: args.model,
      max_tokens: 64000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      output_config: { format: { type: "json_schema", schema } },
      messages: [
        {
          role: "user",
          content: `${glossaryText}Dịch các mục sau sang tiếng Việt:\n${JSON.stringify(items, null, 1)}`,
        },
      ],
    });
    const message = await stream.finalMessage();
    if (message.stop_reason === "refusal") {
      throw new Error(`Bị từ chối: ${message.stop_details?.explanation ?? "không rõ lý do"}`);
    }
    if (message.stop_reason === "max_tokens") {
      throw new Error("Hết max_tokens, hãy giảm --batch");
    }
    const text = message.content.find((b) => b.type === "text")?.text ?? "";
    const { translations } = JSON.parse(text);
    let n = 0;
    for (const { id, vi } of translations) {
      if (keys[id] !== undefined && typeof vi === "string" && vi.trim()) {
        dict[keys[id]] = vi;
        n++;
      }
    }
    return n;
  }

  // 先翻译名称，再把名称作为术语表翻译对话/介绍
  const names = pending.filter((k) => nameKeys.has(k) || k.length <= 8);
  const texts = pending.filter((k) => !names.includes(k));
  const glossary = () =>
    Object.entries(dict).filter(([k, v]) => v && (nameKeys.has(k) || k.length <= 8));

  for (const [label, list] of [
    ["tên", names],
    ["văn bản", texts],
  ]) {
    for (let i = 0; i < list.length; i += args.batch) {
      const keys = list.slice(i, i + args.batch);
      try {
        const n = await translateBatch(keys, label === "tên" ? [] : glossary());
        console.log(`Dịch ${label} ${i + keys.length}/${list.length} (+${n})`);
      } catch (e) {
        console.error(`Lỗi lô ${label} ${i}: ${e instanceof Error ? e.message : e}`);
      }
      save(); // 每批保存，中断后可续跑
    }
  }
  const left = Object.values(dict).filter((v) => !v).length;
  console.log(`Xong. Còn ${left} mục chưa dịch.`);
}
