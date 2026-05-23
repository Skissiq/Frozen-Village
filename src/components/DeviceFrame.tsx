import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Power, Volume2, VolumeX, RefreshCw, Layers, CornerDownLeft, Circle, ChevronLeft, LayoutGrid, RotateCw } from "lucide-react";
import { EmulatorHardwareState } from "../types";

interface DeviceFrameProps {
  children: React.ReactNode;
  state: EmulatorHardwareState;
  onPowerToggle: () => void;
  onVolumeChange: (val: number) => void;
  onOrientationToggle: () => void;
  onSystemReset: () => void;
  onBackKey: () => void;
  onHomeKey: () => void;
  onRecentsKey: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  state,
  onPowerToggle,
  onVolumeChange,
  onOrientationToggle,
  onSystemReset,
  onBackKey,
  onHomeKey,
  onRecentsKey
}) => {
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);
  const [volumeTimer, setVolumeTimer] = useState<any>(null);

  const triggerVolumeKey = (direction: "UP" | "DOWN") => {
    let nextVol = state.volumeLevel;
    if (direction === "UP") {
      nextVol = Math.min(10, state.volumeLevel + 1);
    } else {
      nextVol = Math.max(0, state.volumeLevel - 1);
    }
    
    onVolumeChange(nextVol);
    
    // Trigger on-screen graphic overlay
    setShowVolumeOverlay(true);
    if (volumeTimer) clearTimeout(volumeTimer);
    const timer = setTimeout(() => {
      setShowVolumeOverlay(false);
    }, 2000);
    setVolumeTimer(timer);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 gap-6 max-w-[95%] mx-auto select-none">
      
      {/* 1. Left Control Utility Deck (Hardware panel controllers) */}
      <div className="flex flex-row md:flex-col gap-2 p-3 bg-[#111] border border-[#222] rounded-2xl shadow-xl select-none shrink-0 text-white font-sans">
        <div className="hidden md:block text-[#666] font-mono text-[9px] uppercase tracking-wider text-center border-b border-[#222] pb-2 mb-2">硬件控制</div>
        
        {/* Power switch button */}
        <button
          onClick={onPowerToggle}
          title="電源鍵"
          className="p-2 ml-1 rounded-xl bg-slate-950 border border-red-950/40 hover:bg-red-950/20 hover:border-red-900/40 text-red-500 transition select-none flex items-center justify-center cursor-pointer active:scale-95 duration-100"
        >
          <Power size={15} />
        </button>

        {/* Rotation switch button */}
        <button
          onClick={onOrientationToggle}
          title="旋轉屏幕"
          className="p-2 ml-1 rounded-xl bg-slate-950 border border-[#222] hover:bg-[#1a1a1a] text-purple-400 transition select-none flex items-center justify-center cursor-pointer active:scale-95 duration-100"
        >
          <RotateCw size={15} />
        </button>

        {/* Reset Virtual kernel switch */}
        <button
          onClick={onSystemReset}
          title="重啟設備"
          className="p-2 ml-1 rounded-xl bg-slate-950 border border-[#222] hover:bg-[#1a1a1a] text-amber-500 transition select-none flex items-center justify-center cursor-pointer active:scale-95 duration-100"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* 2. Main Physical Mobile Bezel Wrapper */}
      <div className="relative justify-center items-center flex select-none">
        
        {/* Physical volume and power buttons attached to side casing */}
        <div className="absolute right-[-4px] top-20 w-[4px] h-12 bg-neutral-800 rounded-r border-r border-[#333] cursor-pointer active:bg-neutral-500" onClick={() => triggerVolumeKey("UP")}></div>
        <div className="absolute right-[-4px] top-36 w-[4px] h-11 bg-neutral-800 rounded-r border-r border-[#333] cursor-pointer active:bg-neutral-500" onClick={() => triggerVolumeKey("DOWN")}></div>
        <div className="absolute right-[-4px] top-56 w-[4px] h-10 bg-neutral-900 rounded-r border-r border-[#333] cursor-pointer active:bg-red-500" onClick={onPowerToggle}></div>

        <motion.div 
          animate={{ rotate: state.isPortrait ? 0 : 0 }} // Keep static frame but rotate inner layout if requested
          className={`bg-[#111] duration-300 p-4 pt-5 pb-5 rounded-[48px] shadow-2xl border-[12px] border-[#252525] relative overflow-hidden transition-all ${
            state.isPortrait ? "w-[480px] h-[900px] max-h-[90vh]" : "w-[1100px] h-[750px] max-h-[90vh]"
          }`}
        >
          {/* Internal Glass glare reflection */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/3 pointer-events-none transform -skew-y-12"></div>

          {/* Liquid Screen display panel */}
          <div className="w-full h-full bg-slate-950 rounded-[28px] overflow-hidden relative border border-slate-950 flex flex-col justify-between">
            
            {/* Display screen body wrapper */}
            <div className="flex-1 relative overflow-hidden">
              {state.isPowerOn ? (
                <>
                  {children}

                  {/* On-screen visual volume overlay slider indicator */}
                  <AnimatePresence>
                    {showVolumeOverlay && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute right-3 top-[35%] bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 flex flex-col items-center gap-2 z-50 select-none"
                      >
                        {state.volumeLevel === 0 ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} className="text-blue-400" />}
                        <div className="w-1.5 h-16 bg-slate-800 rounded-full relative overflow-hidden">
                          <div 
                            className="bg-blue-500 absolute bottom-0 left-0 right-0 rounded-full transition-all duration-100" 
                            style={{ height: `${state.volumeLevel * 10}%` }}
                          />
                        </div>
                        <span className="text-[8px] font-mono text-slate-400">{state.volumeLevel}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                // Standby Black screen
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-slate-700 font-sans cursor-pointer" onClick={onPowerToggle}>
                  <Power size={24} className="text-neutral-800 animate-pulse mb-1" />
                  <span className="text-[10px] tracking-widest text-[#444] font-bold">電源已經斷開 (POWER OFF)</span>
                </div>
              )}
            </div>

            {/* Simulated Android Material navigation gesture bar or standard keys */}
            {state.isPowerOn && (
              <div className="h-[46px] bg-slate-950 flex items-center justify-around text-slate-400 border-t border-slate-900/30 shrink-0 relative z-40 select-none pb-1.5">
                {/* BACK KEY */}
                <button 
                  onClick={onBackKey} 
                  title="返回"
                  className="p-2 px-5 hover:bg-white/5 rounded-full active:opacity-75 transition cursor-pointer flex items-center justify-center select-none"
                >
                  <div className="w-2.5 h-2.5 border-2 border-white/30 rounded-xs rotate-45" />
                </button>
                {/* HOME KEY */}
                <button 
                  onClick={onHomeKey} 
                  title="主頁"
                  className="p-2 px-5 hover:bg-white/5 rounded-full active:opacity-75 transition cursor-pointer flex items-center justify-center select-none"
                >
                  <div className="w-2.5 h-2.5 border-2 border-white/30 rounded-full" />
                </button>
                {/* RECENTS PACKAGES KEY */}
                <button 
                  onClick={onRecentsKey} 
                  title="最近任務"
                  className="p-2 px-5 hover:bg-white/5 rounded-full active:opacity-75 transition cursor-pointer flex items-center justify-center select-none"
                >
                  <div className="w-2.5 h-2.5 border-2 border-white/30 rounded-xs" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
