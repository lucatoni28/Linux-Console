/**
 * CrossPlatformSection - 跨平台优势专题页
 *
 * 独立的全屏 section，详细展示：
 * - 传统客户端的兼容性问题（Win98/XP 时代开发，不兼容现代系统）
 * - 网页版的跨平台优势（天然支持所有设备）
 * - 按需加载的技术优势（2GB 资源只需 5MB 即可开始）
 */

import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaAndroid,
  FaApple,
  FaBolt,
  FaCompactDisc,
  FaCube,
  FaGlobe,
  FaHdd,
  FaLinux,
  FaMobileAlt,
  FaSteam,
  FaSyncAlt,
  FaWindows,
} from "react-icons/fa";

// 平台图标组件
function _PlatformIcon({
  icon,
  label,
  supported,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  supported: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
        supported
          ? "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700"
          : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <span
        className={`text-2xl ${supported ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
      >
        {icon}
      </span>
      <span
        className={`text-xs font-medium ${
          supported ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
        }`}
      >
        {label}
      </span>
      <span className="text-lg">{supported ? "✓" : "✗"}</span>
    </motion.div>
  );
}

// 传统客户端错误演示
function LegacyClientDemo() {
  const { t } = useTranslation();
  const [errorIndex, setErrorIndex] = React.useState(0);

  const errors = [
    { icon: "🪟", key: "win11Error" },
    { icon: "🍎", key: "macError" },
    { icon: "🐧", key: "linuxError" },
    { icon: "💻", key: "cpuError" },
    { icon: "📱", key: "mobileError" },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setErrorIndex((prev) => (prev + 1) % errors.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentError = errors[errorIndex];

  return (
    <div className="relative">
      {/* 旧电脑外框 */}
      <div className="relative mx-auto w-64 sm:w-80">
        {/* 显示器 */}
        <div className="bg-gradient-to-b from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700 rounded-t-xl p-3 pb-0">
          <div className="bg-slate-900 rounded-t-lg overflow-hidden aspect-[4/3] relative">
            {/* Windows XP 桌面 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#245edb] to-[#1e4db8]">
              {/* 图标 */}
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">📁</span>
                  </div>
                  <span className="text-[6px] text-white/80">My Files</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">🎮</span>
                  </div>
                  <span className="text-[6px] text-white/80">Game.exe</span>
                </div>
              </div>

              {/* 错误弹窗 */}
              <motion.div
                key={errorIndex}
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%]"
              >
                <div className="bg-[#ece9d8] dark:bg-slate-200 rounded shadow-xl border-2 border-[#0054e3] overflow-hidden">
                  {/* Windows 标题栏 */}
                  <div className="bg-gradient-to-r from-[#0054e3] to-[#2e8bcc] px-2 py-0.5 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]">⚠️</span>
                      <span className="text-[8px] text-white font-bold truncate">
                        {t("asyncLoading.demo.errorTitle")}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 bg-[#c4c4c4] rounded-sm border border-white/50 flex items-center justify-center text-[8px]">
                        _
                      </div>
                      <div className="w-3 h-3 bg-red-500 rounded-sm border border-white/50 flex items-center justify-center text-[8px] text-white">
                        ✕
                      </div>
                    </div>
                  </div>
                  {/* 错误内容 */}
                  <div className="p-2 flex items-start gap-2">
                    <motion.span
                      className="text-xl"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {currentError.icon}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[8px] text-red-700 font-medium leading-snug">
                        {t(`asyncLoading.demo.${currentError.key}`)}
                      </div>
                    </div>
                  </div>
                  {/* 按钮 */}
                  <div className="px-2 pb-2 flex justify-center gap-2">
                    <div className="px-3 py-0.5 bg-[#dbd8d1] border border-[#8e8f8f] rounded-sm text-[8px] text-slate-700 shadow-sm">
                      {t("asyncLoading.demo.ok")}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 任务栏 */}
              <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-r from-[#245edb] via-[#3c83eb] to-[#245edb] border-t border-[#6699ff]/50 flex items-center px-1">
                <div className="h-4 px-1.5 bg-gradient-to-b from-[#3c9a3c] to-[#2d7d2d] rounded flex items-center gap-1 text-[7px] text-white font-bold">
                  <span>🪟</span>
                  <span>Start</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 显示器底座 */}
        <div className="bg-gradient-to-b from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700 h-3 mx-8 rounded-b" />
        <div className="bg-gradient-to-b from-slate-500 to-slate-400 dark:from-slate-700 dark:to-slate-600 h-8 mx-16 rounded-b-lg" />
      </div>

      {/* 标签 */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-full">
          <FaCompactDisc className="text-xs text-slate-500" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {t("asyncLoading.demo.legacyClient")}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {t("asyncLoading.demo.developedFor")}
        </div>
      </div>
    </div>
  );
}

// 网页版演示 - 使用真实截图
function WebVersionDemo() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      {/* 现代浏览器窗口 */}
      <div className="relative mx-auto w-64 sm:w-80">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* 浏览器标题栏 */}
          <div className="bg-slate-100 dark:bg-slate-900 px-3 py-2 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-2">
              <div className="bg-white dark:bg-slate-800 rounded-md px-3 py-1 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>🔒</span>
                <span>Miu2D.vercel.app</span>
              </div>
            </div>
          </div>

          {/* 游戏画面 - 真实截图 */}
          <div className="aspect-video relative bg-slate-900 overflow-hidden">
            <img
              src="/screenshot/screenshot.png"
              alt="Game Screenshot"
              className="w-full h-full object-cover object-center"
            />
            {/* 正在游玩标识 */}
            <motion.div
              className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-[10px] text-white font-medium">
                {t("asyncLoading.demo.playing")}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
          <FaGlobe className="text-xs text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {t("asyncLoading.demo.webVersion")}
          </span>
        </div>
        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
          {t("asyncLoading.demo.anyDevice")}
        </div>
      </div>
    </div>
  );
}

// 按需加载数据流演示
function _OnDemandLoadingDemo() {
  const { t } = useTranslation();
  const [loadedChunks, setLoadedChunks] = React.useState<Set<number>>(new Set([0, 1]));
  const [playerPos, setPlayerPos] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPos((prev) => {
        const next = (prev + 1) % 16;
        setLoadedChunks((loaded) => {
          const newLoaded = new Set(loaded);
          newLoaded.add(next);
          // 加载相邻区块
          const row = Math.floor(next / 4);
          const col = next % 4;
          if (col > 0) newLoaded.add(next - 1);
          if (col < 3) newLoaded.add(next + 1);
          if (row > 0) newLoaded.add(next - 4);
          if (row < 3) newLoaded.add(next + 4);
          return newLoaded;
        });
        return next;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    "🏠",
    "🌲",
    "⛰️",
    "🏯",
    "🌊",
    "🌳",
    "🗿",
    "🏰",
    "🌾",
    "🌸",
    "🎋",
    "⛩️",
    "🏔️",
    "🌴",
    "🎪",
    "🗼",
  ];

  return (
    <div className="max-w-sm mx-auto">
      {/* 地图网格 */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-900/50 rounded-2xl border border-amber-200 dark:border-amber-800">
        {[...Array(16)].map((_, i) => {
          const isLoaded = loadedChunks.has(i);
          const isPlayer = playerPos === i;
          return (
            <motion.div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-xl relative border-2 transition-all duration-300 ${
                isLoaded
                  ? "bg-amber-200/80 dark:bg-amber-700/50 border-amber-400 dark:border-amber-600"
                  : "bg-slate-300/50 dark:bg-slate-800/50 border-slate-400/30 dark:border-slate-600/30"
              }`}
              animate={{
                scale: isPlayer ? 1.1 : 1,
                opacity: isLoaded ? 1 : 0.4,
              }}
            >
              {isLoaded ? (
                <span className="drop-shadow">{icons[i]}</span>
              ) : (
                <span className="text-sm text-slate-400">?</span>
              )}
              {isPlayer && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-blue-500"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                    🎮 {t("asyncLoading.demo.player")}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 统计数据 */}
      <div className="mt-4 flex justify-center gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">2GB</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("asyncLoading.stats.total")}
          </div>
        </div>
        <div className="text-center">
          <motion.div
            className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
            key={loadedChunks.size}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {Math.round((loadedChunks.size / 16) * 200)}MB
          </motion.div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("asyncLoading.stats.loaded")}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {100 - Math.round((loadedChunks.size / 16) * 100)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("asyncLoading.stats.saved")}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrossPlatformSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-zinc-950 dark:via-slate-900 dark:to-zinc-950" />

      {/* 装饰性网格 */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <FaGlobe className="text-lg text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {t("asyncLoading.badge")}
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              {t("asyncLoading.title")}
            </span>
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t("asyncLoading.subtitle")}
          </p>
        </motion.div>

        {/* 对比区域 - VS 风格 */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* 左侧：传统客户端 */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative h-full rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
                {/* 头部标签 */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                      <FaCompactDisc className="text-lg text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {t("asyncLoading.platforms.legacy")}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        C++ · DirectX · 2001
                      </p>
                    </div>
                  </div>
                </div>
                {/* 演示区 */}
                <div className="p-6">
                  <LegacyClientDemo />
                </div>
              </div>
            </motion.div>

            {/* 右侧：网页版 */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative h-full rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
                {/* 头部标签 */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <FaGlobe className="text-lg text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {t("asyncLoading.platforms.web")}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        TypeScript · WebGL · 2024
                      </p>
                    </div>
                  </div>
                </div>
                {/* 演示区 */}
                <div className="p-6">
                  <WebVersionDemo />
                </div>
              </div>
            </motion.div>
          </div>

          {/* VS 分隔符 */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center">
              <span className="text-sm font-black text-slate-400 dark:text-slate-500">VS</span>
            </div>
          </div>
        </div>

        {/* 核心指标对比 - 简约横条设计 */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            {/* 指标项 */}
            {[
              {
                icon: <FaBolt className="text-amber-500" />,
                label: t("asyncLoading.table.startSpeed"),
                legacy: "~30 min",
                legacyNote: t("asyncLoading.table.downloadFirst"),
                web: "<3s",
                webNote: t("asyncLoading.table.instantStart"),
                highlight: "600×",
                color: "amber",
              },
              {
                icon: <FaCube className="text-blue-500" />,
                label: t("asyncLoading.table.initialLoad"),
                legacy: "2GB",
                legacyNote: t("asyncLoading.table.fullDownload"),
                web: "<5MB",
                webNote: t("asyncLoading.table.minimalLoad"),
                highlight: "400×",
                color: "blue",
              },
              {
                icon: <FaSyncAlt className="text-cyan-500" />,
                label: t("asyncLoading.table.resourceLoad"),
                legacy: t("asyncLoading.table.preDownload"),
                legacyNote: t("asyncLoading.table.allAtOnce"),
                web: t("asyncLoading.table.onDemand"),
                webNote: t("asyncLoading.table.asNeeded"),
                highlight: t("asyncLoading.highlight.smart"),
                color: "cyan",
              },
              {
                icon: <FaHdd className="text-purple-500" />,
                label: t("asyncLoading.table.storage"),
                legacy: "2GB+",
                legacyNote: t("asyncLoading.table.permanentSpace"),
                web: "0",
                webNote: t("asyncLoading.table.browserCache"),
                highlight: t("asyncLoading.highlight.zeroStorage"),
                color: "purple",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="group relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* 指标名称 */}
                    <div className="flex items-center gap-3 sm:w-40 shrink-0">
                      <div
                        className={`w-9 h-9 rounded-xl bg-${item.color}-500/10 flex items-center justify-center`}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                        {item.label}
                      </span>
                    </div>

                    {/* 对比条 */}
                    <div className="flex-1 flex items-center gap-3">
                      {/* 传统 */}
                      <div className="flex-1 flex items-center justify-end gap-2 text-right">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {item.legacyNote}
                          </div>
                          <div className="text-lg font-bold text-red-500">{item.legacy}</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                      </div>

                      {/* 分隔 */}
                      <div
                        className={`px-3 py-1 rounded-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 text-white text-xs font-bold shadow-lg`}
                      >
                        {item.highlight}
                      </div>

                      {/* 网页版 */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {item.webNote}
                          </div>
                          <div className="text-lg font-bold text-emerald-500">{item.web}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 平台支持图例 */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t("asyncLoading.platforms.legacy")}
              </span>
              <div className="flex gap-1.5">
                {[
                  { icon: <FaWindows className="text-slate-400" />, ok: true },
                  { icon: <FaApple className="text-red-400" />, ok: false },
                  { icon: <FaLinux className="text-red-400" />, ok: false },
                  { icon: <FaMobileAlt className="text-red-400" />, ok: false },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${p.ok ? "bg-slate-100 dark:bg-slate-800" : "bg-red-50 dark:bg-red-950/30"}`}
                  >
                    {p.icon}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t("asyncLoading.platforms.web")}
              </span>
              <div className="flex gap-1.5">
                {[
                  { icon: <FaWindows className="text-emerald-500" /> },
                  { icon: <FaApple className="text-emerald-500" /> },
                  { icon: <FaLinux className="text-emerald-500" /> },
                  { icon: <FaAndroid className="text-emerald-500" /> },
                  { icon: <FaSteam className="text-emerald-500" /> },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-sm"
                  >
                    {p.icon}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
