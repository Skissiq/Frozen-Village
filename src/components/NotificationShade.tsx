import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wifi, Bluetooth, Flashlight, Moon, Sun, Plane, RotateCw, Volume2, 
  Settings, User, ChevronUp, Bell, AlertTriangle, Layers, ShieldAlert 
} from "lucide-react";
import { EmulatorHardwareState } from "../types";

interface NotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  state: EmulatorHardwareState;
  onToggleHardware: (key: keyof EmulatorHardwareState) => void;
  onVolumeChange: (val: number) => void;
  onOpenSettings: () => void;
  installingPackageName: string | null;
  installProgress: number;
}

export const NotificationShade: React.FC<NotificationShadeProps> = ({
  isOpen,
  onClose,
  state,
  onToggleHardware,
  onVolumeChange,
  onOpenSettings,
  installingPackageName,
  installProgress
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute inset-x-0 top-0 h-[82%] bg-slate-950/95 backdrop-blur-xl border-b border-slate-850 shadow-2xl z-50 rounded-b-2xl overflow-hidden flex flex-col justify-between font-sans text-white select-none"
        >
          <div className="p-4 space-y-4">
            {/* Shade Header Quick tools */}
            <div className="flex justify-between items-center bg-slate-900/40 p-1.5 px-3 rounded-full border border-slate-800">
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-slate-400 font-mono">網絡運營商 (Carrier):</span>
                <span className="text-[10px] text-blue-400 font-bold tracking-wide uppercase">AI Studio (5G)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <button 
                  onClick={() => { onOpenSettings(); onClose(); }}
                  className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300"
                >
                  <Settings size={12} />
                </button>
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center font-bold text-[9px]">U</div>
              </div>
            </div>

            {/* Quick Settings Grid Tiles (Material Design Style) */}
            <div className="grid grid-cols-3 gap-2">
              {/* Wi-Fi Toggle */}
              <button 
                onClick={() => onToggleHardware("activeWifi")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 duration-100 ${
                  state.activeWifi 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                <Wifi size={15} />
                <span className="text-[9px] font-medium mt-1 uppercase tracking-wider">Wi-Fi</span>
              </button>

              {/* Bluetooth Toggle */}
              <button 
                onClick={() => onToggleHardware("activeBluetooth")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 duration-100 ${
                  state.activeBluetooth 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                <Bluetooth size={15} />
                <span className="text-[9px] font-medium mt-1 uppercase tracking-wider">Bluetooth</span>
              </button>

              {/* Flashlight Torch Toggle */}
              <button 
                onClick={() => onToggleHardware("isFlashlightOn")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 duration-100 ${
                  state.isFlashlightOn 
                    ? "bg-yellow-500 border-yellow-400 text-slate-950 font-bold" 
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                <Flashlight size={15} />
                <span className="text-[9px] font-medium mt-1 uppercase tracking-wider">手電筒</span>
              </button>

              {/* Dark Mode Theme toggle */}
              <button 
                onClick={() => onToggleHardware("isDarkMode")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 duration-100 ${
                  state.isDarkMode 
                    ? "bg-purple-600 border-purple-500 text-white" 
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                {state.isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
                <span className="text-[9px] font-medium mt-1 uppercase tracking-wider">主題</span>
              </button>

              {/* Airplane mode toggle */}
              <button 
                onClick={() => onToggleHardware("isAirplaneMode")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 duration-100 ${
                  state.isAirplaneMode 
                    ? "bg-amber-600 border-amber-500 text-white" 
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                <Plane size={15} />
                <span className="text-[9px] font-medium mt-1 uppercase tracking-wider">飛行模式</span>
              </button>

              {/* Notification Sound Mode Mute toggle */}
              <button 
                onClick={() => onToggleHardware("notificationTone")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 duration-100 ${
                  state.notificationTone 
                    ? "bg-transparent border-slate-800 text-slate-200" 
                    : "bg-red-950/40 border-red-900 text-red-400"
                }`}
              >
                <Bell size={15} />
                <span className="text-[9px] font-medium mt-1 uppercase tracking-wider">聲音</span>
              </button>
            </div>

            {/* Hardware Volume Slider and Indicator */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 space-y-1.5 flex items-center justify-between gap-3">
              <Volume2 size={14} className="text-slate-400" />
              <input 
                type="range"
                min="0"
                max="10"
                value={state.volumeLevel}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="flex-1 accent-blue-500 h-1 rounded-full cursor-pointer bg-slate-800"
              />
              <span className="text-[9.5px] font-mono text-slate-400 w-3">{state.volumeLevel}</span>
            </div>

            {/* Notification Thread Space */}
            <div className="space-y-2">
              <span className="text-[9.5px] text-slate-500 tracking-wider uppercase font-bold block">通知 (Notifications)</span>

              <div className="space-y-1.5 h-36 overflow-y-auto pr-1">
                {/* 1. Installing custom APK indicator state */}
                {installingPackageName ? (
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-blue-900 shadow-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-950 text-blue-400 flex items-center justify-center shrink-0">
                      <Layers className="animate-spin" size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold text-slate-200 block truncate">APK 包編譯器</span>
                        <span className="text-[8px] font-mono text-blue-400">{installProgress}%</span>
                      </div>
                      <span className="text-[8.5px] text-slate-400 block truncate mt-0.5">DEX 編譯中: {installingPackageName}</span>
                      {/* Loading Progress Bar */}
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-100" style={{ width: `${installProgress}%` }} />
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* 2. Standard warning about APK Sandbox limitations */}
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 shadow-sm flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-950/40 border border-amber-900 text-amber-500 flex items-center justify-center shrink-0">
                    <ShieldAlert size={12} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-300 block">DEX 沙盒模式已啟動</span>
                    <span className="text-[8.5px] text-slate-500 mt-0.5 block leading-relaxed">APK 二進制文件在網頁模擬中運行。高保真動態模型已激活。</span>
                  </div>
                </div>

                {/* 3. Simulated network alert if wifi toggled off */}
                {!state.activeWifi && (
                  <div className="p-2.5 bg-red-950/20 rounded-xl border border-red-900/40 shadow-sm flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-950 text-red-500 flex items-center justify-center shrink-0 animate-pulse">
                      <AlertTriangle size={12} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-red-400 block">無網絡連接</span>
                      <span className="text-[8.5px] text-slate-500 mt-0.5 block leading-relaxed">請開啟 Wi-Fi 以請求動態 AI APK 生成或模擬瀏覽。</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Swipe back trigger button */}
          <button 
            onClick={onClose}
            className="w-full p-2 bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 shrink-0"
          >
            <ChevronUp size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
