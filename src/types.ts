export type SystemTheme = "light" | "dark";

export interface MobileApp {
  id: string; // package ID e.g. "com.android.settings"
  name: string;
  iconName: string; // Lucide icon name
  category: "system" | "installed" | "downloaded_apk";
  themeColor: string; // hex representation
  isPreinstalled: boolean;
  isAiGenerated?: boolean;
  aiSchema?: AISynthesizedApp;
}

// Chat schema for Messages app
export interface Message {
  id: string;
  sender: "me" | "contact";
  text: string;
  timestamp: Date;
}

export interface ChatContact {
  id: string;
  name: string;
  avatarColor: string;
  status: "Online" | "Offline" | "Typing...";
  unread?: boolean;
}

// AI Synthesized Custom App Schema (returned from Express / Gemini)
export interface AISynthesizedApp {
  name: string;
  packageName: string;
  themeColor: string;
  iconName: string;
  initialState: Record<string, string | number | boolean>;
  screens: AIScreen[];
}

export interface AIScreen {
  title: string;
  elements: AIElement[];
}

export interface AIElement {
  type: "text" | "header" | "button" | "input" | "list" | "chart" | "image_placeholder_search";
  id: string;
  label: string;
  className?: string;
  placeholder?: string;
  valueParam?: string; // Binds current state[valueParam] visually
  action?: "setState" | "increment" | "appendLog" | "triggerAIAnswer";
  actionTarget?: string; // target field in local app state
  actionValue?: string;
  items?: { label: string; value: string }[];
}

// Emulator Global Hardware State
export interface EmulatorHardwareState {
  isPowerOn: boolean;
  isScreenLocked: boolean;
  volumeLevel: number; // 0 to 10
  batteryLevel: number; // 0 to 100
  isCharging: boolean;
  isPortrait: boolean;
  activeWifi: boolean;
  activeBluetooth: boolean;
  isDarkMode: boolean;
  isFlashlightOn: boolean;
  isAirplaneMode: boolean;
  isAutoRotate: boolean;
  notificationTone: boolean;
}

// Simulated Local Storage Files
export interface VirtualFile {
  name: string;
  path: string; // e.g. "/sdcard/Download"
  size: number; // in bytes
  type: "image" | "text" | "apk" | "folder";
  content?: string; // text data or image base64
  apkFilesList?: string[]; // for apk inspection
}
