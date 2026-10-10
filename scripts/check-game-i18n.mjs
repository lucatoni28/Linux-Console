#!/usr/bin/env node
/**
 * 检查游戏内 tr("中文") 文本是否都有越南语译文
 *
 * 用法: node scripts/check-game-i18n.mjs
 * 扫描 packages/{game,engine}/src，对比 packages/shared/src/lib/game-i18n/ui-vi.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dictFile = join(root, "packages/shared/src/lib/game-i18n/ui-vi.ts");
const scanDirs = ["packages/game/src", "packages/engine/src"].map((d) => join(root, d));

const dict = new Set();

/** 解析 JS 字符串字面量（"..." 或 '...'） */
function parseLiteral(lit) {
  if (lit.startsWith('"')) return JSON.parse(lit);
  return JSON.parse(`"${lit.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"')}"`);
}
// 键可能带引号（"a b"）或为合法标识符（biome 会去掉引号，如 登录:）
for (const m of readFileSync(dictFile, "utf8").matchAll(
  /^\s*(?:("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([^\s"':]+)):\s/gm
)) {
  dict.add(m[1] ? parseLiteral(m[1]) : m[2]);
}

const missing = new Map();
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules") continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(name)) {
      for (const m of readFileSync(p, "utf8").matchAll(
        /\btr\(("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g
      )) {
        const key = parseLiteral(m[1]);
        if (!dict.has(key)) missing.set(key, p.slice(root.length));
      }
    }
  }
}
scanDirs.forEach(walk);

if (missing.size > 0) {
  console.error(`缺少 ${missing.size} 条越南语译文:`);
  for (const [k, f] of missing) console.error(`  ${JSON.stringify(k)}  (${f})`);
  process.exit(1);
}
console.log(`OK: ${dict.size} 条译文，全部 tr() 文本均已翻译`);
