import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, PlayCircle, ShieldAlert, Cpu, Sparkles, Send } from "lucide-react";
import { AISynthesizedApp, MobileApp } from "../types";
import { DynamicIcon } from "./DynamicIcon";

const getOfflineAIAnswer = (appName: string, userInput: string): string => {
  const cleanInput = (userInput || "").trim();
  
  if (appName.toLowerCase().includes("game") || appName.toLowerCase().includes("play") || appName.toLowerCase().includes("mario") || appName.toLowerCase().includes("dodge")) {
    return `[遊戲引擎核心 (Game Engine Override)]\n偵測到玩家操作指令 [${cleanInput || "直接推進"}], 正在更新物理渲染通道...\n核心遊戲數值已重設且完成快取同步，狀態：運作中 (Running)。`;
  }
  
  if (appName.toLowerCase().includes("note") || appName.toLowerCase().includes("task") || appName.toLowerCase().includes("todo") || appName.toLowerCase().includes("memo")) {
    return `[記事本系統日誌 (Notepad Sync Log)]\n「${cleanInput || "新備忘事件"}」事項已成功追加。已儲存至虛擬快取與快閃晶片磁軌。[離線備存狀態: OK]`;
  }

  if (appName.toLowerCase().includes("music") || appName.toLowerCase().includes("audio") || appName.toLowerCase().includes("sound")) {
    return `[等化器調校 (EQ Tuner Status)]\n正在重新解碼「${cleanInput || "主旋律"}」之音訊協定... 數位取樣率已強制對齊 WASM 24bit 輸出！`;
  }

  return `[模擬裝置本機核心]\n偵測使用者發動核心指令:「${cleanInput || "(空白項目)"}」。\n在 GitHub Pages 等本機靜態演示中，所有輸入都會被寫入虛擬狀態記憶區，運作狀態一切正常！`;
};

interface AIAppContainerProps {
  app: MobileApp;
  onBack: () => void;
  onLogSystem: (log: string) => void;
}

export const AIAppContainer: React.FC<AIAppContainerProps> = ({ app, onBack, onLogSystem }) => {
  const schema = app.aiSchema;
  if (!schema) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white p-6 text-center">
        <ShieldAlert size={40} className="text-red-500 mb-2 animate-bounce" />
        <h3 className="text-xs font-bold font-sans">Sandbox Package Loading Error</h3>
        <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">The Android Package Installer returned empty DEX headers for application.</p>
        <button onClick={onBack} className="mt-4 px-3 py-1 bg-slate-800 text-xs rounded-lg">Go back</button>
      </div>
    );
  }

  // 1. Initialize local state of the dynamic app using the initialState returned from Gemini
  const [appState, setAppState] = useState<Record<string, any>>(() => {
    return { ...(schema.initialState || {}) };
  });

  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [loadingAI, setLoadingAI] = useState(false);

  const activeScreen = schema.screens?.[activeScreenIndex] || schema.screens?.[0];

  useEffect(() => {
    onLogSystem(`LAUNCH_DEX: Initializing container runtime sandbox for package ${schema.packageName}`);
  }, []);

  // 2. Event Action dispatcher
  const handleElementAction = async (element: any) => {
    const actionType = element.action;
    const target = element.actionTarget;
    const value = element.actionValue;

    if (!actionType || !target) return;

    onLogSystem(`EVENT_INTENT: Package action trigger [${actionType}] on element ID "${element.id}" -> Target: "${target}"`);

    if (actionType === "setState") {
      setAppState(prev => ({ ...prev, [target]: value }));
    } else if (actionType === "increment") {
      setAppState(prev => {
        const num = Number(prev[target]) || 0;
        return { ...prev, [target]: num + (Number(value) || 1) };
      });
    } else if (actionType === "appendLog") {
      setAppState(prev => {
        const text = prev[target] ? String(prev[target]) : "";
        const lines = text.split("\n");
        if (lines.length > 5) lines.shift(); // keep short
        return { ...prev, [target]: [...lines, `• ${value}`].join("\n") };
      });
    } else if (actionType === "triggerAIAnswer") {
      // 3. Dynamic smart AI query handler inside simulated apk!
      setLoadingAI(true);
      const userInputValue = appState[element.id + "_input"] || "";
      
      try {
        onLogSystem(`AI_RPC: Invoking context prediction proxy for synthesized action element "${element.id}"`);
        
        const contextPrompt = `You are a helper backend node for a simulated Android App called "${schema.name}".
The user is interacting with an input field inside this simulated app and clicked an action element.
Here is the current reactive key-value state of the application:
${JSON.stringify(appState, null, 2)}

User Input entered: "${userInputValue}"
Your goal: Generate a realistic response, dataset, text log, outcome, or simulation result that fits the purpose of ${schema.name} perfectly.
Keep your answer highly interesting, brief, and under 2-3 sentences max. Do not output JSON. Just output standard visual markdown or plain text.`;

        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactName: `${schema.name} Backend Optimizer`,
            chatHistory: [],
            message: contextPrompt
          })
        });
        
        if (!response.ok) throw new Error("API server reported errors.");
        
        const data = await response.json();
        
        setAppState(prev => ({
          ...prev,
          [target]: data.reply || "Optimization process complete."
        }));
      } catch (err) {
        setAppState(prev => ({
          ...prev,
          [target]: getOfflineAIAnswer(schema.name || "Custom Widget", userInputValue)
        }));
      } finally {
        setLoadingAI(false);
      }
    }
  };

  const handleInputChange = (elementId: string, val: string) => {
    setAppState(prev => ({ ...prev, [elementId + "_input"]: val }));
  };

  const themeHex = schema.themeColor || "#10b981";

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-slate-100 relative select-none">
      {/* App Header themed */}
      <div 
        className="p-3.5 flex items-center justify-between shadow-md text-white select-none transition-colors border-b border-transparent duration-300"
        style={{ backgroundColor: themeHex }}
      >
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-black/20">
            <ArrowLeft size={16} />
          </button>
          <DynamicIcon name={schema.iconName || "Play"} className="text-white" size={16} />
          <div>
            <h3 className="text-xs font-bold leading-none">{schema.name}</h3>
            <span className="text-[8px] opacity-60 font-mono tracking-wide block mt-1">{schema.packageName}</span>
          </div>
        </div>
        <span className="text-[9px] bg-black/30 text-white font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 select-none">
          <Sparkles size={10} className="text-yellow-300 animate-pulse" />
          <span>AI emulation running</span>
        </span>
      </div>

      {/* Screen Multi-Tabs Menu Indicator if multiple screen sizes exist */}
      {schema.screens && schema.screens.length > 1 && (
        <div className="flex bg-slate-900 border-b border-slate-800 text-[10px] select-none font-semibold uppercase tracking-wider overflow-x-auto shrink-0 w-full font-sans">
          {schema.screens.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreenIndex(idx)}
              className={`flex-1 text-center py-2 transition-all ${
                activeScreenIndex === idx 
                  ? "text-white border-b-2" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
              style={{ borderBottomColor: activeScreenIndex === idx ? themeHex : "transparent" }}
            >
              {sc.title || `Screen ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Screen Space Active Rendering */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 font-sans pb-8 select-text">
        <h2 className="text-sm font-black border-l-2 pl-2 border-dashed text-slate-200" style={{ borderLeftColor: themeHex }}>
          {activeScreen?.title || "Main Working Surface"}
        </h2>

        {/* Dynamic Items Builder */}
        {activeScreen?.elements && activeScreen.elements.map((element, eIdx) => {
          const boundVal = element.valueParam ? appState[element.valueParam] : null;

          switch (element.type) {
            case "header":
              return (
                <h4 key={element.id || eIdx} className={`text-base font-black tracking-tight ${element.className || "text-white"}`}>
                  {element.label}
                </h4>
              );

            case "text":
              return (
                <div key={element.id || eIdx} className={`p-3 bg-slate-900 rounded-xl border border-slate-800 leading-relaxed text-[10px] text-slate-300 ${element.className || ""}`}>
                  {element.label && <div className="font-semibold text-slate-400 mb-1">{element.label}</div>}
                  <div className="whitespace-pre-wrap font-sans text-[11px] text-white">
                    {boundVal !== null ? String(boundVal) : ""}
                  </div>
                </div>
              );

            case "button":
              return (
                <button
                  key={element.id || eIdx}
                  onClick={() => handleElementAction(element)}
                  disabled={loadingAI}
                  className={`w-full py-2 px-3 hover:opacity-90 active:scale-98 transition transform rounded-xl select-none font-sans font-bold text-xs shadow-md tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer text-white`}
                  style={{ backgroundColor: themeHex }}
                >
                  {element.action === "triggerAIAnswer" && <Sparkles size={12} className="text-yellow-300 animate-spin" />}
                  <span>{element.label}</span>
                </button>
              );

            case "input":
              const rawInput = appState[element.id + "_input"] || "";
              return (
                <div key={element.id || eIdx} className="space-y-1.5 font-sans text-xs">
                  {element.label && <label className="text-slate-400 text-[10px] block font-medium uppercase tracking-wider">{element.label}</label>}
                  <div className="flex items-center space-x-1 border border-slate-800 bg-slate-900 p-1.5 rounded-xl">
                    <input 
                      type="text"
                      value={rawInput}
                      onChange={(e) => handleInputChange(element.id, e.target.value)}
                      placeholder={element.placeholder || "Enter parameter..."}
                      className="flex-1 bg-transparent border-none text-[11px] px-1 outline-none text-white font-sans"
                    />
                  </div>
                </div>
              );

            case "list":
              return (
                <div key={element.id || eIdx} className="space-y-1.5">
                  {element.label && <label className="text-slate-400 text-[9px] font-sans block font-semibold uppercase tracking-widest">{element.label}</label>}
                  <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    {element.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between py-1 border-b border-slate-800/40 text-[10px] font-sans pb-1.5">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-mono text-white font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return (
                <div key={element.id || eIdx} className="text-[10px] p-2 bg-slate-900/40 font-mono text-slate-500 rounded text-center">
                  Unknown Widget Element ({element.type})
                </div>
              );
          }
        })}

        {/* Global Loading Overlay inside Sandboxed App if AI works */}
        <AnimatePresence>
          {loadingAI && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-40 select-none"
            >
              <Cpu size={36} className="text-yellow-400 animate-pulse mb-3" />
              <div className="font-bold text-xs tracking-wide">AI Sandbox Inference Running</div>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Gemini Compiler is computing simulated backend responses on local WASM variables. Enjoy the immersive experience!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
