"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useAuth } from "../../context/AuthContext";
import { BASE_API_URL } from "@/utils/constants";
import {
  parseCardTheme,
  resolveCardStyle,
  serializeCardTheme,
  type CardTheme,
} from "@/utils/cardTheme";
import BackgroundSelector from "../profileDetails/BackgroundSelector";
import { BUILDER_TEMPLATES } from "./templates";
import {
  BuilderDraftState,
  BuilderSectionKey,
  BuilderSectionState,
  BuilderTemplate,
} from "./types";
import ProfileBuilderPreview from "./ProfileBuilderPreview";

const PROFILE_FIELDS = [
  "name",
  "firstName",
  "lastName",
  "company",
  "position",
  "phone1",
  "phone2",
  "email2",
  "street1",
  "street2",
  "zipCode",
  "city",
  "state",
  "country",
  "bio",
] as const;

const LINK_FIELDS = [
  "website",
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "github",
  "youtube",
  "tiktok",
  "googleReview",
  "revolut",
  "viber",
  "whatsapp",
  "behance",
  "paypal",
  "trustpilot",
  "telegram",
  "calendly",
  "discord",
  "tripadvisor",
] as const;

const IDENTITY_FIELDS = [
  "firstName",
  "lastName",
  "name",
  "company",
  "position",
  "bio",
] as const;

const CONTACT_FIELDS = [
  "phone1",
  "phone2",
  "email2",
  "street1",
  "street2",
  "zipCode",
  "city",
  "state",
  "country",
] as const;

const PRIMARY_LINK_FIELDS = [
  "website",
  "linkedin",
  "instagram",
  "facebook",
  "twitter",
  "whatsapp",
  "telegram",
  "youtube",
  "googleReview",
  "calendly",
] as const;

const SECONDARY_LINK_FIELDS = [
  "github",
  "tiktok",
  "viber",
  "revolut",
  "behance",
  "paypal",
  "trustpilot",
  "discord",
  "tripadvisor",
] as const;

const URL_FIELDS = [
  "website",
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "github",
  "youtube",
  "tiktok",
  "googleReview",
  "behance",
  "paypal",
  "trustpilot",
  "telegram",
  "calendly",
  "discord",
  "tripadvisor",
] as const;

type SaveBarState = "idle" | "saving" | "saved" | "error";

function validateURL(url: string) {
  if (!url.trim()) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildFormData(id: string, fields: readonly string[], draftUser: BuilderDraftState) {
  const formData = new FormData();
  formData.append("id", id);
  fields.forEach((field) => {
    formData.append(field, String((draftUser as unknown as Record<string, unknown>)[field] ?? ""));
  });
  return formData;
}

function getSectionTone(status: BuilderSectionState) {
  switch (status) {
    case "saving":
      return "text-amber-300";
    case "saved":
      return "text-emerald-300";
    case "error":
      return "text-red-300";
    case "dirty":
      return "text-sky-300";
    default:
      return "text-white/45";
  }
}

function SectionStatus({ label, status }: { label: string; status: BuilderSectionState }) {
  return (
    <span
      className={`rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getSectionTone(
        status
      )}`}
    >
      {label}
    </span>
  );
}

function SectionShell({
  title,
  subtitle,
  statusLabel,
  status,
  children,
  error,
}: {
  title: string;
  subtitle: string;
  statusLabel: string;
  status: BuilderSectionState;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/55">{subtitle}</p>
        </div>
        <SectionStatus label={statusLabel} status={status} />
      </div>
      {error ? (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function BuilderInput({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1018] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/40 focus:bg-[#0d131d]"
      />
    </label>
  );
}

function BuilderTextarea({
  label,
  value,
  placeholder,
  rows = 4,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1018] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/40 focus:bg-[#0d131d]"
      />
    </label>
  );
}

function TemplateCard({
  template,
  selected,
  onClick,
  title,
  description,
  badge,
}: {
  template: BuilderTemplate;
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  badge: string;
}) {
  const cardStyle = resolveCardStyle(template.theme);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-[1.6rem] border p-3 text-left transition duration-200 ${
        selected
          ? "border-amber-400/70 bg-white/[0.08] shadow-[0_0_0_1px_rgba(251,191,36,0.25)]"
          : "border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <div
        className="relative mb-3 overflow-hidden rounded-[1.2rem] border border-black/10"
        style={{ background: cardStyle.cssVar }}
      >
        <div className="absolute inset-x-0 top-0 h-14 bg-black/10" />
        <div className="px-4 pb-4 pt-12">
          <div
            className="mb-3 h-14 w-14 rounded-full border-4"
            style={{
              borderColor: cardStyle.accent,
              background: `${cardStyle.textPrimary}22`,
            }}
          />
          <div className="mb-2 h-3 w-24 rounded-full" style={{ background: `${cardStyle.textPrimary}88` }} />
          <div className="mb-4 h-2.5 w-16 rounded-full" style={{ background: cardStyle.textSecondary }} />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-8 rounded-xl"
                style={{ background: index === 0 ? cardStyle.accent : `${cardStyle.textPrimary}12` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-white">{title}</span>
        <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
          {badge}
        </span>
      </div>
      <p className="text-xs leading-5 text-white/55">{description}</p>
    </button>
  );
}

function SaveBar({
  t,
  pendingCount,
  saveState,
  onSave,
  disabled,
}: {
  t: ReturnType<typeof useTranslations>;
  pendingCount: number;
  saveState: SaveBarState;
  onSave: () => void;
  disabled: boolean;
}) {
  const headline =
    saveState === "saving"
      ? t("saveBar.savingTitle")
      : pendingCount > 0
      ? t("saveBar.pendingTitle", { count: pendingCount })
      : t("saveBar.cleanTitle");

  const description =
    saveState === "saving"
      ? t("saveBar.savingDescription")
      : pendingCount > 0
      ? t("saveBar.pendingDescription")
      : t("saveBar.cleanDescription");

  const buttonLabel =
    saveState === "saving"
      ? t("saveBar.savingButton")
      : saveState === "saved" && pendingCount === 0
      ? t("saveBar.savedButton")
      : t("saveBar.saveButton");

  return (
    <div className="sticky bottom-4 z-30 pt-4">
      <div className="overflow-hidden rounded-[1.9rem] border border-white/12 bg-[#0b1018]/95 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-amber-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                {t("saveBar.draftBadge")}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                {pendingCount > 0 ? t("saveBar.pendingChip") : t("saveBar.savedChip")}
              </span>
            </div>
            <p className="text-base font-bold text-white sm:text-lg">{headline}</p>
            <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={disabled}
            className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-amber-400 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedProfileBuilder() {
  const t = useTranslations("ProfileBuilder");
  const router = useRouter();
  const { user, setUser, loading } = useAuth();

  const [draftUser, setDraftUser] = React.useState<BuilderDraftState | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(BUILDER_TEMPLATES[0].id);
  const [themeDraft, setThemeDraft] = React.useState<CardTheme>(BUILDER_TEMPLATES[0].theme);
  const [sectionState, setSectionState] = React.useState<Record<BuilderSectionKey, BuilderSectionState>>({
    identity: "idle",
    contact: "idle",
    links: "idle",
    media: "idle",
    appearance: "idle",
  });
  const [sectionErrors, setSectionErrors] = React.useState<Partial<Record<BuilderSectionKey, string>>>({});
  const [saveState, setSaveState] = React.useState<SaveBarState>("idle");
  const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);

  const draftUserRef = React.useRef<BuilderDraftState | null>(null);
  const themeRef = React.useRef<CardTheme>(themeDraft);

  React.useEffect(() => {
    draftUserRef.current = draftUser;
  }, [draftUser]);

  React.useEffect(() => {
    themeRef.current = themeDraft;
  }, [themeDraft]);

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }

    setDraftUser(user);
    draftUserRef.current = user;
    setProfileImageFile(null);
    setCoverImageFile(null);

    const parsedTheme = parseCardTheme(user.selectedColor);
    setThemeDraft(parsedTheme);

    const matchingTemplate =
      BUILDER_TEMPLATES.find((template) => template.theme.base === parsedTheme.base) ??
      BUILDER_TEMPLATES[0];

    setSelectedTemplateId(matchingTemplate.id);
    setSectionState({
      identity: "idle",
      contact: "idle",
      links: "idle",
      media: "idle",
      appearance: "idle",
    });
    setSectionErrors({});
    setSaveState("idle");
  }, [loading, router, user]);

  const markDirty = React.useCallback((section: BuilderSectionKey) => {
    setSaveState("idle");
    setSectionState((current) => ({ ...current, [section]: "dirty" }));
    setSectionErrors((current) => ({ ...current, [section]: undefined }));
  }, []);

  const syncUser = React.useCallback(
    (nextUser: BuilderDraftState) => {
      setDraftUser(nextUser);
      draftUserRef.current = nextUser;
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
    },
    [setUser]
  );

  const setSavingSections = React.useCallback((sections: BuilderSectionKey[]) => {
    setSectionState((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        if (current[section] === "dirty" || current[section] === "error") {
          next[section] = "saving";
        }
      });
      return next;
    });
  }, []);

  const setSavedSections = React.useCallback((sections: BuilderSectionKey[]) => {
    setSectionState((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        next[section] = "saved";
      });
      return next;
    });
  }, []);

  const setErrorSections = React.useCallback((sections: BuilderSectionKey[], message: string) => {
    setSectionState((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        next[section] = "error";
      });
      return next;
    });
    setSectionErrors((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        next[section] = message;
      });
      return next;
    });
  }, []);

  const updateProfileField = React.useCallback(
    (field: string, value: string, section: "identity" | "contact") => {
      setDraftUser((current) => {
        if (!current) return current;
        const next = { ...current, [field]: value } as BuilderDraftState;
        draftUserRef.current = next;
        return next;
      });
      markDirty(section);
    },
    [markDirty]
  );

  const updateLinkField = React.useCallback(
    (field: string, value: string) => {
      setDraftUser((current) => {
        if (!current) return current;
        const next = { ...current, [field]: value } as BuilderDraftState;
        draftUserRef.current = next;
        return next;
      });
      markDirty("links");
    },
    [markDirty]
  );

  const handleTemplateSelect = React.useCallback(
    (template: BuilderTemplate) => {
      setSelectedTemplateId(template.id);
      setThemeDraft(template.theme);
      themeRef.current = template.theme;
      setDraftUser((current) => {
        if (!current) return current;
        const next = {
          ...current,
          selectedColor: serializeCardTheme(template.theme),
        } as BuilderDraftState;
        draftUserRef.current = next;
        return next;
      });
      markDirty("appearance");
    },
    [markDirty]
  );

  const handleThemeChange = React.useCallback(
    (theme: CardTheme) => {
      setThemeDraft(theme);
      themeRef.current = theme;
      setDraftUser((current) => {
        if (!current) return current;
        const next = {
          ...current,
          selectedColor: serializeCardTheme(theme),
        } as BuilderDraftState;
        draftUserRef.current = next;
        return next;
      });
      markDirty("appearance");
    },
    [markDirty]
  );

  const handleProfileImageChange = React.useCallback(
    async (file: File) => {
      try {
        const preview = await readFileAsDataUrl(file);
        const base64 = preview.split(",")[1] ?? "";
        setProfileImageFile(file);
        setDraftUser((current) => {
          if (!current) return current;
          const next = { ...current, image: base64 } as BuilderDraftState;
          draftUserRef.current = next;
          return next;
        });
        markDirty("media");
      } catch {
        setErrorSections(["media"], t("errors.imageUpload"));
        setSaveState("error");
      }
    },
    [markDirty, setErrorSections, t]
  );

  const handleCoverImageChange = React.useCallback(
    async (file: File) => {
      try {
        const preview = await readFileAsDataUrl(file);
        setCoverImageFile(file);
        setDraftUser((current) => {
          if (!current) return current;
          const next = { ...current, coverImage: preview } as BuilderDraftState;
          draftUserRef.current = next;
          return next;
        });
        markDirty("media");
      } catch {
        setErrorSections(["media"], t("errors.coverUpload"));
        setSaveState("error");
      }
    },
    [markDirty, setErrorSections, t]
  );

  const pendingSections = React.useMemo(
    () =>
      (Object.entries(sectionState) as [BuilderSectionKey, BuilderSectionState][])
        .filter(([, status]) => status === "dirty")
        .map(([section]) => section),
    [sectionState]
  );

  const pendingCount = pendingSections.length;
  const selectedTemplate =
    BUILDER_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
    BUILDER_TEMPLATES[0];
  const cardStyle = resolveCardStyle(themeDraft);

  const saveAllChanges = React.useCallback(async () => {
    const currentUser = draftUserRef.current;
    if (!currentUser?.id || pendingCount === 0) return;

    for (const field of URL_FIELDS) {
      const value = String((currentUser as unknown as Record<string, unknown>)[field] ?? "");
      if (!validateURL(value)) {
        setErrorSections(["links"], t("errors.invalidUrl"));
        setSaveState("error");
        return;
      }
    }

    setSaveState("saving");
    setSectionErrors({});
    setSavingSections(pendingSections);

    let nextUser = currentUser;

    try {
      const profileSections = pendingSections.filter(
        (section) => section === "identity" || section === "contact"
      );

      if (profileSections.length > 0) {
        const response = await fetch(`${BASE_API_URL}/api/profile/updateInformation`, {
          method: "PUT",
          body: buildFormData(nextUser.id, PROFILE_FIELDS, nextUser),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload) {
          throw { sections: profileSections, message: payload?.error || t("errors.profileSave") };
        }
        nextUser = { ...nextUser, ...payload };
        setSavedSections(profileSections);
      }

      if (pendingSections.includes("links")) {
        const response = await fetch(`${BASE_API_URL}/api/profile/updateLinks`, {
          method: "PUT",
          body: buildFormData(nextUser.id, LINK_FIELDS, nextUser),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload) {
          throw { sections: ["links"], message: payload?.error || t("errors.linksSave") };
        }
        nextUser = { ...nextUser, ...payload };
        setSavedSections(["links"]);
      }

      if (pendingSections.includes("appearance")) {
        const selectedColor = serializeCardTheme(themeRef.current);
        const response = await fetch(`${BASE_API_URL}/api/profile/saveColor`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: nextUser.id, selectedColor }),
        });
        if (!response.ok) {
          throw { sections: ["appearance"], message: t("errors.appearanceSave") };
        }
        nextUser = { ...nextUser, selectedColor };
        setSavedSections(["appearance"]);
      }

      if (pendingSections.includes("media")) {
        if (profileImageFile) {
          const formData = new FormData();
          formData.append("id", nextUser.id);
          formData.append("image", profileImageFile);
          const response = await fetch(`${BASE_API_URL}/api/profile/changeImage`, {
            method: "PUT",
            body: formData,
          });
          const payload = await response.json().catch(() => null);
          if (!response.ok || !payload) {
            throw { sections: ["media"], message: payload?.error || t("errors.imageUpload") };
          }
          nextUser = { ...nextUser, ...payload };
        }

        if (coverImageFile) {
          const response = await fetch(`${BASE_API_URL}/api/profile/uploadCover`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: nextUser.id, coverImage: nextUser.coverImage }),
          });
          const payload = await response.json().catch(() => null);
          if (!response.ok || !payload?.coverImage) {
            throw { sections: ["media"], message: payload?.error || t("errors.coverUpload") };
          }
          nextUser = { ...nextUser, coverImage: payload.coverImage };
        }

        setSavedSections(["media"]);
      }

      syncUser(nextUser);
      setProfileImageFile(null);
      setCoverImageFile(null);
      setSaveState("saved");
    } catch (error) {
      if (nextUser !== currentUser) {
        syncUser(nextUser);
      }

      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : t("saveBar.errorDescription");

      const sections =
        error &&
        typeof error === "object" &&
        "sections" in error &&
        Array.isArray(error.sections)
          ? (error.sections as BuilderSectionKey[])
          : pendingSections;

      setErrorSections(sections, message);
      setSaveState("error");
    }
  }, [
    coverImageFile,
    pendingCount,
    pendingSections,
    profileImageFile,
    setErrorSections,
    setSavedSections,
    setSavingSections,
    syncUser,
    t,
  ]);

  if (loading || !draftUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090f]">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-amber-500/20" />
          <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-amber-500" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 pb-28 pt-24 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(245,158,11,0.10), transparent 32%), radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 28%), #07090f",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.26)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300/70">
              {t("eyebrow")}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base leading-7 text-white/60 sm:text-lg">
              {t("subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            {t("backToDashboard")}
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.7rem] border border-white/10 bg-[#0b1018]/85 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/70">
              {t("saveBar.draftBadge")}
            </p>
            <p className="mt-2 text-lg font-bold text-white">{t("intro.title")}</p>
            <p className="mt-2 text-sm leading-6 text-white/55">{t("intro.description")}</p>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-[#0b1018]/85 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300/70">
              {t("intro.livePreviewTitle")}
            </p>
            <p className="mt-2 text-lg font-bold text-white">{t("intro.livePreviewValue")}</p>
            <p className="mt-2 text-sm leading-6 text-white/55">{t("intro.livePreviewDescription")}</p>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-[#0b1018]/85 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
              {t("intro.saveFlowTitle")}
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {pendingCount > 0 ? t("saveBar.pendingTitle", { count: pendingCount }) : t("intro.savedState")}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/55">{t("intro.saveFlowDescription")}</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <ProfileBuilderPreview
              draftUser={draftUser}
              cardStyle={cardStyle}
              layout={selectedTemplate.layout}
              previewLabel={t("previewLabel")}
            />
          </aside>

          <div className="space-y-6">
            <SectionShell
              title={t("sections.templates.title")}
              subtitle={t("sections.templates.subtitle")}
              statusLabel={t(`status.${sectionState.appearance}`)}
              status={sectionState.appearance}
              error={sectionErrors.appearance}
            >
              <div className="mb-4 rounded-[1.5rem] border border-amber-400/15 bg-amber-400/8 px-4 py-3 text-sm leading-6 text-amber-50/90">
                {t("sections.templates.helper")}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {BUILDER_TEMPLATES.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selected={template.id === selectedTemplateId}
                    onClick={() => handleTemplateSelect(template)}
                    title={t(`templates.${template.nameKey}`)}
                    description={t(`templates.${template.descriptionKey}`)}
                    badge={t(`templateBadges.${template.badgeKey}`)}
                  />
                ))}
              </div>
            </SectionShell>

            <SectionShell
              title={t("sections.identity.title")}
              subtitle={t("sections.identity.subtitle")}
              statusLabel={t(`status.${sectionState.identity}`)}
              status={sectionState.identity}
              error={sectionErrors.identity}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {IDENTITY_FIELDS.filter((field) => field !== "bio").map((field) => (
                  <BuilderInput
                    key={field}
                    label={t(`fields.${field}`)}
                    value={String((draftUser as unknown as Record<string, unknown>)[field] ?? "")}
                    placeholder={t(`placeholders.${field}`)}
                    onChange={(value) => updateProfileField(field, value, "identity")}
                  />
                ))}
              </div>
              <div className="mt-4">
                <BuilderTextarea
                  label={t("fields.bio")}
                  value={String(draftUser.bio ?? "")}
                  placeholder={t("placeholders.bio")}
                  rows={5}
                  onChange={(value) => updateProfileField("bio", value, "identity")}
                />
              </div>
            </SectionShell>

            <SectionShell
              title={t("sections.media.title")}
              subtitle={t("sections.media.subtitle")}
              statusLabel={t(`status.${sectionState.media}`)}
              status={sectionState.media}
              error={sectionErrors.media}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block rounded-[1.6rem] border border-white/10 bg-[#0b1018] p-4 transition hover:border-white/20">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {t("media.profileImage")}
                  </span>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
                      {draftUser.image ? (
                        <Image
                          src={`data:image/jpeg;base64,${draftUser.image}`}
                          alt={t("media.profileImage")}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm leading-6 text-white/55">{t("media.profileHelp")}</p>
                      {profileImageFile ? (
                        <p className="mt-1 text-xs font-medium text-amber-200">{t("media.pendingUpload")}</p>
                      ) : null}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-white/65 file:mr-4 file:rounded-full file:border-0 file:bg-amber-500 file:px-4 file:py-2.5 file:font-semibold file:text-black"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleProfileImageChange(file);
                    }}
                  />
                </label>

                <label className="block rounded-[1.6rem] border border-white/10 bg-[#0b1018] p-4 transition hover:border-white/20">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {t("media.coverImage")}
                  </span>
                  <div className="mb-4 overflow-hidden rounded-[1.2rem] border border-white/10">
                    {draftUser.coverImage ? (
                      <div className="h-24 w-full bg-cover bg-center" style={{ backgroundImage: `url(${draftUser.coverImage})` }} />
                    ) : (
                      <div className="flex h-24 items-center justify-center bg-white/[0.05] text-sm text-white/45">
                        {t("media.coverEmpty")}
                      </div>
                    )}
                  </div>
                  {coverImageFile ? (
                    <p className="mb-3 text-xs font-medium text-amber-200">{t("media.pendingUpload")}</p>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-white/65 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2.5 file:font-semibold file:text-black"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleCoverImageChange(file);
                    }}
                  />
                </label>
              </div>
            </SectionShell>

            <SectionShell
              title={t("sections.contact.title")}
              subtitle={t("sections.contact.subtitle")}
              statusLabel={t(`status.${sectionState.contact}`)}
              status={sectionState.contact}
              error={sectionErrors.contact}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {CONTACT_FIELDS.map((field) => (
                  <BuilderInput
                    key={field}
                    label={t(`fields.${field}`)}
                    value={String((draftUser as unknown as Record<string, unknown>)[field] ?? "")}
                    placeholder={t(`placeholders.${field}`)}
                    onChange={(value) => updateProfileField(field, value, "contact")}
                    type={field === "email2" ? "email" : "text"}
                  />
                ))}
              </div>
            </SectionShell>

            <SectionShell
              title={t("sections.links.title")}
              subtitle={t("sections.links.subtitle")}
              statusLabel={t(`status.${sectionState.links}`)}
              status={sectionState.links}
              error={sectionErrors.links}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {PRIMARY_LINK_FIELDS.map((field) => (
                  <BuilderInput
                    key={field}
                    label={t(`fields.${field}`)}
                    value={String((draftUser as unknown as Record<string, unknown>)[field] ?? "")}
                    placeholder={t(`placeholders.${field}`)}
                    onChange={(value) => updateLinkField(field, value)}
                  />
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {SECONDARY_LINK_FIELDS.map((field) => (
                  <BuilderInput
                    key={field}
                    label={t(`fields.${field}`)}
                    value={String((draftUser as unknown as Record<string, unknown>)[field] ?? "")}
                    placeholder={t(`placeholders.${field}`)}
                    onChange={(value) => updateLinkField(field, value)}
                  />
                ))}
              </div>
            </SectionShell>

            <SectionShell
              title={t("sections.appearance.title")}
              subtitle={t("sections.appearance.subtitle")}
              statusLabel={t(`status.${sectionState.appearance}`)}
              status={sectionState.appearance}
              error={sectionErrors.appearance}
            >
              <BackgroundSelector cardStyle={cardStyle} onThemeChange={handleThemeChange} />
            </SectionShell>

            <SaveBar
              t={t}
              pendingCount={pendingCount}
              saveState={saveState}
              onSave={() => void saveAllChanges()}
              disabled={pendingCount === 0 || saveState === "saving"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
