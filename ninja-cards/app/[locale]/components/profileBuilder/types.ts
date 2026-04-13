import { User } from "@/types/user";
import { CardTheme } from "@/utils/cardTheme";

export type BuilderSectionKey =
  | "identity"
  | "contact"
  | "links"
  | "media"
  | "appearance";

export type BuilderSectionState =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error";

export type BuilderTemplateLayout = "classic" | "spotlight" | "minimal";

export interface BuilderTemplate {
  id: string;
  nameKey: string;
  descriptionKey: string;
  badgeKey: string;
  theme: CardTheme;
  layout: BuilderTemplateLayout;
}

export type BuilderDraftState = User;
