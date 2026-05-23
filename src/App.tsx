import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import JSZip from "jszip";
import { 
  Plus, Upload, RefreshCw, Smartphone, Search, AppWindow, Play, Sparkles, 
  Trash2, ShieldCheck, Check, X, Chrome, MessageSquare, Compass, 
  FolderOpen, Settings, Camera, Phone, RotateCw, PlayCircle, ArrowLeft
} from "lucide-react";
import { MobileApp, EmulatorHardwareState, VirtualFile } from "./types";
import { DeviceFrame } from "./components/DeviceFrame";
import { StatusBar } from "./components/StatusBar";
import { NotificationShade } from "./components/NotificationShade";
import { AppDrawer } from "./components/AppDrawer";
import { DynamicIcon } from "./components/DynamicIcon";

// Core Sub-apps Lazy / Dynamic Imports
import { PhoneDialer, SettingsApp, SimulatedChrome, WhatsAppMessenger, FileManagerApp, CameraApp } from "./components/CoreApps";
import { FlappyBird, Termux, PixelPainter, AndroidCalculator } from "./components/PlayStoreApps";
import { AIAppContainer } from "./components/AIAppContainer";

export default function App() {
  // 1. Emulator Global Hardware Configuration
  const [hwState, setHwState] = useState<EmulatorHardwareState>({
    isPowerOn: true,
    isScreenLocked: false,
    volumeLevel: 6,
    batteryLevel: 84,
    isCharging: false,
    isPortrait: false,
    activeWifi: true,
    activeBluetooth: true,
    isDarkMode: true,
    isFlashlightOn: false,
    isAirplaneMode: false,
    isAutoRotate: true,
    notificationTone: true,
  });

  // 2. Active Screen Nav Controllers
  const [activeApp, setActiveApp] = useState<MobileApp | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShadeOpen, setIsShadeOpen] = useState(false);
  const [appHistory, setAppHistory] = useState<MobileApp[]>([]);

  // 3. Simulated File Assets & Installed Apps Records
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>([
    {
      name: "welcome_instructions.txt",
      path: "/sdcard/Download",
      size: 342,
      type: "text",
      content: `Welcome to the Android HTML Emulator!
You can:
1. Drag and drop any APK file directly from your machine onto this panel to decompile and run it!
2. Install gorgeous pre-loaded retro arcade titles from the Play Store.
3. Chat with fully intelligent AI contact channels inside Messenger.
4. Take snapshots with the custom camera and preview captures inside explorer.`
    },
    {
      name: "sunset_retro.txt",
      path: "/sdcard/Pictures",
      size: 198,
      type: "image",
      content: `[Solid Image Metadata Vector]
Resolution: 1080x1080
Visual Theme: Amber Glow Neon Sunset
Render Engine: WebGL Goldfish Shader Block`
    }
  ]);

  const [installedApps, setInstalledApps] = useState<MobileApp[]>([
    { id: "com.android.settings", name: "系統設置", iconName: "Settings", category: "system", themeColor: "#475569", isPreinstalled: true },
    { id: "com.android.phone", name: "電話撥號", iconName: "Phone", category: "system", themeColor: "#059669", isPreinstalled: true },
    { id: "com.android.messaging", name: "短訊訊息", iconName: "MessageSquare", category: "system", themeColor: "#10b981", isPreinstalled: true },
    { id: "com.android.chrome", name: "瀏覽器", iconName: "Chrome", category: "system", themeColor: "#2563eb", isPreinstalled: true },
    { id: "com.android.vending", name: "應用商店", iconName: "PlayCircle", category: "system", themeColor: "#f43f5e", isPreinstalled: true },
    { id: "com.android.gallery", name: "檔案管理", iconName: "FolderOpen", category: "system", themeColor: "#d97706", isPreinstalled: true },
    { id: "com.android.camera", name: "相機", iconName: "Camera", category: "system", themeColor: "#6366f1", isPreinstalled: true }
  ]);

  // wallpaper gradients classes tracker
  const [wallpaper, setWallpaper] = useState("bg-gradient-to-tr from-fuchsia-900 via-sky-900 to-black");
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "BOOT_LOADER: Handshaking Goldfish Enterprise WASM Sandbox kernel... Done.",
    "SYS_INIT: Standard device orientation resolved to PORTRAIT_RATIO",
    "NETWORK_MANAGER: Binding virtual NAT address 10.0.2.15 to port 3000 link",
    "PACKAGE_MANAGER: Successfully registered 7 preinstalled DEX micro-containers"
  ]);

  const addSystemLog = (log: string) => {
    setSystemLogs(prev => [`[LOG] ${log}`, ...prev.slice(0, 40)]);
  };

  // 4. Installer states variables for dropped APK files
  const [installingPack, setInstallingPack] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [unstagedAppSchema, setUnstagedAppSchema] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time battery degradation routines
  useEffect(() => {
    const batInterval = setInterval(() => {
      setHwState(prev => {
        let current = prev.batteryLevel;
        if (prev.isCharging) {
          current = Math.min(100, current + 2);
        } else {
          current = Math.max(1, current - 1);
        }
        return { ...prev, batteryLevel: current };
      });
    }, 120000); // drain/charge every 2 minutes

    return () => clearInterval(batInterval);
  }, []);

  // APK Dropper parser
  const parseApkFile = async (file: File) => {
    addSystemLog(`APK_STAGER: Intercepted raw drag drop upload on container viewport "${file.name}"`);
    setInstallingPack(file.name);
    setProgress(15);
    
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      setProgress(40);
      
      const fileNames: string[] = [];
      loadedZip.forEach((relativePath) => {
        fileNames.push(relativePath);
      });
      
      addSystemLog(`APK_PARSER: Found ${fileNames.length} cataloged asset strings inside APK directory structures.`);
      setProgress(60);

      // Submit metadata listing to Express proxy
      const response = await fetch("/api/gemini/app-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apkName: file.name,
          fileList: fileNames.slice(0, 50),
          size: file.size
        })
      });

      if (!response.ok) throw new Error("Server synthesis rejected request structural configurations.");
      
      setProgress(85);
      const generatedSchema = await response.json();
      
      // Stage app for User review installs popup
      setUnstagedAppSchema(generatedSchema);
      setProgress(100);
      addSystemLog(`COMPILER_SUCCESS: Bespoke React layouts fully synthesized in memory for package "${generatedSchema.packageName}"`);
    } catch (err: any) {
      addSystemLog(`STAGER_FAILURE: Manifest compiler failed with statement: ${err.message}`);
      setInstallingPack(null);
      setProgress(0);
      alert(`WASM Stager error: ${err.message}`);
    }
  };

  const handleApplyInstallation = () => {
    if (!unstagedAppSchema) return;

    const newPackageId = unstagedAppSchema.packageName || `com.ai.custom_${Date.now()}`;
    const newAppConf: MobileApp = {
      id: newPackageId,
      name: unstagedAppSchema.name || "AI Generated Widget",
      iconName: unstagedAppSchema.iconName || "Play",
      category: "downloaded_apk",
      themeColor: unstagedAppSchema.themeColor || "#ac22e0",
      isPreinstalled: false,
      isAiGenerated: true,
      aiSchema: unstagedAppSchema
    };

    // Store APK inside local file system list for real explorer views
    const newVirtualApk: VirtualFile = {
      name: `${unstagedAppSchema.name.replace(/\s+/g, "_")}.apk`,
      path: "/sdcard/Download",
      size: 154289,
      type: "apk",
      content: `AI Synthesized Package Meta-Descriptor JSON config.
Package Name: ${newPackageId}
Theme Color: ${unstagedAppSchema.themeColor}
Created on physical sandbox drop binding.`
    };

    setInstalledApps(prev => [newAppConf, ...prev]);
    setVirtualFiles(prev => [newVirtualApk, ...prev]);
    setUnstagedAppSchema(null);
    setInstallingPack(null);
    setProgress(0);
    
    addSystemLog(`DEX_INSTALLED: Package registered on SD card databases. Launching AppDrawer.`);
    setIsDrawerOpen(true);
  };

  const handleDeleteFile = (fileToDelete: VirtualFile) => {
    addSystemLog(`FS_UNLINK: Removing file "${fileToDelete.name}" from ${fileToDelete.path}`);
    setVirtualFiles(prev => prev.filter(f => f.name !== fileToDelete.name || f.path !== fileToDelete.path));
  };

  // Hardware buttons receivers
  const handleHardwareToggle = (key: keyof EmulatorHardwareState) => {
    setHwState(prev => {
      const nextVal = !prev[key];
      addSystemLog(`CHASSIS_KEY: Interface key triggered [${String(key)}] state toggled to ${nextVal}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const handleSystemReboot = () => {
    addSystemLog(`CORE_REBOOT: Initializing software soft reboot cycle sequence...`);
    setHwState(prev => ({ ...prev, isPowerOn: false }));
    setActiveApp(null);
    setIsDrawerOpen(false);
    setIsShadeOpen(false);

    setTimeout(() => {
      setHwState(prev => ({ ...prev, isPowerOn: true, batteryLevel: 100 }));
      addSystemLog(`CORE_REBOOT: Handshaking completed. Allocating virtual resources again.`);
    }, 1500);
  };

  const handleBackKey = () => {
    if (isShadeOpen) {
      setIsShadeOpen(false);
      return;
    }
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      return;
    }
    if (activeApp) {
      addSystemLog(`FINISH_ACTIVITY: Intent returned elements mapping completed. Destroying screen frame.`);
      setActiveApp(null);
    }
  };

  // 5. PlayStore custom item installation callback
  const installDemoPackage = (packageName: string, appName: string, icon: string, brandColor: string, specComponentKey: string) => {
    addSystemLog(`PLAY_STORE: Installing curated retro application "${appName}" into virtual memory...`);
    
    // Add custom simulated prebuilt app
    const appDef: MobileApp = {
      id: packageName,
      name: appName,
      iconName: icon,
      category: "installed",
      themeColor: brandColor,
      isPreinstalled: false,
    };

    setInstalledApps(prev => [appDef, ...prev]);
    addSystemLog(`DEX_LINK: Successfully bound compiled component registry class for "${appName}"`);
  };

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) parseApkFile(e.dataTransfer.files[0]);
      }}
      className="h-screen w-full bg-slate-950 text-white font-sans flex flex-col relative select-none overflow-hidden"
    >
      
      {/* Dynamic Background Flashlight Beam simulation behind workspace */}
      {hwState.isFlashlightOn && (
        <div className="absolute top-24 left-[40%] w-96 h-96 rounded-full bg-yellow-400/10 blur-[130px] pointer-events-none transition duration-500 z-0"></div>
      )}

      {/* Main Artistic Workstation Frame */}
      <div className="flex-1 w-full bg-[#050505] text-[#E0E0E0] md:border-8 border-[#1A1A1A] flex flex-col lg:flex-row relative z-10 shadow-2xl overflow-hidden">
        
        {/* 1. LEFT SIDEBAR: Virtualization controller panel */}
        <aside className="w-full lg:w-64 flex-none border-b lg:border-b-0 lg:border-r border-[#222] flex flex-col bg-[#050505]">
          {/* Header OS Label */}
          <div className="p-6 border-b border-[#222]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-1 font-mono">虛擬化引擎 (Virtualization Engine)</div>
            <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-1.5">
              霓虹系統 (NEON.OS) 
              <span className="text-[10px] bg-[#00FF41]/20 text-[#00FF41] font-mono px-1.5 py-0.5 rounded border border-[#00FF41]/30">V1.3</span>
            </h1>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41] animate-pulse"></span>
              <span className="text-[11px] text-[#888] font-mono">實例_01 正在運行 (RUNNING)</span>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Installed Apps Grid Shortcuts list */}
            <div>
              <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4 font-bold font-mono">本地 APK 庫 (Local Library)</h3>
              <div className="space-y-2">
                {installedApps.slice(0, 5).map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => setActiveApp(app)}
                    className="p-2.5 bg-[#0e0e0e] border border-[#222] hover:bg-[#151515] hover:border-[#333] rounded-xl flex items-center gap-3 cursor-pointer transition duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner" style={{ backgroundColor: app.themeColor }}>
                      <DynamicIcon name={app.iconName} size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">{app.name}</div>
                      <div className="text-[10px] text-[#555] font-mono truncate">{app.id}</div>
                    </div>
                  </div>
                ))}
                
                {/* Visual file picker trigger button inside side deck */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".apk"
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) parseApkFile(e.target.files[0]);
                  }}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-[#222] hover:border-[#333] hover:bg-[#0e0e0e] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer justify-center text-center group"
                >
                  <Upload size={13} className="text-[#666] group-hover:text-green-400 group-hover:scale-110 transition duration-150" />
                  <span className="text-xs text-[#666] group-hover:text-[#aaa] font-medium">安裝本地 APK</span>
                </div>
              </div>
            </div>

            {/* Simulated Live System Telemetries/Resources tracker */}
            <div className="pt-2 border-t border-[#1e1e1e]">
              <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4 font-bold font-mono">系統負載 (System Load)</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1.5"><span className="text-[#666]">CPU 速度</span><span className="text-[#00FF41]">42%</span></div>
                  <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden"><div className="h-full bg-[#00FF41] rounded-full" style={{ width: "42%" }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1.5"><span className="text-[#666]">內存容量</span><span className="text-blue-400">2.6 / 4 GB</span></div>
                  <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} /></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 2. CENTER PANEL: Main Interactive Canvas containing Device Frame and wallpaper */}
        <main className="flex-1 flex flex-col bg-[#080808]">
          {/* Main Top Header Controls bar */}
          <header className="h-16 border-b border-[#222] px-6 flex items-center justify-between shrink-0 bg-[#060606]">
            <div className="flex items-center gap-4">
              <div className="flex gap-2.5">
                <button 
                  onClick={handleBackKey} 
                  title="返回建 (Back)" 
                  className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center hover:bg-[#1c1c1c] hover:border-[#333] transition-all text-[#888] hover:text-white cursor-pointer"
                >
                  &larr;
                </button>
                <button 
                  onClick={() => { setActiveApp(null); setIsDrawerOpen(false); setIsShadeOpen(false); }} 
                  title="返回桌面 (Home)" 
                  className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center hover:bg-[#1c1c1c] hover:border-[#333] transition-all text-[#888] hover:text-white cursor-pointer"
                >
                  &#x25A2;
                </button>
              </div>
              <div className="h-4 w-px bg-[#222]"></div>
              <div className="text-[11px] text-[#666] font-mono tracking-wider">PIXEL_7_PRO (API_33)</div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-mono uppercase tracking-wider hidden sm:inline">沙盒保護已啟動 (SECURE)</span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded uppercase tracking-wider hover:bg-neutral-200 transition cursor-pointer"
              >
                啟動 APK
              </button>
            </div>
          </header>

          {/* Interactive Screen Device workspace holding layout */}
          <div className="flex-1 relative flex items-center justify-center p-4 min-h-[580px] bg-gradient-to-b from-[#080808] to-[#040404]">
            
            <DeviceFrame
              state={hwState}
              onPowerToggle={() => handleHardwareToggle("isPowerOn")}
              onVolumeChange={(v) => setHwState(p => ({ ...p, volumeLevel: v }))}
              onOrientationToggle={() => handleHardwareToggle("isPortrait")}
              onSystemReset={handleSystemReboot}
              onBackKey={handleBackKey}
              onHomeKey={() => { setActiveApp(null); setIsDrawerOpen(false); setIsShadeOpen(false); }}
              onRecentsKey={() => addSystemLog(`SYS_RECENTS: Tasks switching layout trigger (Click Square)`)}
            >
              {/* Visual inner liquid phone Screen display */}
              <div className={`w-full h-full relative flex flex-col justify-between overflow-hidden select-none bg-black filter ${hwState.isDarkMode ? "" : "brightness-110 saturate-[1.05]"}`}>
                
                {/* 1. Status bar block */}
                <StatusBar 
                  state={hwState} 
                  onPullShade={() => setIsShadeOpen(true)}
                />

                {/* 2. Notification Shade Pulldown Overlay */}
                <NotificationShade 
                  isOpen={isShadeOpen}
                  onClose={() => setIsShadeOpen(false)}
                  state={hwState}
                  onToggleHardware={handleHardwareToggle}
                  onVolumeChange={(v) => setHwState(p => ({ ...p, volumeLevel: v }))}
                  onOpenSettings={() => {
                    setActiveApp(installedApps.find(a => a.id === "com.android.settings") || null);
                    setIsShadeOpen(false);
                  }}
                  installingPackageName={installingPack}
                  installProgress={progress}
                />

                {/* 3. Screen body canvas container space */}
                <div className="flex-1 relative overflow-hidden select-none bg-slate-950">
              
              {/* Launcher/Aesthetic Desktop Layout */}
              {!activeApp && !isDrawerOpen && (
                <div className={`absolute inset-0 p-4 flex flex-col justify-between select-none ${wallpaper} transition-all duration-300`}>
                  
                  {/* Big Custom Clock Widget / Google Widget */}
                  <div className="space-y-4">
                    {/* Modern Clock */}
                    <div className="text-center pt-2">
                      <span className="text-3xl font-black text-white/90 drop-shadow-md tracking-widest font-mono">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </span>
                      <span className="text-[9px] text-fuchsia-100 block mt-1 drop-shadow-xs uppercase font-sans tracking-widest leading-none font-semibold">網頁開發者版本 (Web Dev Edition)</span>
                    </div>

                    {/* Glossmorphic Search Widget redirects to Chrome browser */}
                    <div 
                      onClick={() => {
                        const chromeApp = installedApps.find(a => a.id === "com.android.chrome");
                        if (chromeApp) setActiveApp(chromeApp);
                      }}
                      className="w-full bg-white/10 backdrop-blur-md hover:bg-white/15 p-2 rounded-full border border-white/15 flex items-center justify-between text-xs text-white/60 shadow-lg cursor-pointer transition select-none"
                    >
                      <div className="flex items-center space-x-2 pl-2">
                        <Search size={12} className="text-white/70" />
                        <span className="text-[10px] text-slate-300">使用 AI 瀏覽器搜尋...</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px]">G</div>
                    </div>
                  </div>

                  {/* Desktop Grid (6 Core Shortcuts pinned on desktop) */}
                  <div className="grid grid-cols-4 gap-y-5 gap-x-2 mb-2 justify-items-center select-none font-sans">
                    {installedApps.slice(0, 4).map(app => (
                      <button
                        key={app.id}
                        onClick={() => setActiveApp(app)}
                        className="flex flex-col items-center justify-center text-center cursor-pointer transition select-none group"
                      >
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition duration-200 transform group-hover:scale-110 active:scale-95"
                          style={{ backgroundColor: app.themeColor }}
                        >
                          <DynamicIcon name={app.iconName} className="text-white select-none pointer-events-none font-bold" size={16} />
                        </div>
                        <span className="text-[9.5px] text-white font-medium truncate max-w-[50px] mt-1.5 select-none text-shadow font-sans">
                          {app.name}
                        </span>
                      </button>
                    ))}

                    {/* slide App Drawer trigger link */}
                    <button 
                      onClick={() => setIsDrawerOpen(true)}
                      className="flex flex-col items-center justify-center text-center cursor-pointer transition select-none col-start-2 col-span-2 group"
                    >
                      <div className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center shadow-inner select-none transition">
                        <Plus className="text-slate-300 animate-pulse" size={14} />
                      </div>
                      <span className="text-[9px] text-slate-300 font-bold tracking-wide uppercase mt-1">所有應用</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Launcher All Apps Sliding Drawer interface */}
              {isDrawerOpen && !activeApp && (
                <AppDrawer 
                  apps={installedApps}
                  onLaunchApp={(app) => { setActiveApp(app); setIsDrawerOpen(false); }}
                  onOpenApkSelect={() => fileInputRef.current?.click()}
                />
              )}

              {/* Individual Core Applications viewport frames */}
              {activeApp && (
                <div className="absolute inset-0">
                  {/* 1. Settings App Package */}
                  {activeApp.id === "com.android.settings" && (
                    <SettingsApp 
                      onBack={() => setActiveApp(null)} 
                      wallpaper={wallpaper} 
                      setWallpaper={setWallpaper}
                      systemLogs={systemLogs}
                      batteryLevel={hwState.batteryLevel}
                    />
                  )}

                  {/* 2. Dialer Dialpad Phone */}
                  {activeApp.id === "com.android.phone" && (
                    <PhoneDialer onBack={() => setActiveApp(null)} />
                  )}

                  {/* 3. Messages AI chat lite */}
                  {activeApp.id === "com.android.messaging" && (
                    <WhatsAppMessenger onBack={() => setActiveApp(null)} />
                  )}

                  {/* 4. Chrome AI browser */}
                  {activeApp.id === "com.android.chrome" && (
                    <SimulatedChrome onBack={() => setActiveApp(null)} />
                  )}

                  {/* 5. Pictures snapshot files explorer */}
                  {activeApp.id === "com.android.gallery" && (
                    <FileManagerApp 
                      onBack={() => setActiveApp(null)}
                      files={virtualFiles}
                      onDeleteFile={handleDeleteFile}
                      onOpenApk={(file) => {
                        // install app flow
                        addSystemLog(`INSTALLER: Found custom package info inside ${file.name}. Registering...`);
                        alert(`Custom app found! Installing structural elements in memory.`);
                        if (file.name.toLowerCase().includes("installed")) {
                          // Simple prebuilt packages registerer
                          installDemoPackage("com.prebuilt.custom", "Pixel Game", "Gamepad2", "#0ea5e9", "FlappyBird");
                        }
                      }}
                    />
                  )}

                  {/* 6. Camera sensor sandbox */}
                  {activeApp.id === "com.android.camera" && (
                    <CameraApp 
                      onBack={() => setActiveApp(null)}
                      onSaveFile={(file) => setVirtualFiles(prev => [file, ...prev])}
                    />
                  )}

                  {/* 7. PLAY STORE (Allows downloading custom micro-apps) */}
                  {activeApp.id === "com.android.vending" && (
                    <div className="flex flex-col h-full bg-slate-900 border border-slate-850 overflow-hidden font-sans text-slate-200 select-none">
                      <div className="p-3.5 bg-slate-950 flex items-center space-x-2 border-b border-slate-800 shadow-md">
                        <button onClick={() => setActiveApp(null)} className="p-1 rounded hover:bg-slate-850"><ArrowLeft size={16} /></button>
                        <PlayCircle size={15} className="text-rose-500" />
                        <span className="text-xs font-bold">Google Play Store Mobile</span>
                      </div>
                      
                      <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        <p className="text-[10px] text-slate-500 tracking-widest font-semibold uppercase mb-3">Popular Simulated APKs</p>

                        {/* List items with Tap-Install action */}
                        <div className="space-y-3">
                          {[
                            { id: "com.retro.bird", name: "Flappy Bird Arcade", desc: "Physics arcade game with obstacle collision tracking.", icon: "Gamepad2", color: "#eab308" },
                            { id: "com.terminal.termux", name: "Termux Terminal Loader", desc: "Command terminal mimicking shell kernel routines.", icon: "Terminal", color: "#10b981" },
                            { id: "com.designer.pixedit", name: "Pixel Paint Canvas", desc: "Draw high-fidelity retro sprite grids.", icon: "Paintbrush", color: "#a855f7" },
                            { id: "com.util.calc", name: "Math Calculator", desc: "Arithmetic solver widget with modern borders.", icon: "Calculator", color: "#f97316" }
                          ].map(item => {
                            const isInstalled = installedApps.some(a => a.id === item.id);
                            return (
                              <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between gap-3">
                                <div className="flex items-center space-x-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                                    <DynamicIcon name={item.icon} size={15} />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold leading-normal text-slate-200 truncate">{item.name}</h4>
                                    <p className="text-[9.5px] text-slate-500 truncate leading-snug">{item.desc}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => installDemoPackage(item.id, item.name, item.icon, item.color, item.name)}
                                  disabled={isInstalled}
                                  className={`text-[9.5px] font-bold px-2.5 py-1 rounded-full border cursor-pointer select-none transition shrink-0 ${
                                    isInstalled 
                                      ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed" 
                                      : "bg-rose-500 border-rose-400 text-white hover:bg-rose-600"
                                  }`}
                                >
                                  {isInstalled ? "STAGED" : "INSTALL"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CURATED PLAY STORE APP RUNTIME INJECTORS */}
                  {activeApp.id === "com.retro.bird" && (
                    <FlappyBird 
                      onSaveFile={(file) => setVirtualFiles(prev => [file, ...prev])} 
                      onBack={() => setActiveApp(null)}
                    />
                  )}

                  {activeApp.id === "com.terminal.termux" && (
                    <Termux 
                      files={virtualFiles}
                      onAddFile={(newFile) => setVirtualFiles(prev => [newFile, ...prev])}
                      onClearFiles={() => setVirtualFiles([])}
                      onBack={() => setActiveApp(null)}
                    />
                  )}

                  {activeApp.id === "com.designer.pixedit" && (
                    <PixelPainter 
                      onSaveFile={(file) => setVirtualFiles(prev => [file, ...prev])}
                      onBack={() => setActiveApp(null)}
                    />
                  )}

                  {activeApp.id === "com.util.calc" && (
                    <AndroidCalculator onBack={() => setActiveApp(null)} />
                  )}

                  {/* 8. DYNAMIC CUSTOM GEMINI SYNTHESIZED AI APPLICATION VIEWPORT CONTAINER */}
                  {activeApp.isAiGenerated && (
                    <AIAppContainer 
                      app={activeApp} 
                      onBack={() => setActiveApp(null)}
                      onLogSystem={addSystemLog}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </DeviceFrame>
      </div>
    </main>

    {/* 3. RIGHT SIDEBAR: Live Log Stream and Sensory Diagnostics */}
    <aside className="w-full lg:w-[320px] flex-none border-t lg:border-t-0 lg:border-l border-[#222] flex flex-col bg-[#050505]">
      <div className="p-6 border-b border-[#222]">
        <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4 font-bold font-mono">日誌流 (Log Stream)</h3>
        <div className="space-y-2 font-mono text-[9.5px] h-[340px] overflow-y-auto pr-1">
          {systemLogs.map((log, idx) => {
            let logColorClass = "text-slate-300";
            if (log.includes("FAILURE") || log.includes("Error") || log.includes("REJECTED")) {
              logColorClass = "text-red-400 font-semibold";
            } else if (log.includes("SUCCESS") || log.includes("BOOT") || log.includes("DEX_LINK") || log.includes("registered")) {
              logColorClass = "text-[#00FF41]";
            } else if (log.includes("STAGER") || log.includes("PLAY_STORE") || log.includes("Emulator")) {
              logColorClass = "text-yellow-400";
            }
            return (
              <div key={idx} className={`${logColorClass} leading-tight`}>
                <span className="text-[#444] mr-1.5">&#91;{new Date().toLocaleTimeString([], { hour12: false })}&#93;</span>
                {log}
              </div>
            );
          })}
          <div className="text-[#333] italic text-[8.5px]">監控 Goldfish VM 實時事件...</div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4 font-bold font-mono">傳感器與節點狀態</h3>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3 bg-[#0c0c0c] rounded-xl border border-[#1a1a1a]">
              <div className="text-[9px] text-[#555] mb-1 uppercase tracking-wider font-semibold font-mono">電池 (BATTERY)</div>
              <div className="text-sm font-bold text-white flex items-center justify-between font-mono">
                <span>{hwState.batteryLevel}%</span>
                <span className={`w-1.5 h-1.5 rounded-full ${hwState.isCharging ? "bg-green-400 animate-pulse" : hwState.batteryLevel < 20 ? "bg-red-500 animate-bounce" : "bg-[#00FF41]"}`}></span>
              </div>
            </div>
            <div className="p-3 bg-[#0c0c0c] rounded-xl border border-[#1a1a1a]">
              <div className="text-[9px] text-[#555] mb-1 uppercase tracking-wider font-semibold font-mono">延遲 (LATENCY)</div>
              <div className="text-sm font-bold text-white font-mono">12ms</div>
            </div>
            <div className="p-3 bg-[#0c0c0c] rounded-xl border border-[#1a1a1a] col-span-2">
              <div className="text-[9px] text-[#555] mb-1 uppercase tracking-wider font-semibold font-mono">網絡速度 (NETWORK)</div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-lg font-black text-white">{hwState.activeWifi ? "420" : "0"}</span>
                <span className="text-[9px] text-[#444] uppercase font-bold">{hwState.activeWifi ? "MBPS / 5G 鏈接" : "已斷開連接"}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSystemReboot} 
          className="w-full py-2.5 bg-transparent border border-[#222] hover:border-[#333] rounded-xl text-[10px] text-zinc-400 font-mono uppercase tracking-widest hover:text-white transition duration-150 cursor-pointer active:scale-95 text-center"
        >
          重啟虛擬設備
        </button>
      </div>
    </aside>
  </div>

      {/* APK Installation Permission stage visual overlay popup */}
      <AnimatePresence>
        {unstagedAppSchema && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-6 z-50 text-slate-200 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-slate-900 ring-1 ring-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative select-none border border-slate-800"
            >
              {/* App Meta header */}
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: unstagedAppSchema.themeColor || "#ac22e0" }}
                >
                  <DynamicIcon name={unstagedAppSchema.iconName || "Play"} size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-1">
                    <span>{unstagedAppSchema.name}</span>
                    <Sparkles size={11} className="text-yellow-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 truncate max-w-[200px]">{unstagedAppSchema.packageName}</p>
                </div>
              </div>

              {/* Warning/Permissions */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Required Platform Sandbox Privileges:</span>
                <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-850/80 font-sans">
                  <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Uses server-side Gemini AI for dynamic component responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Accesses internal simulated SD Card filesystem directories</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Renders on native 9:16 responsive viewport sizes</span>
                  </div>
                </div>
              </div>

              {/* Action install buttons */}
              <div className="flex gap-2.5 select-none pt-2">
                <button 
                  onClick={() => { setUnstagedAppSchema(null); setInstallingPack(null); }}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 font-bold border border-slate-700 text-xs rounded-xl shadow-xs transition transform active:scale-95 text-center select-all select-none cursor-pointer"
                >
                  Reject
                </button>
                <button 
                  onClick={handleApplyInstallation}
                  className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition transform active:scale-95 text-center select-none cursor-pointer tracking-wider"
                >
                  Authorize install
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer System developer indicators */}
      <footer className="py-2.5 text-center shrink-0 border-t border-slate-900 bg-slate-950 text-[10px] text-slate-600 font-mono select-none">
        金魚 Android 系統企業級模擬器核心 (Goldfish Core) • 運行時間: 0.1s • WASM 沙盒運行中
      </footer>
    </div>
  );
}
