/**
 * The one place engine-admin depends on lucide-react. Every icon used across
 * the admin panel is re-exported from here, so consuming apps import icons
 * from @swim-engine/engine-admin rather than adding their own lucide-react
 * dependency (avoiding duplicate installs and version drift).
 */
export {
  Home,
  FileText,
  Image as ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  UploadCloud,
  Images,
  CalendarClock,
  DollarSign,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
} from "lucide-react";
