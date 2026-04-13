"use client";

import React from "react";
import ProfileHeader from "../profileDetails/ProfileHeader";
import SocialMediaLinks from "../profileDetails/SocialMediaLinks";
import { BuilderDraftState, BuilderTemplateLayout } from "./types";
import { ResolvedCardStyle } from "@/utils/cardTheme";

const layoutShell: Record<
  BuilderTemplateLayout,
  { frame: string; glow: string; accent: string }
> = {
  classic: {
    frame: "from-white to-slate-100",
    glow: "rgba(245,158,11,0.14)",
    accent: "Studio",
  },
  spotlight: {
    frame: "from-slate-900 via-slate-800 to-slate-900",
    glow: "rgba(34,211,238,0.18)",
    accent: "Signature",
  },
  minimal: {
    frame: "from-stone-100 to-white",
    glow: "rgba(37,99,235,0.12)",
    accent: "Clean",
  },
};

function PreviewActions({
  draftUser,
  cardStyle,
}: {
  draftUser: BuilderDraftState;
  cardStyle: ResolvedCardStyle;
}) {
  const textColor =
    cardStyle.name === "white" ? "text-slate-700" : "text-white/80";
  const ghostBg =
    cardStyle.name === "white"
      ? "bg-black/[0.04] border-black/[0.07]"
      : "bg-white/[0.05] border-white/[0.08]";

  const buttons = [
    { label: draftUser.phone1 ? "Call" : "Phone", primary: true },
    { label: draftUser.whatsapp ? "Message" : "Message", primary: false },
    { label: draftUser.email || draftUser.email2 ? "Mail" : "Email", primary: false },
  ];

  return (
    <div className="px-4 pt-5 pb-2">
      <div className="grid grid-cols-3 gap-2.5">
        {buttons.map((button) => (
          <div
            key={button.label}
            className={`rounded-2xl border px-2 py-3 text-center text-[11px] font-semibold ${
              button.primary
                ? "text-black shadow-lg"
                : `${ghostBg} ${textColor}`
            }`}
            style={
              button.primary
                ? {
                    background: `linear-gradient(135deg, ${cardStyle.accent} 0%, ${cardStyle.accent}cc 100%)`,
                    borderColor: `${cardStyle.accent}55`,
                  }
                : undefined
            }
          >
            {button.label}
          </div>
        ))}
      </div>
      <div
        className="mt-3 rounded-2xl px-4 py-3 text-center text-sm font-bold text-black shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${cardStyle.accent} 0%, ${cardStyle.accent}cc 100%)`,
        }}
      >
        Add To Contacts
      </div>
    </div>
  );
}

function PreviewDetails({
  draftUser,
  cardStyle,
}: {
  draftUser: BuilderDraftState;
  cardStyle: ResolvedCardStyle;
}) {
  const detailRows = [
    draftUser.phone1,
    draftUser.email2 || draftUser.email,
    [
      draftUser.street1,
      draftUser.city,
      draftUser.state,
      draftUser.country,
    ]
      .filter(Boolean)
      .join(", "),
    draftUser.bio,
  ].filter(Boolean);

  if (detailRows.length === 0) {
    return null;
  }

  const rowBg =
    cardStyle.name === "white"
      ? "bg-black/[0.035] border-black/[0.06] text-slate-600"
      : "bg-white/[0.045] border-white/[0.07] text-white/70";

  return (
    <div className="px-4 pt-3 pb-2">
      <div className="space-y-2">
        {detailRows.slice(0, 4).map((value, index) => (
          <div
            key={`${index}-${value}`}
            className={`rounded-2xl border px-3 py-2.5 text-[11px] leading-relaxed ${rowBg}`}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileBuilderPreview({
  draftUser,
  cardStyle,
  layout,
  previewLabel,
}: {
  draftUser: BuilderDraftState;
  cardStyle: ResolvedCardStyle;
  layout: BuilderTemplateLayout;
  previewLabel: string;
}) {
  const shell = layoutShell[layout];

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div
        className="absolute inset-x-10 top-12 h-48 rounded-full blur-3xl"
        style={{ background: shell.glow }}
      />
      <div className="absolute -right-3 top-20 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
        Studio Preview
      </div>

      <div className="relative rounded-[2.5rem] border border-white/10 bg-[#07090f] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-3 h-6 w-28 rounded-full bg-white/[0.08]" />

        <div
          className={`rounded-[2.1rem] bg-gradient-to-b ${shell.frame} p-2 shadow-inner`}
        >
          <div className="overflow-hidden rounded-[1.8rem] border border-black/10 bg-black">
            <div className="flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
              <span>{previewLabel}</span>
              <span>{shell.accent}</span>
            </div>

            <div className="pointer-events-none">
              <ProfileHeader
                user={draftUser}
                cardStyle={cardStyle}
                coverPreview={null}
                handleCoverChange={() => undefined}
                saveCover={() => undefined}
                cancelCover={() => undefined}
              />
              <PreviewActions draftUser={draftUser} cardStyle={cardStyle} />
              <PreviewDetails draftUser={draftUser} cardStyle={cardStyle} />
              <SocialMediaLinks user={draftUser} cardStyle={cardStyle} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/55">
        Every change updates this mockup instantly. Your real profile only changes after you save.
      </div>
    </div>
  );
}
