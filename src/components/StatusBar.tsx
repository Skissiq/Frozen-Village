import React, { useState, useEffect } from "react";
import { Wifi, Battery, BatteryCharging, Bluetooth, Volume2, RotateCw, Plane, Sun, BellOff, VolumeX } from "lucide-react";
import { EmulatorHardwareState } from "../types";

interface StatusBarProps {
  state: EmulatorHardwareState;
  onPullShade: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ state, onPullShade }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Taipei / Local time zone updater
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      onClick={onPullShade}
      className="h-7 bg-slate-950/90 text-white flex items-center justify-between px-3 text-[10px] select-none cursor-pointer border-b border-slate-900/30 backdrop-blur-md relative z-40 active:bg-slate-900 transition"
    >
      {/* Visual Carrier / Time */}
      <div className="flex items-center space-x-1 font-sans font-semibold tracking-wide">
        <span>{time}</span>
        {state.isAirplaneMode && <Plane size={9} className="text-amber-400 rotate-90" />}
      </div>

      {/* Hardware Camera Notch simulation */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-14 h-4 bg-black rounded-b-xl border-x border-b border-slate-900 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-950 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-950"></div>
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center space-x-1.5 font-sans">
        {state.activeBluetooth && <Bluetooth size={9} className="text-blue-400" />}
        {state.notificationTone === false && <BellOff size={9} className="text-red-400" />}
        {state.activeWifi ? (
          <Wifi size={9} className="text-slate-100" />
        ) : (
          <Wifi size={9} className="text-slate-600 line-through" />
        )}
        
        <div className="flex items-center space-x-0.5">
          <span className="text-[9px] font-mono text-slate-300 font-bold">{state.batteryLevel}%</span>
          {state.isCharging ? (
            <BatteryCharging size={10} className="text-green-400 animate-pulse" />
          ) : (
            <Battery size={10} className={state.batteryLevel < 20 ? "text-red-500 animate-bounce" : "text-slate-100"} />
          )}
        </div>
      </div>
    </div>
  );
};
