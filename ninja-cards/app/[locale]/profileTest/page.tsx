"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, type Href } from "@/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../context/AuthContext";
import type { User } from "@/types/user";
import {
  PROFILE_BIG_TABS,
  PROFILE_BUILDER_TAB,
  PROFILE_DASHBOARD_GROUPS,
  PROFILE_SETTINGS_TABS,
  ProfileIcons,
  type ProfileTabDef,
  resolveProfileHref,
} from "../profile/profileNavigation";

type DashboardMetrics = {
  leads: number;
  profileVisits: number;
  profileShares: number;
  socialLinkClicks: number;
};

type CompletionItem = {
  key: string;
  label: string;
  done: boolean;
  tab: ProfileTabDef;
};

const FALLBACK_METRICS: DashboardMetrics = {
  leads: 0,
  profileVisits: 0,
  profileShares: 0,
  socialLinkClicks: 0,
};

const PANEL_SURFACE =
  "rounded-[32px] bg-[linear-gradient(180deg,rgba(10,10,12,0.98)_0%,rgba(17,24,39,0.96)_100%)] shadow-[0_24px_70px_rgba(0,0,0,0.34)]";
const PANEL_BORDER = "border border-white/8";
const SUBTLE_SURFACE = "rounded-[28px] bg-white/[0.03] ring-1 ring-white/6";
const SOFT_TEXT = "text-white/64";
const MUTED_TEXT = "text-white/42";

function getImageSrc(value?: string | null, mime = "image/jpeg") {
  if (!value) return null;
  if (value.startsWith("data:") || value.startsWith("http")) return value;
  return `data:${mime};base64,${value}`;
}

function countItems(payload: unknown) {
  if (Array.isArray(payload)) return payload.length;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.leads)) return record.leads.length;
    if (Array.isArray(record.subscribed)) return record.subscribed.length;
    if (typeof record.count === "number") return record.count;
    if (typeof record.total === "number") return record.total;
  }
  return 0;
}

function getPublicPath(user: User | null, locale: string) {
  if (!user?.id) return null;
  if (user.slug) return `/${locale}/p/${user.slug}`;
  return `/${locale}/profileDetails/${user.id}`;
}

function getFirstName(user: User | null) {
  if (!user) return "";
  return user.firstName || user.name?.split(" ")[0] || "";
}

function getDisplayName(user: User) {
  return (
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "NinjaCards User"
  );
}

function getStatusTone(score: number) {
  if (score >= 80) {
    return {
      chip: "bg-amber-400/16 text-amber-200 ring-1 ring-amber-300/20",
      bar: "bg-amber-400",
      ring: "border-amber-300/80",
    };
  }
  if (score >= 55) {
    return {
      chip: "bg-orange-500/12 text-orange-200 ring-1 ring-orange-300/20",
      bar: "bg-orange-400",
      ring: "border-orange-300/70",
    };
  }
  return {
    chip: "bg-white/6 text-amber-200 ring-1 ring-white/10",
    bar: "bg-gradient-to-r from-amber-500 to-orange-400",
    ring: "border-white/10",
  };
}

function DashboardShell({
  children,
  navigating,
}: {
  children: React.ReactNode;
  navigating: boolean;
}) {
  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#0b0b0d] pt-24 sm:pt-28">
        <div className="fixed inset-x-0 top-0 z-0 h-11 bg-[linear-gradient(90deg,#2a1705_0%,#fb923c_50%,#2a1705_100%)]" />
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_28%),linear-gradient(180deg,#0b0b0d_0%,#111827_100%)]" />
        <div
          className="fixed inset-0 z-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1500px] px-4 pb-10 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}

export default function ProfileTestPage() {
  const { user, loading } = useAuth();
  const t = useTranslations("profileDashboard");
  const router = useRouter();
  const nextRouter = useNextRouter();
  const locale = useLocale();

  const [navigating, setNavigating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [metrics, setMetrics] =
    React.useState<DashboardMetrics>(FALLBACK_METRICS);

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
    }
  }, [loading, router, user]);

  React.useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadMetrics = async () => {
      try {
        const [leadsRes, dashboardRes] = await Promise.all([
          fetch(`${BASE_API_URL}/api/subscribed/${user.id}`),
          fetch(`${BASE_API_URL}/api/dashboard/${user.id}`),
        ]);

        const nextMetrics = { ...FALLBACK_METRICS };

        if (leadsRes.ok) {
          nextMetrics.leads = countItems(await leadsRes.json());
        }

        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          nextMetrics.profileVisits = Number(data?.profileVisits ?? 0);
          nextMetrics.profileShares = Number(data?.profileShares ?? 0);
          nextMetrics.socialLinkClicks = Number(data?.socialLinkClicks ?? 0);
        }

        if (!cancelled) {
          setMetrics(nextMetrics);
        }
      } catch {
        if (!cancelled) {
          setMetrics(FALLBACK_METRICS);
        }
      }
    };

    void loadMetrics();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const navigateTo = React.useCallback(
    (tab: ProfileTabDef) => {
      const href = resolveProfileHref(
        tab,
        user?.id ? String(user.id) : null,
        user?.slug,
      );
      if (!href) return;

      setNavigating(true);

      if (typeof href === "string" && href.startsWith("/p/")) {
        nextRouter.push(`/${locale}${href}`);
        return;
      }

      router.push(href as Href);
    },
    [locale, nextRouter, router, user?.id, user?.slug],
  );

  React.useEffect(() => {
    if (!navigating) return;
    const timer = window.setTimeout(() => setNavigating(false), 650);
    return () => window.clearTimeout(timer);
  }, [navigating]);

  const publicPath = React.useMemo(
    () => getPublicPath(user, locale),
    [locale, user],
  );
  const publicUrl = React.useMemo(
    () =>
      typeof window !== "undefined" && publicPath
        ? `${window.location.origin}${publicPath}`
        : "",
    [publicPath],
  );

  const previewTab =
    PROFILE_BIG_TABS.find((tab) => tab.labelKey === "businessCard") ??
    PROFILE_BIG_TABS[0];
  const leadsTab =
    PROFILE_BIG_TABS.find((tab) => tab.labelKey === "clients") ??
    PROFILE_BIG_TABS[1];
  const analyticsTab =
    PROFILE_BIG_TABS.find((tab) => tab.labelKey === "analyse") ??
    PROFILE_BIG_TABS[2];
  const qrTab =
    PROFILE_BIG_TABS.find((tab) => tab.labelKey === "qr") ??
    PROFILE_BIG_TABS[4];
  const linksTab =
    PROFILE_BIG_TABS.find((tab) => tab.labelKey === "links") ??
    PROFILE_BIG_TABS[3];
  const optimizeTab =
    PROFILE_SETTINGS_TABS.find((tab) => tab.labelKey === "optimize") ??
    PROFILE_SETTINGS_TABS[9];
  const walletTab =
    PROFILE_SETTINGS_TABS.find((tab) => tab.labelKey === "googleWallet") ??
    PROFILE_SETTINGS_TABS[10];
  const videoTab =
    PROFILE_SETTINGS_TABS.find((tab) => tab.labelKey === "video") ??
    PROFILE_SETTINGS_TABS[8];
  const infoTab =
    PROFILE_SETTINGS_TABS.find((tab) => tab.labelKey === "info") ??
    PROFILE_SETTINGS_TABS[0];
  const imageTab =
    PROFILE_SETTINGS_TABS.find((tab) => tab.labelKey === "changeImage") ??
    PROFILE_SETTINGS_TABS[1];
  const coverTab =
    PROFILE_SETTINGS_TABS.find((tab) => tab.labelKey === "cover") ??
    PROFILE_SETTINGS_TABS[2];
  const slugTab = React.useMemo<ProfileTabDef>(
    () => ({
      labelKey: "slug",
      icon: "link",
      accent: "#0f172a",
      href: "/profile/slug",
    }),
    [],
  );
  const abTesterTab = React.useMemo<ProfileTabDef>(
    () => ({
      labelKey: "abTester",
      icon: "spark",
      accent: "#0f172a",
      href: "/profile/aB-tester",
    }),
    [],
  );

  const completionItems = React.useMemo<CompletionItem[]>(() => {
    if (!user) return [];

    return [
      {
        key: "identity",
        label: t("checklist.identity"),
        done: Boolean(user.name || user.firstName),
        tab: infoTab,
      },
      {
        key: "image",
        label: t("checklist.image"),
        done: Boolean(user.image),
        tab: imageTab,
      },
      {
        key: "cover",
        label: t("checklist.cover"),
        done: Boolean(user.coverImage),
        tab: coverTab,
      },
      {
        key: "bio",
        label: t("checklist.bio"),
        done: Boolean(user.bio),
        tab: infoTab,
      },
      {
        key: "contact",
        label: t("checklist.contact"),
        done: Boolean(user.phone1 || user.email),
        tab: infoTab,
      },
      {
        key: "slug",
        label: t("checklist.slug"),
        done: Boolean(user.slug),
        tab: slugTab,
      },
      {
        key: "social",
        label: t("checklist.social"),
        done: Boolean(user.website || user.linkedin || user.instagram),
        tab: linksTab,
      },
      {
        key: "share",
        label: t("checklist.share"),
        done: Boolean(user.qrCode),
        tab: qrTab,
      },
    ];
  }, [coverTab, imageTab, infoTab, linksTab, qrTab, slugTab, t, user]);

  const completionScore = React.useMemo(() => {
    if (!completionItems.length) return 0;
    return Math.round(
      (completionItems.filter((item) => item.done).length /
        completionItems.length) *
        100,
    );
  }, [completionItems]);

  const tone = getStatusTone(completionScore);
  const profileImage = getImageSrc(user?.image);
  const coverImage = user?.coverImage
    ? (getImageSrc(user.coverImage, "image/png") ?? user.coverImage)
    : null;
  const firstName = getFirstName(user);
  const displayName = user ? getDisplayName(user) : "";
  const missingItems = completionItems.filter((item) => !item.done);
  const primaryPrompt = missingItems[0];
  const needsSetup = !user?.slug || completionScore < 55;
  const statusLabel =
    completionScore >= 80
      ? t("health.ready")
      : completionScore >= 55
        ? t("health.growing")
        : t("health.setup");

  const quickActions = [
    {
      key: "preview",
      label: t("actions.preview"),
      icon: "eye" as const,
      onClick: () => navigateTo(previewTab),
    },
    {
      key: "edit",
      label: t("actions.edit"),
      icon: "idCard" as const,
      onClick: () => navigateTo(PROFILE_BUILDER_TAB),
    },
    {
      key: "copy",
      label: copied ? t("actions.copied") : t("actions.copy"),
      icon: "copy" as const,
      onClick: async () => {
        if (!publicUrl) return;
        await navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
    },
    {
      key: "leads",
      label: t("actions.leads"),
      icon: "user" as const,
      onClick: () => navigateTo(leadsTab),
    },
  ];

  const utilityTiles = [
    {
      key: "qr",
      tab: qrTab,
      stat: user?.qrCode ? t("utility.ready") : t("utility.missing"),
    },
    { key: "wallet", tab: walletTab, stat: t("utility.launch") },
    {
      key: "optimize",
      tab: optimizeTab,
      stat: `${completionScore}% ${t("utility.health")}`,
    },
    { key: "abTester", tab: abTesterTab, stat: t("utility.experiment") },
    {
      key: "video",
      tab: videoTab,
      stat: user?.videoUrl ? t("utility.ready") : t("utility.optional"),
    },
    {
      key: "analytics",
      tab: analyticsTab,
      stat: `${metrics.profileVisits} ${t("utility.visits")}`,
    },
  ];

  if (!user) {
    return (
      <DashboardShell navigating={navigating}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  const actionButtonClass =
    "rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300/40";
  const secondaryButtonClass =
    "rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]";

  return (
    <DashboardShell navigating={navigating}>
      <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className={`hidden p-5 text-white lg:flex lg:min-h-[calc(100vh-9rem)] lg:flex-col lg:justify-between ${PANEL_SURFACE} ${PANEL_BORDER}`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/70">
                  {t("brand.eyebrow")}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
                  {t("brand.name")}
                </h1>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                <ProfileIcons.home className="h-5 w-5" />
              </div>
            </div>

            <div className={`${SUBTLE_SURFACE} p-4 backdrop-blur-sm`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-black text-lg font-bold text-white">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={displayName}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">
                    {displayName}
                  </p>
                  <p className={`truncate text-sm ${SOFT_TEXT}`}>
                    {user.position || user.email}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-black/30 px-3 py-2 text-sm text-white/70">
                <span className="truncate">
                  {publicUrl || t("labels.noLink")}
                </span>
                <button
                  type="button"
                  onClick={() => void quickActions[2].onClick()}
                  className="ml-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-950"
                >
                  {t("actions.copy")}
                </button>
              </div>
            </div>

            <nav className="space-y-5">
              {PROFILE_DASHBOARD_GROUPS.map((group) => (
                <div key={group.key}>
                  <p
                    className={`mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${MUTED_TEXT}`}
                  >
                    {t(group.titleKey)}
                  </p>
                  <div className="space-y-1.5">
                    {group.items.map((item) => {
                      const Icon = ProfileIcons[item.icon];
                      const isActive = item.labelKey === "dashboard";
                      return (
                        <button
                          key={`${group.key}-${item.labelKey}`}
                          type="button"
                          onClick={() => navigateTo(item)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                            isActive
                              ? "bg-amber-400 text-slate-950 shadow-[0_10px_24px_rgba(251,191,36,0.2)]"
                              : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-white/85 shadow-sm" : "bg-white/[0.08]"}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">
                              {t(`nav.items.${item.labelKey}.label`)}
                            </span>
                            <span
                              className={`block truncate text-xs ${isActive ? "text-slate-700/80" : MUTED_TEXT}`}
                            >
                              {t(`nav.items.${item.labelKey}.desc`)}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(251,191,36,0.12),rgba(15,23,42,0.28))] p-4 text-white ring-1 ring-amber-400/15">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <ProfileIcons.settings className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {t("sidebar.footerTitle")}
                </p>
                <p className={`text-xs ${SOFT_TEXT}`}>
                  {t("sidebar.footerDescription")}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        <main className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 md:p-5 ${PANEL_SURFACE} ${PANEL_BORDER}`}
          >
            <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(251,191,36,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-5 ring-1 ring-amber-400/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-400">
                    {t("hero.eyebrow")}
                  </p>
                  <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                    {firstName
                      ? t("hero.greeting", { name: firstName })
                      : t("hero.title")}
                  </h2>
                  <p
                    className={`mt-2 max-w-2xl text-sm leading-6 ${SOFT_TEXT}`}
                  >
                    {t("hero.description")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo(previewTab)}
                    className={secondaryButtonClass}
                  >
                    {t("hero.preview")}
                  </button>
                  <button
                    type="button"
                    onClick={() => void quickActions[2].onClick()}
                    className={`${actionButtonClass} bg-amber-400 text-slate-950 hover:bg-amber-300`}
                  >
                    {copied ? t("actions.copied") : t("hero.copyPublicLink")}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)]">
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
                className={`${SUBTLE_SURFACE} p-5 md:p-6`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-400">
                      {t("card.eyebrow")}
                    </p>
                    <h3 className="text-2xl font-black tracking-tight text-white">
                      {needsSetup
                        ? t("card.setupTitle")
                        : t("card.manageTitle")}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo(PROFILE_BUILDER_TAB)}
                    className={`hidden sm:inline-flex ${secondaryButtonClass}`}
                  >
                    {t("card.editButton")}
                  </button>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        needsSetup && primaryPrompt
                          ? primaryPrompt.tab
                          : PROFILE_BUILDER_TAB,
                      )
                    }
                    className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,rgba(251,191,36,0.12)_0%,rgba(251,146,60,0.07)_100%)] px-6 text-center ring-1 ring-amber-400/18 transition hover:bg-[linear-gradient(180deg,rgba(251,191,36,0.18)_0%,rgba(251,146,60,0.1)_100%)]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-amber-300 shadow-[0_18px_40px_rgba(251,146,60,0.12)] ring-1 ring-white/8">
                      <ProfileIcons.idCard className="h-8 w-8" />
                    </div>
                    <p className="mt-6 text-xl font-bold text-white">
                      {needsSetup
                        ? t("card.primaryCtaTitle")
                        : t("card.secondaryCtaTitle")}
                    </p>
                    <p className={`mt-3 text-sm leading-6 ${SOFT_TEXT}`}>
                      {needsSetup && primaryPrompt
                        ? t("card.primaryCtaDescription", {
                            item: primaryPrompt.label.toLowerCase(),
                          })
                        : t("card.secondaryCtaDescription")}
                    </p>
                  </button>

                  <div className="overflow-hidden rounded-[28px] bg-black ring-1 ring-white/8">
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      {coverImage ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${coverImage})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#fed7aa,_#fdba74_48%,_#1e293b_100%)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                      <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                        {completionScore >= 80
                          ? t("card.live")
                          : t("card.inProgress")}
                      </div>
                    </div>

                    <div className="relative px-5 pb-5 pt-0">
                      <div className="-mt-10 flex items-end justify-between gap-4">
                        <div className="flex items-end gap-3">
                          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border-4 border-black bg-slate-900 text-2xl font-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                            {profileImage ? (
                              <Image
                                src={profileImage}
                                alt={displayName}
                                width={80}
                                height={80}
                                unoptimized
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span>{displayName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="pb-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                              {t("card.previewLabel")}
                            </p>
                            <h4 className="text-2xl font-black tracking-tight text-white">
                              {displayName}
                            </h4>
                            <p className={`text-sm ${SOFT_TEXT}`}>
                              {[user.position, user.company]
                                .filter(Boolean)
                                .join(" at ") || t("labels.addPosition")}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateTo(linksTab)}
                          className={`mb-2 hidden md:inline-flex ${secondaryButtonClass}`}
                        >
                          {t("card.manageLinks")}
                        </button>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2.5">
                        {quickActions.map((action, index) => {
                          const Icon = ProfileIcons[action.icon];
                          return (
                            <button
                              key={action.key}
                              type="button"
                              onClick={() => void action.onClick()}
                              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                index === 0
                                  ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                                  : "bg-white/[0.04] text-white ring-1 ring-white/8 hover:bg-white/[0.08]"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {action.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className={`${SUBTLE_SURFACE} p-5 md:p-6`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-amber-400">
                        {t("health.eyebrow")}
                      </p>
                      <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                        {t("health.title")}
                      </h3>
                      <p className={`mt-2 text-sm leading-6 ${SOFT_TEXT}`}>
                        {t("health.description")}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.chip}`}
                    >
                      {statusLabel}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/8">
                      <div
                        className={`absolute inset-[8px] rounded-full border-[6px] ${tone.ring}`}
                        style={{
                          clipPath: `inset(${100 - completionScore}% 0 0 0)`,
                        }}
                      />
                      <span className="text-2xl font-black text-white">
                        {completionScore}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">
                        {t("health.scoreLabel", { score: completionScore })}
                      </p>
                      <p className={`mt-1 text-sm ${SOFT_TEXT}`}>
                        {needsSetup && primaryPrompt
                          ? t("health.prompt", {
                              item: primaryPrompt.label.toLowerCase(),
                            })
                          : t("health.readyPrompt")}
                      </p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${tone.bar}`}
                          style={{ width: `${completionScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {completionItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => navigateTo(item.tab)}
                        className="flex w-full items-center justify-between rounded-2xl bg-white/[0.025] px-4 py-3 text-left ring-1 ring-white/7 transition hover:bg-white/[0.045]"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${item.done ? "bg-amber-400/15 text-amber-200" : "bg-orange-500/12 text-orange-200"}`}
                          >
                            {item.done ? "OK" : "!"}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-white">
                              {item.label}
                            </span>
                            <span className={`block text-xs ${MUTED_TEXT}`}>
                              {item.done
                                ? t("health.done")
                                : t("health.needsAttention")}
                            </span>
                          </span>
                        </span>
                        <ProfileIcons.arrow className="h-4 w-4 text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${SUBTLE_SURFACE} p-5 md:p-6`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-amber-400">
                        {t("performance.eyebrow")}
                      </p>
                      <h3 className="text-2xl font-black tracking-tight text-white">
                        {t("performance.title")}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo(analyticsTab)}
                      className={secondaryButtonClass}
                    >
                      {t("performance.viewAnalytics")}
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        key: "leads",
                        label: t("performance.leads"),
                        value: metrics.leads,
                      },
                      {
                        key: "visits",
                        label: t("performance.visits"),
                        value: metrics.profileVisits,
                      },
                      {
                        key: "shares",
                        label: t("performance.shares"),
                        value: metrics.profileShares,
                      },
                      {
                        key: "clicks",
                        label: t("performance.clicks"),
                        value: metrics.socialLinkClicks,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="rounded-3xl bg-white/[0.025] px-4 py-4 ring-1 ring-white/7"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                          {item.label}
                        </p>
                        <p className="mt-3 text-3xl font-black tracking-tight text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className={`p-5 md:p-6 ${PANEL_SURFACE} ${PANEL_BORDER}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-amber-400">
                  {t("utility.eyebrow")}
                </p>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {t("utility.title")}
                </h3>
              </div>
              <div className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 md:block">
                {t("utility.subtitle")}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {utilityTiles.map(({ key, tab, stat }) => {
                const Icon = ProfileIcons[tab.icon];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigateTo(tab)}
                    className="group rounded-[28px] bg-white/[0.025] p-5 text-left ring-1 ring-white/7 transition hover:-translate-y-0.5 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-amber-300 ring-1 ring-white/8">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold text-amber-100 ring-1 ring-white/8">
                        {stat}
                      </span>
                    </div>
                    <p className="mt-6 text-lg font-bold tracking-tight text-white">
                      {t(`nav.items.${tab.labelKey}.label`)}
                    </p>
                    <p className={`mt-2 text-sm leading-6 ${SOFT_TEXT}`}>
                      {t(`nav.items.${tab.labelKey}.desc`)}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 lg:hidden"
          >
            {PROFILE_DASHBOARD_GROUPS.map((group) => (
              <div
                key={group.key}
                className={`${PANEL_SURFACE} ${PANEL_BORDER} p-5`}
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                  {t(group.titleKey)}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.items.map((item) => {
                    const Icon = ProfileIcons[item.icon];
                    return (
                      <button
                        key={`${group.key}-${item.labelKey}-mobile`}
                        type="button"
                        onClick={() => navigateTo(item)}
                        className="flex items-center gap-3 rounded-2xl bg-white/[0.025] px-4 py-3 text-left ring-1 ring-white/7 transition hover:bg-white/[0.05]"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black ring-1 ring-white/8">
                          <Icon className="h-4 w-4 text-amber-300" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">
                            {t(`nav.items.${item.labelKey}.label`)}
                          </span>
                          <span
                            className={`block truncate text-xs ${MUTED_TEXT}`}
                          >
                            {t(`nav.items.${item.labelKey}.desc`)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.section>
        </main>
      </div>
    </DashboardShell>
  );
}
