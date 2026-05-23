import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCw, Terminal, Paintbrush, Calculator, Check, ArrowLeft, Gamepad2, Send, Trash2 } from "lucide-react";
import { VirtualFile } from "../types";

// ==========================================
// 1. FLAPPY BIRD SUB-APP
// ==========================================
interface FlappyBirdProps {
  onSaveFile: (file: VirtualFile) => void;
  onBack: () => void;
}

export const FlappyBird: React.FC<FlappyBirdProps> = ({ onSaveFile, onBack }) => {
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("android_emu_flappy_high") || 0);
  });
  
  const [birdY, setBirdY] = useState(150);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; topHeight: number; bottomHeight: number; passed?: boolean }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const GRAVITY = 0.45;
  const JUMP = -6.5;
  const PIPE_SPEED = 2;
  const PIPE_GAP = 95;
  const PIPE_WIDTH = 45;
  const BIRD_SIZE = 20;

  // Jump Trigger
  const jump = () => {
    if (gameState === "IDLE") {
      setGameState("PLAYING");
      setVelocity(JUMP);
    } else if (gameState === "PLAYING") {
      setVelocity(JUMP);
    } else if (gameState === "GAMEOVER") {
      resetGame();
    }
  };

  const resetGame = () => {
    setBirdY(150);
    setVelocity(0);
    setPipes([
      { x: 300, topHeight: 80, bottomHeight: 120 },
      { x: 480, topHeight: 120, bottomHeight: 80 }
    ]);
    setScore(0);
    setGameState("IDLE");
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Main Physics Game Loop
  useEffect(() => {
    if (gameState !== "PLAYING") {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const updatePhysics = () => {
      // 1. Update Bird Y
      setBirdY((prevY) => {
        const nextY = prevY + velocity;
        if (nextY < 0 || nextY > 360) {
          endGame();
          return prevY;
        }
        return nextY;
      });

      // 2. Apply Speed Decay
      setVelocity((prevVel) => prevVel + GRAVITY);

      // 3. Move Pipes
      setPipes((prevPipes) => {
        let updatedPipes = prevPipes.map((pipe) => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED,
        }));

        // Collision Check & Passing Score
        for (let pipe of updatedPipes) {
          // Check collision
          const withinX = pipe.x < 50 + BIRD_SIZE && pipe.x + PIPE_WIDTH > 50;
          if (withinX) {
            const hitTop = birdY < pipe.topHeight;
            const hitBottom = birdY + BIRD_SIZE > 400 - pipe.bottomHeight;
            if (hitTop || hitBottom) {
              endGame();
              return prevPipes;
            }
          }

          // Check passing
          if (pipe.x + PIPE_WIDTH < 50 && !pipe.passed) {
            pipe.passed = true;
            setScore((s) => s + 1);
          }
        }

        // Filter and Regenerate Pipes
        if (updatedPipes[0] && updatedPipes[0].x < -PIPE_WIDTH) {
          updatedPipes.shift();
          const topHeight = Math.floor(Math.random() * 120) + 40;
          const bottomHeight = 400 - topHeight - PIPE_GAP;
          updatedPipes.push({
            x: 350,
            topHeight,
            bottomHeight,
          });
        }

        return updatedPipes;
      });

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, birdY, velocity]);

  const endGame = () => {
    setGameState("GAMEOVER");
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("android_emu_flappy_high", String(score));
      // Save custom score screenshot
      onSaveFile({
        name: `Flappy_Score_${score}.txt`,
        path: "/sdcard/Download",
        size: 154,
        type: "text",
        content: `--- FLAPPY BIRD ARCADE EMULATOR ---
High Score Achieved!
Date: ${new Date().toLocaleDateString()}
Final Score: ${score} points
Player Status: Android OS Champion Developer`
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-sky-900 overflow-hidden relative select-none">
      {/* Top Title Head */}
      <div className="flex items-center justify-between p-3 bg-sky-950 text-white z-10">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-sky-800">
          <ArrowLeft size={18} />
        </button>
        <span className="font-sans font-medium text-sm tracking-wide">飛天安卓 (Flappy Android)</span>
        <span className="text-xs text-yellow-400 font-mono">最高分 (HI): {highScore}</span>
      </div>

      {/* Screen Frame Playfield */}
      <div 
        ref={containerRef}
        onClick={jump}
        className="flex-1 bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 relative cursor-pointer overflow-hidden"
      >
        {/* Animated Clouds */}
        <div className="absolute top-10 left-10 w-16 h-8 bg-white opacity-60 rounded-full blur-xs animate-pulse"></div>
        <div className="absolute top-24 right-12 w-20 h-10 bg-white opacity-50 rounded-full blur-xs"></div>

        {/* Bird character (Green Android head shape) */}
        <motion.div 
          className="absolute w-6 h-6 bg-green-500 rounded-t-full rounded-b-lg flex items-center justify-center border-2 border-green-700 shadow-md"
          style={{ 
            left: 50, 
            top: birdY,
            rotate: velocity * 4 
          }}
          animate={{ scale: gameState === "GAMEOVER" ? [1, 1.2, 1] : 1 }}
        >
          {/* Antennas */}
          <div className="absolute -top-1 left-1 w-0.5 h-1.5 bg-green-700 transform -rotate-12"></div>
          <div className="absolute -top-1 right-1 w-0.5 h-1.5 bg-green-700 transform rotate-12"></div>
          {/* Eyes */}
          <div className="flex space-x-1 justify-between px-1 w-full">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </motion.div>

        {/* Pipes rendering */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            {/* Top Pipe */}
            <div 
              className="absolute bg-gradient-to-r from-green-600 via-green-400 to-green-700 border-2 border-green-900 rounded-b-md"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.topHeight,
              }}
            >
              {/* Pipe Lip */}
              <div className="absolute bottom-0 -left-1 -right-1 h-4 bg-green-800 border-y-2 border-green-950 rounded"></div>
            </div>

            {/* Bottom Pipe */}
            <div 
              className="absolute bg-gradient-to-r from-green-600 via-green-400 to-green-700 border-2 border-green-900 rounded-t-md"
              style={{
                left: pipe.x,
                bottom: 0,
                width: PIPE_WIDTH,
                height: pipe.bottomHeight,
              }}
            >
              {/* Pipe Lip */}
              <div className="absolute top-0 -left-1 -right-1 h-4 bg-green-800 border-y-2 border-green-950 rounded"></div>
            </div>
          </div>
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-800 border-t-4 border-green-600 flex items-center justify-center font-mono text-[10px] text-amber-200">
          ANDROID SD CARD EMULATION BOX
        </div>

        {/* Floating Scores */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <span className="text-4xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-sans">
            {score}
          </span>
        </div>

        {/* Overlay Screen states */}
        <AnimatePresence>
          {gameState === "IDLE" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center"
            >
              <Gamepad2 size={40} className="text-green-400 mb-2 animate-bounce" />
              <h2 className="text-lg font-bold">飛天安卓 v1.0</h2>
              <p className="text-xs text-slate-200 mt-1 max-w-[200px]">點擊螢幕或按空白鍵飛行。避開綠色障礙物！</p>
              <button className="mt-4 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                點擊開始 (TAP TO START)
              </button>
            </motion.div>
          )}

          {gameState === "GAMEOVER" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 bg-red-950/70 flex flex-col items-center justify-center text-white p-4 text-center"
            >
              <span className="text-red-400 font-bold tracking-widest text-lg">遊戲結束 (GAME OVER)</span>
              <span className="text-xs text-slate-300 mt-1">最終分數: {score}</span>
              {score >= highScore && score > 0 && (
                <span className="text-[10px] text-yellow-400 mt-1 font-semibold">🏆 新紀錄！得分證書已保存至下載！</span>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); resetGame(); }}
                className="mt-4 flex items-center space-x-1.5 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-xs font-bold rounded-lg shadow-md"
              >
                <RotateCw size={12} />
                <span>再玩一次 (PLAY AGAIN)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


// ==========================================
// 2. TERMUX (SHELL CONSOLE)
// ==========================================
interface TermuxProps {
  files: VirtualFile[];
  onAddFile: (file: VirtualFile) => void;
  onClearFiles: () => void;
  onBack: () => void;
}

export const Termux: React.FC<TermuxProps> = ({ files, onAddFile, onClearFiles, onBack }) => {
  const [history, setHistory] = useState<string[]>([
    "歡迎使用 Termux (模擬終端)!",
    "安卓核心版本 6.1.42-goldfish",
    "輸入 'help' 以查看有效命令列表。",
    ""
  ]);
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    let replies = [`$ ${trimmed}`];

    switch (base) {
      case "help":
        replies.push(
          "常用模擬器命令:",
          "  help           顯示此幫助指南",
          "  ls             列出虛擬 SD 卡文件系統",
          "  clear          清除命令終端螢幕",
          "  neofetch       顯示模擬安卓系統詳情",
          "  cat [file]     在終端列印文件詳情",
          "  ping [host]    伺服器延遲檢測",
          "  pkg install    安裝自定義模擬包",
          "  rm [file]      刪除 SD 卡文件",
          "  uname -a       顯示底層內核資訊",
          "  whoami         識別當前用戶身份"
        );
        break;

      case "ls":
        replies.push("目錄: /sdcard/");
        if (files.length === 0) {
          replies.push("  (SD 卡文件系統為空)");
        } else {
          files.forEach(f => {
            replies.push(`  -rw-r--r--   ${f.size} B   ${f.path}/${f.name}`);
          });
        }
        break;

      case "clear":
        setHistory([]);
        setCommand("");
        return;

      case "neofetch":
        replies.push(
          "         _  _         android@goldfish-emu",
          "       (o)(o)        --------------------",
          "      /      \\       系統: Android 14 (Upside Down Cake)",
          "     /        \\      內核: Goldfish-Linux-6.1-wasm",
          "     |        |      運行時間: 2 小時 14 分鐘",
          "     \\________/      Shell: bash-sim 5.2",
          "     / ||  || \\      存儲: 3.42 GB / 64 GB",
          "    (___________     CPU: Intel Core i9-Virtual @ 3.2GHz",
          "                     GPU: WebGL 沙盒復古渲染器"
        );
        break;

      case "cat":
        if (!args[0]) {
          replies.push("cat: 缺少參數。用法: cat [文件名]");
        } else {
          const found = files.find(f => f.name.toLowerCase() === args[0].toLowerCase());
          if (found) {
            replies.push(`--- ${found.name} 內容 ---`, found.content || "(文件內容為空)");
          } else {
            replies.push(`cat: ${args[0]}: 未找到目標文件。`);
          }
        }
        break;

      case "ping":
        const target = args[0] || "google.com";
        replies.push(
          `PING ${target} (142.250.72.206) 56(84) bytes of data.`,
          `來自 ${target} 的 64 位元組: icmp_seq=1 ttl=115 時間=23.4 ms`,
          `來自 ${target} 的 64 位元組: icmp_seq=2 ttl=115 時間=18.9 ms`,
          `--- ${target} ping 統計 ---`,
          "2 封包已傳送, 2 已接收, 0% 封包遺失"
        );
        break;

      case "pkg":
        if (args[0] === "install" && args[1]) {
          replies.push(
            `正在獲取軟件庫更新... 完成。`,
            `正在下載包: "${args[1]}"...`,
            `正在將包資產集成至 APK 數據庫...`,
            `安裝成功。應用程序將顯示在桌面！`
          );
          // Auto add a demo APK file to File System
          onAddFile({
            name: `${args[1]}_installed.apk`,
            path: "/sdcard/Download",
            size: 412952,
            type: "apk",
            content: `AI 合成的應用程序元數據二進制配置。由 shell 創建。`
          });
        } else {
          replies.push("用法: pkg install [包名]");
        }
        break;

      case "rm":
        if (!args[0]) {
          replies.push("rm: 缺少文件名。用法: rm [文件名]");
        } else {
          const fileToRm = files.find(f => f.name.toLowerCase() === args[0].toLowerCase());
          if (fileToRm) {
            // Simulated delete
            replies.push(`已從 SD 卡清除 ${fileToRm.name}。`);
          } else {
            replies.push(`rm: 無法移除 '${args[0]}': 未找到文件。`);
          }
        }
        break;

      case "uname":
        replies.push("Linux goldfish-emu 6.1.42-goldfish-wasm-x86_64 SMP PREEMPT Sat May 23 UTC 2026 x86_64 Android");
        break;

      case "whoami":
        replies.push("u0_a152 (模擬無特權 Shell 用戶)");
        break;

      default:
        replies.push(`termux: 未找到命令: ${base}。輸入 'help' 獲取指南。`);
    }

    setHistory(prev => [...prev, ...replies, ""]);
    setCommand("");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(command);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-green-400 select-text">
      {/* Console Top-Bar */}
      <div className="flex items-center justify-between p-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <ArrowLeft size={16} />
          </button>
          <Terminal size={16} className="text-green-500" />
          <span className="text-xs font-bold">Termux 終端箱</span>
        </div>
        <button 
          onClick={onClearFiles}
          className="text-[10px] text-red-400 border border-red-900/30 px-1.5 py-0.5 rounded hover:bg-red-950/20"
        >
          原廠重置磁碟 (Factory Reset)
        </button>
      </div>

      {/* Terminal logs scrolling */}
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto text-xs space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>

      {/* Console bottom input */}
      <form onSubmit={handleSend} className="flex items-center p-2 bg-slate-900 border-t border-slate-800">
        <span className="text-blue-400 text-xs mr-2 font-bold">$</span>
        <input 
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="輸入命令，例如 'neofetch' 或 'ls'..."
          className="flex-1 bg-transparent border-none text-xs outline-none text-green-300 font-mono"
          autoFocus
        />
        <button type="submit" className="text-slate-400 hover:text-green-400">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};


// ==========================================
// 3. PIXEL PAINTER (RETRO EDITOR)
// ==========================================
interface PixelPainterProps {
  onSaveFile: (file: VirtualFile) => void;
  onBack: () => void;
}

export const PixelPainter: React.FC<PixelPainterProps> = ({ onSaveFile, onBack }) => {
  const GRID_SIZE = 12; // 12x12 grid for nice spacing
  const [pixels, setPixels] = useState<string[]>(Array(GRID_SIZE * GRID_SIZE).fill("#ffffff"));
  const [selectedColor, setSelectedColor] = useState("#22c55e"); // Green Default
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    "#ef4444", "#f97316", "#f59e0b", "#22c55e",
    "#3b82f6", "#6366f1", "#a855f7", "#ec4899",
    "#000000", "#64748b", "#cbd5e1", "#ffffff"
  ];

  const handlePixelClick = (index: number) => {
    const updated = [...pixels];
    updated[index] = selectedColor;
    setPixels(updated);
  };

  const handleMouseOver = (index: number) => {
    if (isDrawing) {
      const updated = [...pixels];
      updated[index] = selectedColor;
      setPixels(updated);
    }
  };

  const handleClear = () => {
    setPixels(Array(GRID_SIZE * GRID_SIZE).fill("#ffffff"));
  };

  const handleSave = () => {
    // Generate simulated paint matrix mapping
    const fileContent = `Pixel Art Export Grid [12x12]
Created: ${new Date().toLocaleTimeString()}
Colors used: ${Array.from(new Set(pixels)).join(", ")}
Grid Matrix Layout:
${pixels.map((p, i) => (i % GRID_SIZE === 0 ? "\n" : "") + (p === "#ffffff" ? "░" : "█")).join("")}`;

    const artNum = Math.floor(Math.random() * 900) + 100;
    onSaveFile({
      name: `Art_Grid_No${artNum}.txt`,
      path: "/sdcard/Pictures",
      size: 420,
      type: "image",
      content: fileContent
    });

    alert("Painting logic exported to SD Card Files (/sdcard/Pictures)!");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none relative">
      {/* Paint Top */}
      <div className="flex items-center justify-between p-3 bg-slate-950 text-slate-200">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-800">
          <ArrowLeft size={18} />
        </button>
        <span className="font-sans font-medium text-sm">像素繪圖箱 (Spriter)</span>
        <button 
          onClick={handleSave} 
          className="text-xs bg-green-600 hover:bg-green-700 font-bold px-2.5 py-1 rounded-full flex items-center space-x-1"
        >
          <Check size={11} />
          <span>保存作品 (Save)</span>
        </button>
      </div>

      {/* Color Palette bar */}
      <div className="p-3 bg-slate-800/50 flex justify-between gap-1 overflow-x-auto">
        {colors.map((color, idx) => (
          <button 
            key={idx}
            onClick={() => setSelectedColor(color)}
            className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center cursor-pointer transform hover:scale-110 active:scale-95 shrink-0"
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <span className={`w-1.5 h-1.5 rounded-full ${color === "#ffffff" ? "bg-black" : "bg-white"}`}></span>
            )}
          </button>
        ))}
      </div>

      {/* Visual Workspace Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div 
          className="grid gap-[1px] bg-slate-700 p-1.5 rounded-xl shadow-xl max-w-full"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: "240px",
            height: "240px"
          }}
        >
          {pixels.map((col, idx) => (
            <div 
              key={idx}
              onMouseDown={() => handlePixelClick(idx)}
              onMouseOver={() => handleMouseOver(idx)}
              className="bg-white hover:opacity-85 cursor-crosshair transition-colors"
              style={{ backgroundColor: col }}
            ></div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-4 text-center">
          點按並用滑鼠塗抹以著色瓦片。作品將直接保存至 /sdcard/Pictures!
        </p>
      </div>

      {/* Workspace triggers */}
      <div className="p-3 bg-slate-950 flex justify-center shadow-inner">
        <button 
          onClick={handleClear}
          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs border border-slate-700 rounded-lg font-mono text-slate-300"
        >
          清除畫布 (Clear)
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 4. SMART CALCULATOR APP
// ==========================================
export const AndroidCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  const handleKey = (key: string) => {
    if (key === "C") {
      setDisplay("0");
      setEquation("");
    } else if (key === "DEL") {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay("0");
      }
    } else if (["+", "-", "*", "/"].includes(key)) {
      setEquation(display + " " + key + " ");
      setDisplay("0");
    } else if (key === "=") {
      if (!equation) return;
      try {
        const fullEquation = equation + display;
        // Basic safe manual evaluation to avoid dangerous eval warnings
        const cleanEq = fullEquation.replace(/[^0-9+\-*/. ]/g, "");
        const res = Function(`"use strict"; return (${cleanEq})`)();
        setDisplay(String(res));
        setEquation("");
      } catch {
        setDisplay("Error");
      }
    } else {
      if (display === "0" || display === "Error") {
        setDisplay(key);
      } else {
        setDisplay(display + key);
      }
    }
  };

  const rows = [
    ["C", "DEL", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="]
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white font-sans select-none">
      {/* Calc Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-950">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-neutral-800">
          <ArrowLeft size={18} />
        </button>
        <span className="font-sans text-sm text-neutral-300">計算器 (Calculator)</span>
        <div className="w-5"></div>
      </div>

      {/* Screen Displays */}
      <div className="flex-1 flex flex-col justify-end p-6 bg-neutral-950 text-right">
        <div className="text-neutral-500 font-mono text-sm h-6 mb-1">{equation}</div>
        <div className="text-4xl font-light font-mono truncate tracking-tight">{display}</div>
      </div>

      {/* Keyboard Layout */}
      <div className="p-4 bg-neutral-900 space-y-2 border-t border-neutral-800/60 pb-8">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2">
            {row.map((btn) => {
              const isOperator = ["/", "*", "-", "+", "="].includes(btn);
              const isUtil = ["C", "DEL", "%"].includes(btn);
              const isZero = btn === "0";

              return (
                <button
                  key={btn}
                  onClick={() => handleKey(btn)}
                  className={`h-11 rounded-full text-sm font-medium transition-all duration-100 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 ${
                    isZero ? "flex-2" : "flex-1"
                  } ${
                    isOperator 
                      ? "bg-amber-600 hover:bg-amber-500 text-white" 
                      : isUtil 
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200" 
                      : "bg-neutral-800 hover:bg-neutral-700 text-white"
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
