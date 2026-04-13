import { BuilderTemplate } from "./types";

export const BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: "amber-classic",
    nameKey: "amberClassic",
    descriptionKey: "amberClassicDescription",
    badgeKey: "classic",
    layout: "classic",
    theme: {
      base: "black",
      accent: "#f59e0b",
      textPrimary: "#ffffff",
      textSecondary: "rgba(255,255,255,0.45)",
    },
  },
  {
    id: "clean-slate",
    nameKey: "cleanSlate",
    descriptionKey: "cleanSlateDescription",
    badgeKey: "minimal",
    layout: "minimal",
    theme: {
      base: "white",
      accent: "#2563eb",
      textPrimary: "#111111",
      textSecondary: "rgba(0,0,0,0.45)",
    },
  },
  {
    id: "midnight-glow",
    nameKey: "midnightGlow",
    descriptionKey: "midnightGlowDescription",
    badgeKey: "spotlight",
    layout: "spotlight",
    theme: {
      base: "midnight-blue",
      accent: "#22d3ee",
      textPrimary: "#f1f5f9",
      textSecondary: "rgba(241,245,249,0.45)",
    },
  },
  {
    id: "forest-signal",
    nameKey: "forestSignal",
    descriptionKey: "forestSignalDescription",
    badgeKey: "classic",
    layout: "classic",
    theme: {
      base: "emerald-forest",
      accent: "#6ee7b7",
      textPrimary: "#ecfdf5",
      textSecondary: "rgba(236,253,245,0.45)",
    },
  },
  {
    id: "rose-studio",
    nameKey: "roseStudio",
    descriptionKey: "roseStudioDescription",
    badgeKey: "spotlight",
    layout: "spotlight",
    theme: {
      base: "rose-gold",
      accent: "#f9a8d4",
      textPrimary: "#fff1f2",
      textSecondary: "rgba(255,241,242,0.45)",
    },
  },
  {
    id: "ocean-note",
    nameKey: "oceanNote",
    descriptionKey: "oceanNoteDescription",
    badgeKey: "minimal",
    layout: "minimal",
    theme: {
      base: "ocean-depth",
      accent: "#7dd3fc",
      textPrimary: "#eff6ff",
      textSecondary: "rgba(239,246,255,0.45)",
    },
  },
];
