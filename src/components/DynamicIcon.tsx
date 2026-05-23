import React from "react";
import {
  Phone,
  MessageSquare,
  Settings,
  Compass,
  FolderOpen,
  Camera,
  Play,
  Gamepad2,
  Terminal,
  Grid3X3,
  Wifi,
  Battery,
  Clock,
  Search,
  User,
  Globe,
  ArrowLeft,
  Home,
  Upload,
  X,
  Check,
  Paintbrush,
  Calculator,
  BatteryCharging,
  Sparkles,
  Music,
  Activity,
  Flame,
  Swords,
  Database,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RefreshCw,
  Flashlight,
  Volume2,
  VolumeX,
  Send,
  Maximize2,
  Lock,
  Unlock,
  Eye,
  ShieldAlert,
  Smartphone,
  Plus,
  Trash2,
  Paperclip,
  Moon,
  Sun,
  Map,
  MapPin,
  PlayCircle,
  FileCode,
  AlertCircle
} from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "", size = 20 }) => {
  const normalized = name.toLowerCase().trim();

  switch (normalized) {
    case "phone": return <Phone className={className} size={size} />;
    case "messagesquare":
    case "message":
    case "chat": return <MessageSquare className={className} size={size} />;
    case "settings":
    case "cog": return <Settings className={className} size={size} />;
    case "compass":
    case "browser":
    case "chrome": return <Compass className={className} size={size} />;
    case "folderopen":
    case "folder":
    case "files": return <FolderOpen className={className} size={size} />;
    case "camera": return <Camera className={className} size={size} />;
    case "play": return <Play className={className} size={size} />;
    case "gamepad2":
    case "game":
    case "flappybird": return <Gamepad2 className={className} size={size} />;
    case "terminal":
    case "termux": return <Terminal className={className} size={size} />;
    case "grid3x3":
    case "apps": return <Grid3X3 className={className} size={size} />;
    case "wifi": return <Wifi className={className} size={size} />;
    case "battery": return <Battery className={className} size={size} />;
    case "clock": return <Clock className={className} size={size} />;
    case "search": return <Search className={className} size={size} />;
    case "user":
    case "contact": return <User className={className} size={size} />;
    case "globe": return <Globe className={className} size={size} />;
    case "arrowleft":
    case "back": return <ArrowLeft className={className} size={size} />;
    case "home": return <Home className={className} size={size} />;
    case "upload":
    case "installer": return <Upload className={className} size={size} />;
    case "x":
    case "close": return <X className={className} size={size} />;
    case "check": return <Check className={className} size={size} />;
    case "paintbrush":
    case "pixeldraw": return <Paintbrush className={className} size={size} />;
    case "calculator": return <Calculator className={className} size={size} />;
    case "batterycharging": return <BatteryCharging className={className} size={size} />;
    case "sparkles": return <Sparkles className={className} size={size} />;
    case "music": return <Music className={className} size={size} />;
    case "activity": return <Activity className={className} size={size} />;
    case "flame": return <Flame className={className} size={size} />;
    case "swords": return <Swords className={className} size={size} />;
    case "database": return <Database className={className} size={size} />;
    case "chevrondown": return <ChevronDown className={className} size={size} />;
    case "chevronup": return <ChevronUp className={className} size={size} />;
    case "chevronright": return <ChevronRight className={className} size={size} />;
    case "refreshcw": return <RefreshCw className={className} size={size} />;
    case "flashlight": return <Flashlight className={className} size={size} />;
    case "volume2": return <Volume2 className={className} size={size} />;
    case "volumex": return <VolumeX className={className} size={size} />;
    case "send": return <Send className={className} size={size} />;
    case "maximize2": return <Maximize2 className={className} size={size} />;
    case "lock": return <Lock className={className} size={size} />;
    case "unlock": return <Unlock className={className} size={size} />;
    case "eye": return <Eye className={className} size={size} />;
    case "shieldalert": return <ShieldAlert className={className} size={size} />;
    case "smartphone": return <Smartphone className={className} size={size} />;
    case "plus": return <Plus className={className} size={size} />;
    case "trash2": return <Trash2 className={className} size={size} />;
    case "paperclip": return <Paperclip className={className} size={size} />;
    case "moon": return <Moon className={className} size={size} />;
    case "sun": return <Sun className={className} size={size} />;
    case "map": return <Map className={className} size={size} />;
    case "mappin": return <MapPin className={className} size={size} />;
    case "playcircle": return <PlayCircle className={className} size={size} />;
    case "filecode": return <FileCode className={className} size={size} />;
    default: return <AlertCircle className={className} size={size} />;
  }
};
