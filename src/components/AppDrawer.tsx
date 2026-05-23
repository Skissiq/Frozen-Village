import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Grid3X3, ArrowLeft, Plus } from "lucide-react";
import { MobileApp } from "../types";
import { DynamicIcon } from "./DynamicIcon";

interface AppDrawerProps {
  apps: MobileApp[];
  onLaunchApp: (app: MobileApp) => void;
  onOpenApkSelect: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ apps, onLaunchApp, onOpenApkSelect }) => {
  const [search, setSearch] = useState("");

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950/98 backdrop-blur-md text-white select-none font-sans relative">
      {/* Search Header */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
        <div className="flex-1 flex items-center bg-slate-950 rounded-full px-3 py-1 border border-slate-800">
          <Search size={12} className="text-slate-500 mr-2" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋應用程序 (Search)..."
            className="flex-1 bg-transparent border-none text-[11px] font-sans text-slate-100 outline-none placeholder-slate-500"
          />
        </div>
        
        {/* Quick Upload Action */}
        <button 
          onClick={onOpenApkSelect}
          className="p-1 px-2.5 bg-green-600 hover:bg-green-500 rounded-full flex items-center gap-1 text-[10px] select-none font-sans font-bold cursor-pointer transition active:scale-95"
        >
          <Plus size={10} />
          <span>安裝 APK</span>
        </button>
      </div>

      {/* Grid wrapper */}
      <div className="flex-1 overflow-y-auto p-4 select-none pb-12">
        <p className="text-[10px] text-slate-500 font-sans tracking-widest uppercase mb-3">所有已安裝的應用程序</p>
        
        {filteredApps.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-sans">
            未發現相符的應用程序。請在上方安裝 APK 文件！
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => onLaunchApp(app)}
                className="flex flex-col items-center text-center cursor-pointer transition group select-none relative"
              >
                {/* Visual Circle Icon */}
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-95 duration-150 transition relative overflow-hidden"
                  style={{ backgroundColor: app.themeColor || "#22c55e" }}
                >
                  <DynamicIcon name={app.iconName} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" size={18} />
                  
                  {/* Small AI badge overlay if custom generated */}
                  {app.isAiGenerated && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 text-slate-950 flex items-center justify-center text-[7px] font-black rounded-bl shadow-xs">★</div>
                  )}
                </div>
                
                {/* Human legible label */}
                <span className="text-[10px] text-slate-300 font-sans mt-1.5 leading-normal max-w-[56px] truncate group-hover:text-white group-hover:underline">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
