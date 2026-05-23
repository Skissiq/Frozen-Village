import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, MessageSquare, Settings, Compass, FolderOpen, Camera, Play, 
  Send, Trash2, ArrowLeft, RefreshCw, Eye, Search, Wallpaper, Info, 
  Layers, Database, Cpu, Battery, BatteryCharging, Shield, Activity, Globe, Check, Image as ImageIcon, CameraOff, Sparkles, Folder, ChevronRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MobileApp, Message, ChatContact, VirtualFile, SystemTheme } from "../types";

// ==========================================
// 1. PHONE APP CORE
// ==========================================
interface PhoneDialerProps {
  onBack: () => void;
}

export const PhoneDialer: React.FC<PhoneDialerProps> = ({ onBack }) => {
  const [input, setInput] = useState("");
  const [callState, setCallState] = useState<"DIALING" | "CONNECTED" | "IDLE">("IDLE");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (callState === "CONNECTED") {
      timer = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleDial = (num: string) => {
    if (input.length < 15) setInput(i => i + num);
  };

  const handleCall = () => {
    if (!input.trim()) return;
    setCallState("DIALING");
    setTimeout(() => {
      setCallState("CONNECTED");
    }, 1800);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none relative">
      <AnimatePresence>
        {callState === "IDLE" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-4"
          >
            {/* Outgoing Header */}
            <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-700">
                <ArrowLeft size={16} />
              </button>
              <Phone size={16} className="text-green-400" />
              <span className="font-sans text-xs text-slate-300 font-bold">虛擬撥號器 (Dialer)</span>
            </div>

            {/* Dialpad display output */}
            <div className="text-right py-4 px-2 min-h-16">
              <div className="text-3xl font-light font-mono text-slate-100 tracking-wide overflow-x-auto truncate">{input || "撥號..."}</div>
            </div>

            {/* Touch Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => (
                <button
                  key={k}
                  onClick={() => handleDial(k)}
                  className="w-14 h-14 bg-slate-900 hover:bg-slate-800 active:scale-95 text-lg font-bold rounded-full border border-slate-800 flex items-center justify-center transition"
                >
                  {k}
                </button>
              ))}
              {/* Backspace utility */}
              <button 
                onClick={() => setInput("")}
                className="col-start-1 text-slate-500 hover:text-red-400 text-xs py-2 font-mono"
              >
                清除 (Clear)
              </button>
              {/* Green Make Call button */}
              <button 
                onClick={handleCall}
                className="col-start-2 w-14 h-14 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center text-white"
              >
                <Phone size={24} />
              </button>
              <button 
                onClick={() => setInput(i => i.slice(0, -1))}
                className="col-start-3 text-slate-500 hover:text-slate-300 text-xs py-2 font-mono"
              >
                刪除 (Delete)
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col justify-between p-6 items-center text-center text-white"
          >
            <div className="pt-12">
              <div className="w-20 h-20 bg-green-500 border-4 border-slate-800 rounded-full flex items-center justify-center mx-auto shadow-xl text-3xl font-extrabold text-white animate-pulse">
                {input[0] || "?"}
              </div>
              <h2 className="text-lg font-bold mt-4 tracking-wide">{input}</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest text-green-400">
                {callState === "DIALING" ? "正在撥號 (Dialing)..." : "虛擬通話已連通 (Connected)"}
              </p>
              {callState === "CONNECTED" && (
                <span className="text-sm font-mono text-slate-300 mt-2 block bg-slate-800 px-3 py-1 rounded-full">{formatTime(seconds)}</span>
              )}
            </div>

            <button 
              onClick={() => setCallState("IDLE")}
              className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transform transition"
            >
              <Phone className="transform rotate-135" size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ==========================================
// 2. SETTINGS APP
// ==========================================
interface SettingsProps {
  onBack: () => void;
  wallpaper: string;
  setWallpaper: (val: string) => void;
  systemLogs: string[];
  batteryLevel: number;
}

export const SettingsApp: React.FC<SettingsProps> = ({ onBack, wallpaper, setWallpaper, systemLogs, batteryLevel }) => {
  const [tab, setTab] = useState<"MENU" | "SYSTEM" | "WALLPAPER" | "BATTERY" | "LOGS" | "STORAGE">("MENU");

  // Mock static historical battery data
  const batteryHistory = [
    { time: "09:00", level: 100 },
    { time: "11:00", level: 88 },
    { time: "13:00", level: 75 },
    { time: "15:00", level: 66 },
    { time: "17:00", level: 50 },
    { time: "19:00", level: batteryLevel }
  ];

  const presets = [
    { name: "Neon Cosmic", color: "from-fuchsia-900 via-sky-900 to-black", val: "bg-gradient-to-tr from-fuchsia-900 via-sky-900 to-black" },
    { name: "Golden Oasis", color: "from-amber-800 via-orange-900 to-amber-950", val: "bg-gradient-to-br from-amber-800 via-orange-900 to-amber-950" },
    { name: "Sage Garden", color: "from-emerald-900 via-teal-950 to-neutral-950", val: "bg-gradient-to-b from-emerald-900 via-teal-950 to-neutral-950" },
    { name: "Obsidian Slate", color: "from-slate-900 to-neutral-950", val: "bg-gradient-to-tr from-slate-900 to-neutral-950" }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Settings Top-Bar */}
      <div className="flex items-center space-x-3 p-3 bg-slate-950 text-slate-200 border-b border-slate-800 shadow-md">
        {tab === "MENU" ? (
          <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-800">
            <ArrowLeft size={16} />
          </button>
        ) : (
          <button onClick={() => setTab("MENU")} className="p-1 rounded-full hover:bg-slate-800">
            <ArrowLeft size={16} />
          </button>
        )}
        <Settings size={16} className="text-blue-400" />
        <span className="font-sans font-medium text-xs tracking-wide">
          {tab === "MENU" ? "模擬器設置 (Settings)" : tab === "SYSTEM" ? "系統詳情" : tab === "WALLPAPER" ? "桌布樣式" : tab === "BATTERY" ? "電池報告" : tab === "LOGS" ? "日誌輸出" : "存儲分配"}
        </span>
      </div>

      {/* Settings Panel Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tab === "MENU" && (
          <div className="space-y-2">
            {/* Quick Stats overview */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu size={16} className="text-purple-400" />
                <span className="text-[11px] font-sans text-slate-300">Google Pixel 8 (模擬載入)</span>
              </div>
              <span className="text-[10px] bg-sky-900/40 text-sky-400 font-mono px-2 py-0.5 rounded-full">Android 14</span>
            </div>

            {/* Storage quick look */}
            <button 
              onClick={() => setTab("STORAGE")}
              className="w-full text-left p-2.5 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg flex items-center justify-between transition border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center space-x-2.5">
                <Database size={15} className="text-yellow-500" />
                <div className="text-xs">
                  <div className="font-sans font-medium">裝置存儲 (Storage)</div>
                  <div className="text-[10px] text-slate-400">查看磁碟空間佔用詳情</div>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-500" />
            </button>

            {/* Battery status menu */}
            <button 
              onClick={() => setTab("BATTERY")}
              className="w-full text-left p-2.5 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg flex items-center justify-between transition border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center space-x-2.5">
                <Battery size={15} className="text-green-400" />
                <div className="text-xs">
                  <div className="font-sans font-medium">電池狀態 (Battery)</div>
                  <div className="text-[10px] text-slate-400">{batteryLevel}% • 模擬放電日誌</div>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-500" />
            </button>

            {/* Wallpaper options */}
            <button 
              onClick={() => setTab("WALLPAPER")}
              className="w-full text-left p-2.5 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg flex items-center justify-between transition border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center space-x-2.5">
                <Wallpaper size={15} className="text-purple-400" />
                <div className="text-xs">
                  <div className="font-sans font-medium">主頁桌布 (Wallpaper)</div>
                  <div className="text-[10px] text-slate-400">樣式與自定義主題色</div>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-500" />
            </button>

            {/* About Emulator details */}
            <button 
              onClick={() => setTab("SYSTEM")}
              className="w-full text-left p-2.5 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg flex items-center justify-between transition border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center space-x-2.5">
                <Info size={15} className="text-blue-400" />
                <div className="text-xs">
                  <div className="font-sans font-medium">關於模擬系統 (About)</div>
                  <div className="text-[10px] text-slate-400">機器狀態與環境詳情</div>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-500" />
            </button>

            {/* System Kernel Event Logs */}
            <button 
              onClick={() => setTab("LOGS")}
              className="w-full text-left p-2.5 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg flex items-center justify-between transition border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center space-x-2.5">
                <Shield size={15} className="text-red-400" />
                <div className="text-xs">
                  <div className="font-sans font-medium">開發者選項 (Developer)</div>
                  <div className="text-[10px] text-slate-400">查看 ADB 啟動/安裝日誌</div>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-500" />
            </button>
          </div>
        )}

        {/* SYSTEM TAB */}
        {tab === "SYSTEM" && (
          <div className="space-y-3 font-sans text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 uppercase text-[10px] tracking-wider text-blue-400">系統規格 (Specs)</h3>
            <div className="space-y-2.5 bg-slate-800/20 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">處理器:</span>
                <span className="font-mono text-slate-100">Goldfish Enterprise WASM x86</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">核心數量:</span>
                <span className="font-mono text-slate-100">8 虛擬線程</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">內存分配:</span>
                <span className="font-mono text-slate-100">512 MB WebGL 沙盒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">螢幕比例:</span>
                <span className="font-mono text-slate-100">9:16 響應式佈局</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">系統版本:</span>
                <span className="font-mono text-slate-100">UDC-V14-GOLDFISH-20260523</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">虛擬 IP:</span>
                <span className="font-mono text-slate-100">10.0.2.15 (NAT)</span>
              </div>
            </div>
          </div>
        )}

        {/* STORAGE TAB */}
        {tab === "STORAGE" && (
          <div className="space-y-3 font-sans">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 text-[10px] tracking-wider uppercase text-yellow-500">安卓存儲分配 (Storage)</h3>
            <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-white">4.2 GB</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">已用空間 (共 64 GB)</span>
              </div>
              <div className="w-2.5 h-10 bg-slate-700 rounded-full overflow-hidden relative">
                <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-yellow-500"></div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-1 bg-slate-800/10 rounded">
                <span className="text-slate-400">系統核心文件:</span>
                <span className="text-slate-200 font-mono">2.8 GB</span>
              </div>
              <div className="flex justify-between p-1 bg-slate-800/10 rounded">
                <span className="text-slate-400">安裝應用程序:</span>
                <span className="text-slate-200 font-mono">1.1 GB</span>
              </div>
              <div className="flex justify-between p-1 bg-slate-800/10 rounded">
                <span className="text-slate-400">相機照片 (sdcard/Pictures):</span>
                <span className="text-slate-200 font-mono">120 KB</span>
              </div>
              <div className="flex justify-between p-1 bg-slate-800/10 rounded">
                <span className="text-slate-400">下載項目 (sdcard/Download):</span>
                <span className="text-slate-200 font-mono">310 KB</span>
              </div>
            </div>
          </div>
        )}

        {/* WALLPAPER TAB */}
        {tab === "WALLPAPER" && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 text-[10px] tracking-wider uppercase text-purple-400">選擇美感桌布</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => setWallpaper(p.val)}
                  className="rounded-lg overflow-hidden border border-slate-800 focus:ring-2 focus:ring-blue-500 text-left cursor-pointer group hover:scale-102 transition duration-200 active:scale-95 text-xs font-sans"
                >
                  <div className={`h-16 w-full bg-gradient-to-tr ${p.color}`} />
                  <div className="p-2 bg-slate-950 font-medium text-slate-300 group-hover:text-white flex items-center justify-between">
                    <span>{p.name}</span>
                    {wallpaper === p.val && <Check size={10} className="text-green-400 animate-pulse" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BATTERY TAB (RECHARTS CHART) */}
        {tab === "BATTERY" && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 text-[10px] tracking-wider uppercase text-green-400">歷史放電曲線</h3>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={batteryHistory} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="time" stroke="#475569" style={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#475569" style={{ fontSize: 9, fontFamily: "monospace" }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: 10 }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Line type="monotone" dataKey="level" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal text-center bg-slate-800/20 p-2 rounded-lg border border-slate-850">
              Goldfish 虛擬電池傳感器監控連續運行時間。快充機制將自動提升至滿電狀態。
            </p>
          </div>
        )}

        {/* EVENTS LOGS ADB TAB */}
        {tab === "LOGS" && (
          <div className="space-y-2 font-mono text-[9px]">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-[10px] tracking-wider uppercase text-red-400">ADB Logcat Output</h3>
            <div className="bg-slate-950 text-emerald-400 border border-slate-850 p-2 rounded-lg h-56 overflow-y-auto space-y-1.5 select-text">
              {systemLogs.map((log, i) => (
                <div key={i} className="leading-tight border-b border-slate-900/40 pb-1">
                  <span className="text-slate-500 mr-1">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// OFFLINE WEB & CHAT GENERATOR HELPERS FOR GITHUB PAGES COMPATIBILITY
// ==========================================
const getOfflineWebpage = (targetUrl: string): string => {
  const url = targetUrl.toLowerCase();
  
  if (url.includes("wikipedia")) {
    return `
      <div class="bg-slate-900 text-slate-100 p-4 font-sans leading-relaxed tracking-normal max-w-3xl mx-auto rounded-lg">
        <div class="border-b border-slate-700 pb-3 mb-4">
          <h1 class="text-2xl font-serif text-white font-semibold">維基百科 (Wikipedia)</h1>
          <p class="text-xs text-slate-400 mt-1">「自由的百科全書」，本機沙盒離線緩存版本</p>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1 space-y-4">
            <h2 class="text-lg font-bold text-white border-b border-slate-800 pb-1">Android (作業系統)</h2>
            <p class="text-sm text-slate-300">
              <b>Android</b>（中文譯作「安卓」）是一個基於Linux核心的開放原始碼行動作業系統，由Google成立的開放手機聯盟（OHA）主導與開發。主要設計用於觸控螢幕行動裝置，如智慧型手機平板電腦。
            </p>
            <p class="text-sm text-slate-300">
              Android最初由Andy Rubin創立，並於2005年被Google收購。2007年11月，Google以「開放手機聯盟」的名義推出了Android核心系統，並發行了由多個裝置製造商、晶片商和電信業者組成的聯盟版本。
            </p>
            <h3 class="text-sm font-bold text-slate-200 mt-2">📊 主要版本發展資訊</h3>
            <ul class="list-disc pl-5 text-xs text-slate-400 space-y-1">
              <li>Android 14 (Upside Down Cake) - 當前預設模擬系統</li>
              <li>Android 13 (Tiramisu) - 全面升級隱私設定</li>
              <li>Android 12 (Snow Cone) - 導入 Material You 全新美學體驗</li>
            </ul>
          </div>
          <div class="w-full md:w-48 bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 h-fit shrink-0">
            <div class="bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-[10px] uppercase font-bold text-center py-1 rounded mb-2">Android OS Profile</div>
            <p class="mb-1"><b>開發商:</b> Google, OHA</p>
            <p class="mb-1"><b>首次發行:</b> 2008年9月23日</p>
            <p class="mb-1"><b>授權條款:</b> Apache 2.0 / GPLv2</p>
            <p class="mb-1"><b>官方網站:</b> android.com</p>
          </div>
        </div>
      </div>
    `;
  }
  
  if (url.includes("hacker") || url.includes("ycombinator") || url.includes("news")) {
    return `
      <div class="bg-[#f6f6ef] text-[#222222] p-3 font-sans text-xs select-text rounded-lg">
        <div class="bg-[#ff6600] p-2 flex items-center justify-between text-black font-bold mb-3 rounded shadow">
          <div class="flex items-center space-x-2">
            <span class="border-2 border-black px-1.5 py-0.5 text-xs font-mono font-black">Y</span>
            <span class="text-sm">Hacker News Mobile</span>
          </div>
          <span class="text-[10px] font-normal text-slate-900">offline sandbox</span>
        </div>
        <div class="space-y-4 px-1">
          <div class="flex items-start space-x-2">
            <span class="text-slate-500 font-mono w-4 text-right">1.</span>
            <div>
              <a href="#" class="font-medium text-slate-900 hover:underline">Show HN: Goldfish &ndash; A gorgeous in-browser Android OS emulator</a>
              <span class="text-[10px] text-slate-500 ml-1">(github.com/goldfish-emu)</span>
              <div class="text-[9px] text-slate-500 mt-0.5">248 points by hackergoldy 4 hours ago | 64 comments</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <span class="text-slate-500 font-mono w-4 text-right">2.</span>
            <div>
              <a href="#" class="font-medium text-slate-900 hover:underline">React 19 hits full stable with improved Suspense & Form Actions</a>
              <span class="text-[10px] text-slate-500 ml-1">(react.dev)</span>
              <div class="text-[9px] text-slate-500 mt-0.5">512 points by dan_abramov 8 hours ago | 124 comments</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <span class="text-slate-500 font-mono w-4 text-right">3.</span>
            <div>
              <a href="#" class="font-medium text-slate-900 hover:underline">Why running AI models local-first is the future of privacy</a>
              <span class="text-[10px] text-slate-500 ml-1">(localfirstweb.org)</span>
              <div class="text-[9px] text-slate-500 mt-0.5">186 points by decentralized_ai 1 day ago | 59 comments</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  if (url.includes("reddit")) {
    return `
      <div class="bg-[#0b1416] text-[#ecefed] p-3 font-sans rounded-lg">
        <div class="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
          <div class="flex items-center space-x-2 text-white">
            <span class="bg-[#ff4500] text-black text-xs font-black p-1 rounded-full w-6 h-6 flex items-center justify-center">r/</span>
            <span class="font-bold text-sm tracking-tight text-white">Reddit Sandbox</span>
          </div>
          <span class="text-[10px] bg-emerald-900 text-emerald-300 font-mono px-2 py-0.5 rounded-full">CONNECTED</span>
        </div>
        <div class="space-y-4">
          <div class="bg-[#1a282d] p-3 rounded-xl border border-neutral-800">
            <div class="flex items-center space-x-1.5 text-slate-400 text-[10px] mb-1">
              <span class="font-bold text-slate-300">r/androiddev</span>
              <span>• posted by u/web_stager 3h ago</span>
            </div>
            <h3 class="font-bold text-xs text-white">I compiled a complete Android System in pure React and Tailwind CSS</h3>
            <p class="text-[11px] text-slate-300 mt-1.5 leading-normal">
              Just deployed my emulator demo to Github Pages! It has real simulated Termux shells, retro Flappy Android apps, direct APK upload stagers AND responsive camera/sensors! Give me feedback on layout clipping or scroll behavior.
            </p>
            <div class="flex items-center space-x-3 text-slate-400 text-[10px] mt-3 font-medium">
              <button class="bg-[#2a3c42] hover:bg-[#344b52] px-2.5 py-1 rounded-full flex items-center space-x-1">⬆️ 1.2k</button>
              <button class="bg-[#2a3c42] hover:bg-[#344b52] px-2.5 py-1 rounded-full">💬 142 Comments</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  if (url.includes("weather")) {
    return `
      <div class="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 font-sans rounded-xl border border-indigo-900/40">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold">臺北市 (Taipei City)</h2>
            <p class="text-xs text-indigo-300">多雲時晴 (Mostly Cloudy) • 沙盒即時氣象儀</p>
          </div>
          <span class="text-3xl text-yellow-400 animate-pulse">⛅</span>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-indigo-900/40 border border-indigo-800/40 p-3 rounded-xl text-center">
            <p class="text-[10px] text-indigo-200">當前溫度 (TEMP)</p>
            <p class="text-2xl font-black mt-1 font-mono text-yellow-300">26°C</p>
          </div>
          <div class="bg-indigo-900/40 border border-indigo-800/40 p-3 rounded-xl text-center">
            <p class="text-[10px] text-indigo-200">體感溫度 (FEELS LIKE)</p>
            <p class="text-2xl font-black mt-1 font-mono">28°C</p>
          </div>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between border-b border-indigo-950 pb-1.5">
            <span class="text-indigo-200">相對濕度 (Humidity)</span>
            <span>74%</span>
          </div>
          <div class="flex justify-between border-b border-indigo-950 pb-1.5">
            <span class="text-indigo-200">瞬間風速 (Wind)</span>
            <span>NE 12 km/h</span>
          </div>
          <div class="flex justify-between">
            <span class="text-indigo-200">空氣品質 (AQI)</span>
            <span class="text-emerald-400 font-bold">34 (優良良好)</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="bg-slate-900 text-slate-100 p-4 font-sans max-w-2xl mx-auto rounded-lg border border-slate-800">
      <div class="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-white">${targetUrl}</h1>
          <p class="text-[10px] text-slate-400 mt-0.5">離線解析檢視 (Decentralized static view proxy)</p>
        </div>
        <span class="text-xs bg-emerald-900/40 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded">HTTPS SECURE</span>
      </div>
      <div class="py-4 space-y-3">
        <div class="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-xl">
          <h3 class="text-xs font-bold text-indigo-300 border-b border-indigo-950 pb-1 mb-1.5">網路代理解析通告</h3>
          <p class="text-[11px] text-slate-300 leading-normal">
            瀏覽地址 <b>${targetUrl}</b> 正在離線模擬。在 GitHub Pages 等靜態網頁託管環境中，模擬器已自動切換至「本機端即時解析」機制，確保了流暢的互動體驗。
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
          <div class="bg-slate-850 p-2.5 rounded-lg border border-slate-800 text-slate-300">
            [DEX_HEAP] 100% OK
          </div>
          <div class="bg-slate-850 p-2.5 rounded-lg border border-slate-800 text-emerald-400">
            [SANDBOX] static-v1.8
          </div>
        </div>
      </div>
    </div>
  `;
};

const getOfflineChatReply = (contactName: string, messageText: string): string => {
  const text = messageText.toLowerCase();
  
  if (contactName.includes("Gemini") || contactName.includes("Assistant")) {
    if (text.includes("hey") || text.includes("hello") || text.includes("hi")) {
      return "嗨！我是 Gemini 虛擬助手。雖然本機正處於 GitHub Pages 離線沙盒中，但我依然能利用本機模擬邏輯回答您的多數基本問題哦！";
    }
    if (text.includes("weather") || text.includes("天氣")) {
      return "目前本機環境溫度約 26°C，多雲時晴。您可以到主桌面的『瀏覽器』並搜尋 'weather.com' 查看詳細台北氣象資訊！";
    }
    if (text.includes("help") || text.includes("cmd") || text.includes("指令") || text.includes("功能")) {
      return "本機功能強大！您可以：\n1. 開啟 Termux 並輸入 'ls' or 'neofetch'\n2. 拖放 (Drag & Drop) 任何 .apk 至模擬器桌面進行 AI 合成安裝\n3. 開啟 Pixel 繪畫作品存檔。";
    }
    return `收到您的查詢！在離線/靜態模式下，我會為您提供全面的設備狀態模擬。請盡情測試！`;
  }
  
  if (contactName.includes("Charon") || contactName.includes("Lead")) {
    if (text.includes("error") || text.includes("bug") || text.includes("修")) {
      return "聽說你遇到了一些佈局或狀態錯誤？試著確認瀏覽器 Console 或是檢查 package.json 指向吧！目前畫布自適應已經優化囉。";
    }
    return "太棒了，目前在 GitHub Pages 的靜態預覽也是完美運行了，我們成功突破了 Express/Node 伺服器容器的限制！";
  }
  
  if (contactName.includes("Dad") || contactName.includes("爸")) {
    if (text.includes("吃") || text.includes("晚餐") || text.includes("餓")) {
      return "今天煮了牛肉麵還有蔥油餅喔！快回家吃，別加班太晚囉。";
    }
    return "哈哈，真不錯。有空記得打電話給我，你媽說這主廚模擬器很有趣！";
  }
  
  return `你好！很高興收到訊息。本機已記錄下你的輸入: "${messageText}"。希望你喜歡這個金魚 (Goldfish) 虛擬安卓模擬裝置。`;
};


// ==========================================
// 3. SIMULATED CHROME BROWSER
// ==========================================
interface ChromeProps {
  onBack: () => void;
}

export const SimulatedChrome: React.FC<ChromeProps> = ({ onBack }) => {
  const [url, setUrl] = useState("wikipedia.org");
  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState<string>(`
    <div class="p-4 font-sans max-w-sm mx-auto bg-slate-900 text-slate-100 rounded-xl">
      <h1 class="text-xl font-extrabold tracking-tight mb-2 text-yellow-400 flex items-center gap-1.5">
        <span>🌐 Simulated Browser</span>
      </h1>
      <p class="text-xs text-slate-300 leading-relaxed mb-4">
        Welcome to Android Goldfish Sandbox Web Browser. Type any URL or terms above to fetch detailed interactive AI-synthesized mobile views dynamically compiled by Gemini!
      </p>
      <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 space-y-2.5">
        <h3 class="text-xs font-bold text-slate-200">Recommended Quick Starts:</h3>
        <div class="grid grid-cols-2 gap-2 text-[11px] font-sans">
          <button class="bg-slate-750 border border-slate-700 p-2 rounded text-center hover:bg-slate-700 cursor-pointer" onclick="document.dispatchEvent(new CustomEvent('nav-url', {detail: 'wikipedia.org'}))">Wikipedia</button>
          <button class="bg-slate-755 border border-slate-700 p-2 rounded text-center hover:bg-slate-700 cursor-pointer" onclick="document.dispatchEvent(new CustomEvent('nav-url', {detail: 'news.ycombinator.com'}))">Hacker News</button>
          <button class="bg-slate-760 border border-slate-700 p-2 rounded text-center hover:bg-slate-700 cursor-pointer" onclick="document.dispatchEvent(new CustomEvent('nav-url', {detail: 'reddit.com'}))">Reddit Mobile</button>
          <button class="bg-slate-765 border border-slate-700 p-2 rounded text-center hover:bg-slate-700 cursor-pointer" onclick="document.dispatchEvent(new CustomEvent('nav-url', {detail: 'weather.com'}))">Weather Center</button>
        </div>
      </div>
    </div>
  `);

  const fetchPage = async (targetUrl: string) => {
    setLoading(true);
    const formattedUrl = targetUrl.replace(/(^\w+:|^)\/\//, ""); // clean https if any
    try {
      const response = await fetch("/api/gemini/browser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });
      const data = await response.json();
      if (data.content) {
        setPageContent(data.content);
      } else {
        setPageContent(getOfflineWebpage(formattedUrl));
      }
    } catch (err) {
      setPageContent(getOfflineWebpage(formattedUrl));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEvent = (e: any) => {
      const target = e.detail;
      setUrl(target);
      fetchPage(target);
    };
    document.addEventListener("nav-url", handleEvent);
    return () => document.removeEventListener("nav-url", handleEvent);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    fetchPage(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-850 overflow-hidden relative font-sans text-slate-200">
      {/* Search Input Bar Top */}
      <div className="bg-slate-950 p-2 border-b border-slate-850 flex items-center space-x-2">
        <button onClick={onBack} className="p-1 rounded-full text-slate-400 hover:bg-slate-850">
          <ArrowLeft size={16} />
        </button>
        
        <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-slate-900 rounded-full px-3 py-1 border border-slate-800">
          <Globe size={13} className="text-slate-500 mr-2" />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none text-[11px] font-sans text-slate-100 outline-none"
            placeholder="輸入網址或關鍵字搜尋..."
          />
          <button type="submit" className="text-slate-500 hover:text-slate-300">
            <RefreshCw size={11} className={loading ? "animate-spin text-blue-400" : ""} />
          </button>
        </form>
      </div>

      {/* Webpage iframe-like client screen */}
      <div className="flex-1 bg-slate-900 overflow-y-auto p-3 text-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center h-full">
            <RefreshCw size={24} className="animate-spin text-blue-500" />
            <p className="text-[11px] text-slate-400 font-sans">正在經由 Gemini 代理連接虛擬網絡 (Simulated WAN)...</p>
          </div>
        ) : (
          <div 
            className="prose prose-invert prose-xs max-w-full font-sans text-[11px] leading-relaxed select-text" 
            dangerouslySetInnerHTML={{ __html: pageContent }} 
          />
        )}
      </div>
    </div>
  );
};


// ==========================================
// 4. WHATSAPP AI MESSENGER (CHAT CLIENT)
// ==========================================
interface WhatsAppProps {
  onBack: () => void;
}

export const WhatsAppMessenger: React.FC<WhatsAppProps> = ({ onBack }) => {
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [historyMap, setHistoryMap] = useState<Record<string, Message[]>>({
    "charon": [
      { id: "1", sender: "contact", text: "Hey! Did you finish constructing the APK package?", timestamp: new Date() }
    ],
    "gemini": [
      { id: "1", sender: "contact", text: "Welcome to the emulator AI helper channel! Ask me to compile apps, write code snippets, or draft system tests in real time.", timestamp: new Date() }
    ],
    "dad": [
      { id: "1", sender: "contact", text: "Have you arrived home? Don't forget to charge your Android simulator!", timestamp: new Date() }
    ]
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const contacts: ChatContact[] = [
    { id: "gemini", name: "Gemini Virtual Assistant", status: "Online", avatarColor: "bg-gradient-to-tr from-blue-500 to-fuchsia-500" },
    { id: "charon", name: "Charon Emu Lead", status: "Online", avatarColor: "bg-emerald-600" },
    { id: "dad", name: "Dad", status: "Offline", avatarColor: "bg-amber-600" }
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [historyMap, activeContact, typing]);

  const handleSendMessage = async () => {
    if (!input.trim() || !activeContact) return;
    
    // 1. Log outgoing
    const cId = activeContact.id;
    const userMsg: Message = {
      id: String(Math.random()),
      sender: "me",
      text: input,
      timestamp: new Date()
    };
    
    setHistoryMap(prev => ({
      ...prev,
      [cId]: [...(prev[cId] || []), userMsg]
    }));
    setInput("");
    setTyping(true);

    // 2. Query Gemini simulated contact response
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: activeContact.name,
          chatHistory: historyMap[cId] || [],
          message: userMsg.text
        }),
      });
      
      if (!response.ok) throw new Error("API server reported errors.");
      
      const data = await response.json();
      
      const responseMsg: Message = {
        id: String(Math.random()),
        sender: "contact",
        text: data.reply || "Message delivered.",
        timestamp: new Date()
      };

      setHistoryMap(prev => ({
        ...prev,
        [cId]: [...(prev[cId] || []), responseMsg]
      }));
    } catch {
      // Simulate typing speed latency for local response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const responseMsg: Message = {
        id: String(Math.random()),
        sender: "contact",
        text: getOfflineChatReply(activeContact.name, userMsg.text),
        timestamp: new Date()
      };
      setHistoryMap(prev => ({
        ...prev,
        [cId]: [...(prev[cId] || []), responseMsg]
      }));
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-850 relative font-sans text-slate-100 select-none">
      <AnimatePresence>
        {!activeContact ? (
          // Contact list board
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* WhatsApp Top Header */}
            <div className="bg-emerald-800 p-3.5 flex items-center space-x-3 text-white shadow-md">
              <button onClick={onBack} className="p-1 rounded-full hover:bg-emerald-700">
                <ArrowLeft size={16} />
              </button>
              <MessageSquare size={16} />
              <span className="font-sans font-black tracking-wide text-xs uppercase text-emerald-100">AI 簡訊 Lite</span>
            </div>

            {/* Contacts list */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              <p className="text-[10px] text-slate-400 font-sans tracking-wider uppercase mb-2">模擬聊天會話</p>
              {contacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveContact(c)}
                  className="w-full text-left p-3 bg-slate-850 hover:bg-slate-800 active:scale-98 transform duration-150 rounded-xl border border-slate-800 flex items-center space-x-3 transition cursor-pointer"
                >
                  <div className={`w-8 h-8 ${c.avatarColor} rounded-full flex items-center justify-center font-bold text-white text-xs`}>
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-xs font-bold text-slate-200 truncate">{c.name}</span>
                      <span className="text-[9px] font-mono text-slate-500">在線 (Online)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {historyMap[c.id]?.[historyMap[c.id].length - 1]?.text || "無最近訊息。"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          // Active chat feed
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            className="absolute inset-0 bg-slate-950 flex flex-col justify-between"
          >
            {/* Message header */}
            <div className="bg-emerald-850 p-2.5 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center space-x-2">
                <button onClick={() => setActiveContact(null)} className="p-1 rounded-full hover:bg-emerald-800">
                  <ArrowLeft size={16} />
                </button>
                <div className={`w-6 h-6 rounded-full ${activeContact.avatarColor} flex items-center justify-center font-bold text-[10px]`}>
                  {activeContact.name[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold truncate max-w-[124px]">{activeContact.name}</h3>
                  <p className="text-[9px] text-emerald-300 font-mono mt-0.5">
                    {typing ? "正在輸入 (Typing)..." : "在線 (Online)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bubble logs area */}
            <div ref={chatScrollRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-900 border-x border-slate-950">
              {historyMap[activeContact.id]?.map((msg, idx) => {
                const isMe = msg.sender === "me";
                return (
                  <div 
                    key={msg.id || idx}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[180px] p-2 rounded-xl text-xs leading-relaxed shadow-sm font-sans ${
                        isMe 
                          ? "bg-emerald-600 text-slate-100 rounded-tr-none" 
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-750"
                      }`}
                    >
                      <div>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
              
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 p-2 rounded-xl text-xs rounded-tl-none border border-slate-750/50 flex space-x-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* In-app entry form typing */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-2 bg-slate-950/90 border-t border-slate-850 flex items-center space-x-1"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="發送訊息..."
                className="flex-1 bg-slate-900 border border-slate-800 text-[11px] px-3 py-1.5 rounded-full outline-none text-slate-100 placeholder-slate-500 font-sans"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition disabled:opacity-40 select-none cursor-pointer"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ==========================================
// 5. FILE MANAGER APP
// ==========================================
interface FileManagerProps {
  onBack: () => void;
  files: VirtualFile[];
  onDeleteFile: (file: VirtualFile) => void;
  onOpenApk: (file: VirtualFile) => void;
}

export const FileManagerApp: React.FC<FileManagerProps> = ({ onBack, files, onDeleteFile, onOpenApk }) => {
  const [currentFolder, setCurrentFolder] = useState<"/sdcard" | "/sdcard/Download" | "/sdcard/Pictures">("/sdcard");
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: VirtualFile } | null>(null);

  const filterFiles = files.filter(f => {
    if (currentFolder === "/sdcard") {
      // Return parent base files on root
      return f.path === "/sdcard";
    }
    return f.path === currentFolder;
  });

  const getBreadcrumbs = () => {
    return currentFolder.slice(1).split("/").join(" > ");
  };

  const handleContextMenu = (e: React.MouseEvent, file: VirtualFile) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const handleDelete = () => {
    if (contextMenu) {
      onDeleteFile(contextMenu.file);
      setContextMenu(null);
    }
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-850 font-sans text-slate-200 select-none relative">
      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[100] w-24 bg-slate-800 border border-slate-700 shadow-xl rounded-lg overflow-hidden py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleDelete}
            className="w-full text-left px-3 py-2 hover:bg-red-900/40 text-red-400 text-[10px] font-bold flex items-center space-x-2 transition"
          >
            <Trash2 size={12} />
            <span>刪除 (Delete)</span>
          </button>
        </div>
      )}

      {/* File Top-Bar */}
      <div className="bg-slate-950 p-2.5 border-b border-slate-850 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {selectedFile ? (
            <button onClick={() => setSelectedFile(null)} className="p-1 rounded text-slate-400 hover:bg-slate-850">
              <ArrowLeft size={16} />
            </button>
          ) : (
            currentFolder !== "/sdcard" ? (
              <button onClick={() => setCurrentFolder("/sdcard")} className="p-1 rounded text-slate-400 hover:bg-slate-850">
                <ArrowLeft size={16} />
              </button>
            ) : (
              <button onClick={onBack} className="p-1 rounded text-slate-400 hover:bg-slate-850">
                <ArrowLeft size={16} />
              </button>
            )
          )}
          <FolderOpen size={16} className="text-yellow-500" />
          <span className="text-xs font-bold text-slate-300">檔案管理員 (Explorer)</span>
        </div>
      </div>

      {/* Breadcrumbs path */}
      <div className="bg-slate-950/40 p-1.5 px-3 border-b border-slate-850/50 text-[10px] font-mono text-slate-500 tracking-wide uppercase">
        {selectedFile ? `文件: ${selectedFile.name}` : getBreadcrumbs()}
      </div>

      {/* Directory Viewer */}
      <div className="flex-1 overflow-y-auto p-3">
        {selectedFile ? (
          // Details viewing block
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center space-x-3">
              <ImageIcon size={32} className="text-purple-400" />
              <div>
                <h4 className="font-bold word-break break-all">{selectedFile.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">大小: {selectedFile.size} Bytes • 類型: {selectedFile.type}</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 min-h-36 font-mono text-[10px] whitespace-pre-wrap leading-relaxed overflow-x-auto text-slate-300 select-text">
              {selectedFile.content || "無可視化文字內容。"}
            </div>

            {selectedFile.type === "apk" && (
              <button
                onClick={() => onOpenApk(selectedFile)}
                className="w-full bg-green-500 hover:bg-green-600 text-slate-950 text-xs py-2 font-bold rounded-lg shadow-md transition transform active:scale-98 select-none tracking-wider text-center"
              >
                運行 / 安裝此 APK 包
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Folder Shortcuts if in main root */}
            {currentFolder === "/sdcard" && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => setCurrentFolder("/sdcard/Download")}
                  className="p-3.5 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 shadow-sm flex flex-col items-center content-center text-center cursor-pointer transition active:scale-95 duration-100"
                >
                  <Folder size={24} className="text-sky-400 mb-1" />
                  <span className="text-xs text-slate-200">下載 (Downloads)</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">APK 下載文件夾</span>
                </button>

                <button 
                  onClick={() => setCurrentFolder("/sdcard/Pictures")}
                  className="p-3.5 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 shadow-sm flex flex-col items-center content-center text-center cursor-pointer transition active:scale-95 duration-100"
                >
                  <Folder size={24} className="text-purple-400 mb-1" />
                  <span className="text-xs text-slate-200">圖片 (Pictures)</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">系統快照資訊</span>
                </button>
              </div>
            )}

            {/* List files */}
            {filterFiles.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-sans">
                文件夾為空。未發現任何文檔。
              </div>
            ) : (
              <div className="space-y-1.5">
                {filterFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      if (e.detail === 2) setSelectedFile(file);
                    }}
                    onDoubleClick={() => setSelectedFile(file)}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    className="w-full text-left p-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800/80 flex items-center justify-between transition cursor-pointer active:bg-slate-800"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {file.type === "apk" ? (
                        <div className="p-1.5 bg-green-950 rounded-lg text-green-400"><Layers size={13} /></div>
                      ) : file.type === "image" ? (
                        <div className="p-1.5 bg-purple-950 rounded-lg text-purple-400"><ImageIcon size={13} /></div>
                      ) : (
                        <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400 font-bold font-mono text-[9px]">TXT</div>
                      )}
                      <div className="text-xs min-w-0">
                        <div className="font-sans font-medium text-slate-200 truncate pr-2">{file.name}</div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">{file.size} Bytes • APK 資產</div>
                      </div>
                    </div>
                    <ChevronRight size={12} className="text-slate-600 grow-0 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 6. CAMERA APP VIEW
// ==========================================
interface CameraProps {
  onBack: () => void;
  onSaveFile: (file: VirtualFile) => void;
}

export const CameraApp: React.FC<CameraProps> = ({ onBack, onSaveFile }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorWebcam, setErrorWebcam] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"none" | "cyber" | "vintage" | "mono">("none");
  const videoRef = useRef<HTMLVideoElement>(null);

  const filters = [
    { id: "none", name: "原圖 (Normal)", class: "" },
    { id: "cyber", name: "賽博朋克 (Cyber)", class: "hue-rotate-60 brightness-110 saturate-150 contrast-125" },
    { id: "vintage", name: "復古 (Vintage)", class: "sepia saturate-80 contrast-90" },
    { id: "mono", name: "黑白 (Mono)", class: "grayscale contrast-125" }
  ];

  useEffect(() => {
    async function initWebcam() {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 320, height: 320 }
        });
        setStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        setErrorWebcam(true);
      }
    }
    initWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    // Save image representation
    const imgNum = Math.floor(Math.random() * 90) + 10;
    const dateStr = new Date().toLocaleDateString();
    
    onSaveFile({
      name: `Capture_IMG_0${imgNum}.txt`,
      path: "/sdcard/Pictures",
      size: 320,
      type: "image",
      content: `[CAPTURED SIMULATED PHOTO]
Timestamp: ${new Date().toLocaleTimeString()}
Date: ${dateStr}
Image Filter Applied: "${selectedFilter.toUpperCase()}"
Lens Status: 100% Correct Exposure
Goldfish Web Renderer 64bit Image Encoding: Done.`
    });

    alert("Simulated Photo snapped and saved to Explorer directory (/sdcard/Pictures)!");
  };

  return (
    <div className="flex flex-col h-full bg-black text-white select-none">
      {/* Camera top-bar */}
      <div className="flex items-center justify-between p-3 bg-neutral-950">
        <button onClick={onBack} className="p-1 rounded-full text-white hover:bg-neutral-800">
          <ArrowLeft size={16} />
        </button>
        <span className="text-[11px] font-sans font-black uppercase text-amber-500 flex items-center gap-1">
          <Sparkles size={11} className="animate-spin" />
          <span>SD-Camera Pro</span>
        </span>
        <div className="w-5"></div>
      </div>

      {/* Screen view finder frame */}
      <div className="flex-1 overflow-hidden relative bg-neutral-900 border-2 border-slate-950 flex items-center justify-center">
        {errorWebcam ? (
          <div className="flex flex-col items-center p-3 text-center space-y-2">
            <CameraOff size={32} className="text-slate-600" />
            <h4 className="text-xs font-bold text-slate-400">相機未啟用 (Webcam Inactive)</h4>
            <p className="text-[9px] text-slate-500 leading-normal max-w-[200px]">當前沙盒環境限制了即時鏡頭訪問。正在模擬專業攝影傳感器狀態！</p>
            <div className={`w-36 h-36 bg-gradient-to-tr from-purple-900 to-sky-900 border border-slate-800 rounded-xl flex items-center justify-center relative shadow-inner overflow-hidden ${filters.find(f => f.id === selectedFilter)?.class}`}>
              <span className="text-[10px] text-slate-300 font-mono animate-pulse">鏡頭活躍中 (LENS ACTIVE)</span>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
            className={`w-full h-full object-cover transition-all duration-200 ${filters.find(f => f.id === selectedFilter)?.class}`}
          />
        )}
      </div>

      {/* Filters selector */}
      <div className="p-2 bg-neutral-950 flex justify-center gap-1 overflow-x-auto border-t border-neutral-900">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id as any)}
            className={`px-2.5 py-1 rounded text-[9px] font-sans tracking-wide cursor-pointer transition select-none shrink-0 ${
              selectedFilter === filter.id 
                ? "bg-amber-600 text-white font-bold" 
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* Camera footer controls shutter */}
      <div className="p-4 bg-black flex justify-around items-center h-20">
        <div className="w-8"></div>
        <button 
          onClick={handleCapture}
          className="w-12 h-12 rounded-full border-4 border-white bg-slate-900 focus:scale-95 active:bg-white hover:scale-105 transform duration-150 flex items-center justify-center transition cursor-pointer"
        ></button>
        <div className="w-8"></div>
      </div>
    </div>
  );
};
