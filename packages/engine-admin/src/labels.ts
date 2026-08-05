import type { Block } from "@swim-engine/engine-contracts";
import type { ComponentType } from "react";
import {
  ImageIcon,
  FileText,
  Images,
  CalendarClock,
  PoundSterling,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
  TrendingUp,
  LayoutGrid,
} from "./icons.js";

/** The fixed set of icons an admin may choose for a feature_grid card. */
export const FEATURE_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "key", label: "Key" },
  { value: "landmark", label: "Landmark" },
  { value: "shield", label: "Shield" },
  { value: "trending-up", label: "Trending up" },
  { value: "handshake", label: "Handshake" },
  { value: "check-circle", label: "Check" },
  { value: "file-text", label: "Document" },
  { value: "globe", label: "Globe" },
  { value: "layers", label: "Layers" },
  { value: "users", label: "People" },
];

/**
 * Friendly names for each block type, shown in the admin. The keys are the
 * complete, fixed set of twelve block types; admins choose from these and
 * cannot invent new ones.
 */
export const BLOCK_LABELS: Record<Block["type"], string> = {
  hero: "Hero banner",
  rich_text: "Text",
  image: "Image",
  gallery: "Gallery",
  timetable: "Timetable",
  pricing_table: "Pricing table",
  faq: "Frequently asked questions",
  team: "Team",
  cta_banner: "Call to action",
  contact: "Contact details",
  stats: "Stats",
  feature_grid: "Feature grid",
};

/**
 * Builds a new block of the given type with sensible starting content. Some
 * required fields start blank on purpose: the admin fills them in, and the
 * content cannot be saved until they are valid.
 */
export function createBlock(type: Block["type"], id: string): Block {
  switch (type) {
    case "hero":
      return { id, type, heading: "New hero heading" };
    case "rich_text":
      return { id, type, content: "New text." };
    case "image":
      return { id, type, image: { src: "", alt: "" } };
    case "gallery":
      return { id, type, images: [{ src: "", alt: "" }] };
    case "timetable":
      return {
        id,
        type,
        sessions: [
          { day: "monday", startTime: "09:00", endTime: "09:30", title: "New session" },
        ],
      };
    case "pricing_table":
      return {
        id,
        type,
        tiers: [{ name: "New option", price: "", features: [], highlighted: false }],
      };
    case "faq":
      return {
        id,
        type,
        items: [{ question: "New question", answer: "New answer." }],
      };
    case "team":
      return { id, type, members: [{ name: "New person", role: "Role" }] };
    case "cta_banner":
      return {
        id,
        type,
        heading: "New call to action",
        cta: { label: "Get in touch", href: "/contact" },
      };
    case "contact":
      return { id, type, showEnquiryForm: false };
    case "stats":
      return { id, type, items: [{ value: "100", label: "New stat" }] };
    case "feature_grid":
      return { id, type, numbered: false, items: [{ title: "New feature" }] };
    default: {
      const unreachable: never = type;
      return unreachable;
    }
  }
}

/** A small icon for each block type, so the block list is scannable at a glance. */
export const BLOCK_ICONS: Record<Block["type"], ComponentType<{ className?: string }>> = {
  hero: ImageIcon,
  rich_text: FileText,
  image: ImageIcon,
  gallery: Images,
  timetable: CalendarClock,
  pricing_table: PoundSterling,
  faq: HelpCircle,
  team: Users,
  cta_banner: Megaphone,
  contact: Phone,
  stats: TrendingUp,
  feature_grid: LayoutGrid,
};
