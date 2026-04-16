"use client";

import { useMemo, useState } from "react";
import { Link, useRouter } from "@/navigation";
import { SALES_PRICE_IDS, type BillingCycle } from "@/lib/planCatalog";

type Locale = "bg" | "en";

type Props = {
  locale: string;
  source?: "lp" | "plans";
};

type PlanCard = {
  key: "free" | "pro" | "teams" | "enterprise";
  badge: string;
  title: string;
  subtitle: string;
  priceLines: Partial<Record<BillingCycle, string>>;
  helper: string;
  cta: string;
  ctaKind: "free" | "checkout-pro" | "checkout-teams" | "sales";
  featured?: boolean;
  features: string[];
};

const copy = {
  bg: {
    heroEyebrow: "Sales Landing · New Pricing",
    heroTitle: "Превърни физическия networking в цифрови лийдове",
    heroSubtitle:
      "NinjaCards комбинира NFC карта, дигитален профил и lead capture flow в една ясна система за хора, екипи и бизнеси.",
    startFree: "Започни безплатно",
    talkSales: "Говори с sales",
    trust: ["1 профил", "1 карта", "реални лийдове", "ясен upgrade path"],
    howTitle: "Как работи",
    howSubtitle: "Продуктът трябва да се разбере за секунди: картата стартира разговора, профилът събира вниманието, а NinjaCards пази лийда.",
    howSteps: [
      { title: "Tap или scan", body: "NFC картата или QR кодът отварят дигиталния ти профил веднага." },
      { title: "Профилът продава теб", body: "Човекът вижда линковете, контактите, CTA бутоните и бранда ти на едно място." },
      { title: "Запазваш лийда", body: "NinjaCards превръща физическия контакт в измерим digital lead flow." },
    ],
    whyTitle: "Защо това работи",
    whyCards: [
      { title: "Изглеждаш по-професионално", body: "Картата и профилът заедно създават по-силен first impression от стандартна визитка." },
      { title: "Събираш лийдове мигновено", body: "Не разчиташ на ръчно въвеждане на контакти и изгубени визитки." },
      { title: "Follow-up-ът става по-лесен", body: "Лийдовете ти са събрани в една логика, а не разпръснати по chat и notes." },
      { title: "Екипите работят централно", body: "Teams добавя admin, branding и една система вместо хаос от отделни акаунти." },
    ],
    cardTitle: "Карта логика",
    cardSubtitle:
      "Картата не е страничен аксесоар. Тя е физическото начало на sales flow-а. Затова generic и personalized картите имат различна икономика и различен upsell смисъл.",
    genericTitle: "Generic Card",
    genericBody:
      "Free потребителят може да отключи 1 generic card само след qualification. Това дава стойност, без да отваря злоупотреба още на signup.",
    personalizedTitle: "Personalized Card",
    personalizedBody:
      "Персонализираната карта е premium value. На monthly Pro е add-on за €20, а в annual Pro е включена.",
    cardRules: [
      "Free може да отключи 1 generic card",
      "Изисква profile score над 50",
      "Изисква verified email",
      "Shipping се плаща от потребителя",
      "Pro monthly personalized card = €20 add-on",
      "Pro annual включва 1 personalized card",
    ],
    pricingTitle: "Планове и цени",
    pricingSubtitle:
      "Това е новият публичен модел: Free за първи успех, Pro за сериозно използване, Teams за до 15 профила, Enterprise / Bulk за custom rollout-и.",
    cycleMonthly: "Месечно",
    cycleQuarterly: "3 месеца",
    cycleAnnual: "Годишно",
    pricingFootnote: "Annual Pro е най-силната offer логика, защото включва personalized card. Teams е фирмен пакет, не по-евтин сбор от Pro seats.",
    comparisonTitle: "Teams срещу 15 x Pro",
    comparisonSubtitle:
      "Teams не съществува, за да е просто по-евтино на човек. То съществува, за да даде фирмен контрол, по-малко operational шум и по-лесен team rollout.",
    comparisonRows: [
      ["Месечна логика", "15 отделни абонамента = €104.85", "1 фирмен пакет = €129"],
      ["Billing", "15 отделни плащания", "1 централизирано плащане"],
      ["Branding", "Всеки профил се настройва отделно", "Един фирмен стандарт"],
      ["Control", "Няма централен admin", "Admin роли и member control"],
      ["Analytics", "Разпиляна видимост", "Team analytics dashboard"],
      ["Cards", "Няма team card benefits", "Bulk ordering и team benefits"],
    ],
    comparisonSummary:
      "Teams е правилният избор за екип, който иска една система, един admin и по-лесно управление на целия rollout.",
    faqTitle: "Често задавани въпроси",
    faqItems: [
      {
        q: "Какво става във Free след 1 stored lead?",
        a: "Профилът и споделянето остават активни, но за повече stored leads, export и по-сериозна обработка трябва Pro.",
      },
      {
        q: "Как се отключва generic card на Free?",
        a: "Тя се отключва само при profile score над 50, verified email и платен shipping. Това пази качеството на onboarding-а и намалява abuse-а.",
      },
      {
        q: "Каква е разликата между Pro monthly и Pro annual?",
        a: "Monthly е €6.99 и personalized card е add-on за €20. Annual е €69 и включва 1 personalized card, което го прави по-силната оферта.",
      },
      {
        q: "Защо Teams е различен от няколко Pro акаунта?",
        a: "Защото получаваш central billing, admin роли, team analytics, shared branding и по-добър team rollout вместо множество отделни акаунти.",
      },
      {
        q: "Кога трябва да говорим за Enterprise / Bulk?",
        a: "Когато имаш 25+ users, 200+ cards или rollout със специфични logistics, onboarding и custom условия.",
      },
    ],
    finalTitle: "Готов ли си да преминеш към по-силен networking flow?",
    finalSubtitle:
      "Започни с Free, вземи Pro, когато искаш ownership над лийдовете си, и говори със sales, ако правиш team или bulk rollout.",
    contactHint: "Enterprise / Bulk inquiries",
    checkoutFallback: "Цената още не е вързана за директен checkout. Отваряме pricing flow-а.",
  },
  en: {
    heroEyebrow: "Sales Landing · New Pricing",
    heroTitle: "Turn physical networking into digital leads",
    heroSubtitle:
      "NinjaCards combines an NFC card, a digital profile and a lead capture flow into one clear system for people, teams and businesses.",
    startFree: "Start Free",
    talkSales: "Talk to Sales",
    trust: ["1 profile", "1 card", "real leads", "clear upgrade path"],
    howTitle: "How it works",
    howSubtitle:
      "The product should make sense in seconds: the card starts the conversation, the profile holds attention and NinjaCards keeps the lead.",
    howSteps: [
      { title: "Tap or scan", body: "The NFC card or QR code opens your digital profile instantly." },
      { title: "Your profile sells you", body: "People see your links, contacts, CTA buttons and brand in one place." },
      { title: "You keep the lead", body: "NinjaCards turns a physical interaction into a measurable digital lead flow." },
    ],
    whyTitle: "Why it works",
    whyCards: [
      { title: "You look more professional", body: "The card and profile together create a much stronger first impression than a normal business card." },
      { title: "You capture leads instantly", body: "You are no longer relying on manual contact entry and lost paper cards." },
      { title: "Follow-up gets easier", body: "Your leads stay inside one system instead of being scattered across chats and notes." },
      { title: "Teams manage centrally", body: "Teams adds admin controls, branding and one shared system instead of account chaos." },
    ],
    cardTitle: "Card logic",
    cardSubtitle:
      "The card is not a side accessory. It is the physical start of the sales flow. That is why generic and personalized cards need different economics and different upsell roles.",
    genericTitle: "Generic Card",
    genericBody:
      "A Free user can unlock one generic card only after qualification. That delivers value without opening abuse right at signup.",
    personalizedTitle: "Personalized Card",
    personalizedBody:
      "The personalized card is premium value. It is a €20 add-on on monthly Pro and included in annual Pro.",
    cardRules: [
      "Free can unlock 1 generic card",
      "Requires profile score above 50",
      "Requires verified email",
      "Shipping is paid by the user",
      "Pro monthly personalized card = €20 add-on",
      "Pro annual includes 1 personalized card",
    ],
    pricingTitle: "Plans and pricing",
    pricingSubtitle:
      "This is the new public model: Free for first success, Pro for serious usage, Teams for up to 15 profiles, Enterprise / Bulk for custom rollouts.",
    cycleMonthly: "Monthly",
    cycleQuarterly: "3 months",
    cycleAnnual: "Annual",
    pricingFootnote:
      "Annual Pro is the strongest offer because it includes a personalized card. Teams is a company system, not just a cheaper stack of Pro seats.",
    comparisonTitle: "Teams vs 15x Pro",
    comparisonSubtitle:
      "Teams does not exist to be cheaper per seat. It exists to deliver company control, less operational noise and a cleaner team rollout.",
    comparisonRows: [
      ["Monthly logic", "15 separate subscriptions = €104.85", "1 company package = €129"],
      ["Billing", "15 separate payments", "1 centralized payment"],
      ["Branding", "Each profile is configured separately", "One company standard"],
      ["Control", "No central admin", "Admin roles and member control"],
      ["Analytics", "Scattered visibility", "Team analytics dashboard"],
      ["Cards", "No team card benefits", "Bulk ordering and team benefits"],
    ],
    comparisonSummary:
      "Teams is the right choice for a business that wants one system, one admin and smoother rollout control across the whole team.",
    faqTitle: "FAQ",
    faqItems: [
      {
        q: "What happens on Free after 1 stored lead?",
        a: "Your profile and sharing stay active, but more stored leads, export and serious lead handling require Pro.",
      },
      {
        q: "How does the Free generic card unlock work?",
        a: "It unlocks only after profile score is above 50, the email is verified and shipping is paid. This protects quality and reduces abuse.",
      },
      {
        q: "What is the difference between Pro monthly and Pro annual?",
        a: "Monthly is €6.99 and the personalized card is a €20 add-on. Annual is €69 and includes one personalized card, so it is the stronger offer.",
      },
      {
        q: "Why is Teams different from multiple Pro accounts?",
        a: "Because you get central billing, admin roles, team analytics, shared branding and a better team rollout instead of many separate accounts.",
      },
      {
        q: "When should we talk about Enterprise / Bulk?",
        a: "When you have 25+ users, 200+ cards or a rollout with custom logistics, onboarding or enterprise terms.",
      },
    ],
    finalTitle: "Ready for a stronger networking flow?",
    finalSubtitle:
      "Start with Free, move to Pro when you want lead ownership, and talk to sales when you need a team or bulk rollout.",
    contactHint: "Enterprise / Bulk inquiries",
    checkoutFallback: "The direct price mapping is not configured yet. Opening the existing pricing flow.",
  },
} as const;

async function createCheckoutSession(priceId: string, email?: string) {
  const response = await fetch("/api/payments/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      items: [{ type: "subscription", priceId, quantity: 1 }],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  return response.json();
}

function SalesCtaButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const classes =
    variant === "primary"
      ? "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 text-black shadow-[0_20px_60px_rgba(251,146,60,0.35)] hover:scale-[1.02]"
      : variant === "secondary"
        ? "border border-white/20 bg-white/8 text-white hover:bg-white/14"
        : "border border-amber-400/30 bg-amber-500/8 text-amber-200 hover:bg-amber-500/14";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-6 py-3 text-sm font-semibold transition duration-200 ${classes}`}
    >
      {children}
    </button>
  );
}

export default function SalesLandingPage({ locale, source = "lp" }: Props) {
  const l = (locale === "en" ? "en" : "bg") as Locale;
  const t = copy[l];
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [loadingCta, setLoadingCta] = useState<string | null>(null);

  const planCards = useMemo<PlanCard[]>(
    () => [
      {
        key: "free",
        badge: "Entry",
        title: "Free",
        subtitle:
          l === "bg"
            ? "За първи профил, първи lead signal и qualification path към generic card."
            : "For a first profile, first lead signal and a qualification path to a generic card.",
        priceLines: { monthly: "€0", quarterly: "€0", annual: "€0" },
        helper: l === "bg" ? "1 stored lead / месец" : "1 stored lead / month",
        cta: t.startFree,
        ctaKind: "free",
        features: [
          l === "bg" ? "1 профил" : "1 profile",
          l === "bg" ? "1 stored lead / месец" : "1 stored lead / month",
          l === "bg" ? "До 3 линка" : "Up to 3 links",
          "Basic stats",
          "NinjaCards branding",
          l === "bg"
            ? "Generic card unlock след qualification"
            : "Generic card unlock after qualification",
        ],
      },
      {
        key: "pro",
        badge: "Main Offer",
        title: "Pro",
        subtitle:
          l === "bg"
            ? "За сериозно използване, ownership над лийдовете и по-професионално присъствие."
            : "For serious usage, lead ownership and a more professional presence.",
        priceLines: { monthly: "€6.99", quarterly: "€17.99", annual: "€69" },
        helper:
          l === "bg"
            ? "€20 personalized card add-on на monthly · annual includes 1 card"
            : "€20 personalized card add-on on monthly · annual includes 1 card",
        cta: l === "bg" ? "Вземи Pro" : "Get Pro",
        ctaKind: "checkout-pro",
        featured: true,
        features: [
          l === "bg" ? "10 stored leads / месец" : "10 stored leads / month",
          "Lead export",
          "Advanced analytics",
          "Branding removal",
          "AI tools",
          l === "bg"
            ? "Personalized card add-on за €20"
            : "Personalized card add-on for €20",
        ],
      },
      {
        key: "teams",
        badge: "Up To 15",
        title: "Teams",
        subtitle:
          l === "bg"
            ? "За екипи до 15 профила, които искат една фирмена система вместо отделни акаунти."
            : "For teams up to 15 profiles that want one company system instead of separate accounts.",
        priceLines: { monthly: "€129", quarterly: "€349", annual: "€1290" },
        helper: "central billing + admin + team dashboard",
        cta: l === "bg" ? "Вземи Teams" : "Get Teams",
        ctaKind: "checkout-teams",
        features: [
          l === "bg" ? "До 15 профила" : "Up to 15 profiles",
          "Centralized billing",
          "Admin roles",
          "Shared branding",
          "Team analytics dashboard",
          "Bulk card ordering / team benefits",
        ],
      },
      {
        key: "enterprise",
        badge: "Sales-Led",
        title: l === "bg" ? "Enterprise / Bulk" : "Enterprise / Bulk",
        subtitle:
          l === "bg"
            ? "За 25+ users, 200+ cards или rollout със custom logistics и onboarding."
            : "For 25+ users, 200+ cards or rollouts with custom logistics and onboarding.",
        priceLines: {
          monthly: l === "bg" ? "Запитване" : "Contact us",
          quarterly: "",
          annual: "",
        },
        helper: "custom quote only",
        cta: t.talkSales,
        ctaKind: "sales",
        features: [
          "Custom rollout planning",
          "Priority onboarding",
          "Custom terms",
          "200+ cards support",
        ],
      },
    ],
    [l, t.startFree, t.talkSales],
  );

  const handleSalesClick = () => {
    router.push({
      pathname: "/contact",
      query: { intent: "enterprise-bulk", source },
    });
  };

  const handleCheckout = async (plan: "PRO" | "TEAMS") => {
    const priceId = SALES_PRICE_IDS[plan][billingCycle];
    if (!priceId) {
      alert(t.checkoutFallback);
      router.push("/plans");
      return;
    }

    try {
      setLoadingCta(plan);
      const session = await createCheckoutSession(priceId);
      if (session?.url) {
        window.location.href = session.url;
        return;
      }
      router.push("/plans");
    } catch {
      alert(t.checkoutFallback);
      router.push("/plans");
    } finally {
      setLoadingCta(null);
    }
  };

  return (
    <div className="bg-[#08090d] text-white">
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 inline-flex rounded-full border border-amber-400/25 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
            {t.heroEyebrow}
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                {t.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {t.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/login">
                  <SalesCtaButton variant="primary">{t.startFree}</SalesCtaButton>
                </Link>
                <SalesCtaButton variant="secondary" onClick={handleSalesClick}>
                  {t.talkSales}
                </SalesCtaButton>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                {t.trust.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-5 lg:grid-cols-[0.72fr_0.9fr]">
                <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4 shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
                  <div className="mx-auto w-[290px] rounded-[2.6rem] border border-white/10 bg-[#04070c] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                    <div className="rounded-[2rem] border border-white/10 bg-[#0b1018] p-3">
                      <div className="mb-3 flex items-center justify-between px-2 text-[11px] text-slate-400">
                        <span>9:41</span>
                        <span>{l === "bg" ? "Live demo" : "Live demo"}</span>
                      </div>
                      <div className="h-[520px] overflow-y-auto rounded-[1.7rem] border border-white/8 bg-gradient-to-b from-[#121926] to-[#090d15] p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        <div className="rounded-[1.4rem] bg-gradient-to-br from-amber-500/35 via-orange-400/15 to-cyan-400/10 p-[1px]">
                          <div className="rounded-[1.35rem] bg-[#0b1119] p-4">
                            <div className="mb-4 flex items-center gap-3">
                              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10">
                                <img src="/navlogo.png" alt="NinjaCards profile" className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-white">NinjaCards</div>
                                <div className="text-sm text-amber-200">
                                  {l === "bg" ? "Digital business profile" : "Digital business profile"}
                                </div>
                              </div>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                              {l === "bg"
                                ? "Това е preview на профила вътре в телефона. Потребителят може да scroll-ва и да види как изглежда реалното networking изживяване."
                                : "This is an in-phone profile preview. Users can scroll and see how the real networking experience feels."}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3">
                          {[
                            l === "bg" ? "Запази контакт" : "Save contact",
                            l === "bg" ? "Изпрати запитване" : "Send inquiry",
                            l === "bg" ? "Отвори сайта" : "Open website",
                          ].map((cta) => (
                            <div key={cta} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100">
                              {cta}
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                            {l === "bg" ? "Lead capture" : "Lead capture"}
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">
                            {l === "bg" ? "Ново запитване е записано" : "New inquiry captured"}
                          </div>
                          <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                            {l === "bg"
                              ? "Physical tap -> profile view -> digital lead"
                              : "Physical tap -> profile view -> digital lead"}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3">
                          {[
                            l === "bg" ? "Instagram" : "Instagram",
                            l === "bg" ? "LinkedIn" : "LinkedIn",
                            l === "bg" ? "WhatsApp" : "WhatsApp",
                            l === "bg" ? "Calendar booking" : "Calendar booking",
                          ].map((linkItem) => (
                            <div key={linkItem} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f1520] px-4 py-3">
                              <span className="text-sm text-slate-200">{linkItem}</span>
                              <span className="text-xs text-slate-500">open</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-[#090d15] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">
                          {l === "bg" ? "Card design" : "Card design"}
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {l === "bg" ? "Създай визията си" : "Build your card look"}
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {l === "bg" ? "Next step" : "Next step"}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-[#0c1118] p-4">
                      <div className="relative overflow-hidden rounded-[1.3rem] border border-amber-300/15 bg-gradient-to-br from-[#1b2430] to-[#0a0f15] p-3">
                        <img src="/cards/wa-front-back.png" alt="Card design preview" className="h-44 w-full rounded-2xl object-cover object-center opacity-95" />
                        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-slate-100 backdrop-blur-md">
                          {l === "bg"
                            ? "Live card preview с материали, цветове и персонализация"
                            : "Live card preview with materials, colors and personalization"}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-4 gap-3">
                        {["#f59e0b", "#f97316", "#0f172a", "#38bdf8"].map((tone) => (
                          <div key={tone} className="h-9 rounded-full border border-white/10" style={{ backgroundColor: tone }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                    <div className="text-xs uppercase tracking-[0.26em] text-amber-300/80">
                      {l === "bg" ? "Demo flow" : "Demo flow"}
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        l === "bg" ? "1. Картата отваря профила" : "1. The card opens the profile",
                        l === "bg" ? "2. Човекът scroll-ва и разглежда" : "2. The visitor scrolls and explores",
                        l === "bg" ? "3. Lead form-ът запазва контакта" : "3. The lead form stores the contact",
                        l === "bg" ? "4. После правиш своя дизайн" : "4. Then you build your own design",
                      ].map((step) => (
                        <div key={step} className="rounded-2xl border border-white/10 bg-[#0d121a] px-4 py-3 text-sm text-slate-200">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">{t.howTitle}</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.howTitle}</h2>
            <p className="mt-4 text-lg text-slate-300">{t.howSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.howSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-200">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{t.whyTitle}</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.whyTitle}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.whyCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 to-[#0d1220] p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">{t.cardTitle}</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.cardTitle}</h2>
              <p className="mt-4 text-lg text-slate-300">{t.cardSubtitle}</p>
              <ul className="mt-8 space-y-3 text-slate-200">
                {t.cardRules.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <span className="mt-1 text-amber-300">●</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  {t.genericTitle}
                </div>
                <p className="text-slate-300">{t.genericBody}</p>
              </div>
              <div className="rounded-[1.6rem] border border-amber-400/20 bg-amber-500/10 p-6">
                <div className="mb-4 inline-flex rounded-full border border-amber-400/25 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                  {t.personalizedTitle}
                </div>
                <p className="text-slate-100">{t.personalizedBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">{t.pricingTitle}</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.pricingTitle}</h2>
            <p className="mt-4 text-lg text-slate-300">{t.pricingSubtitle}</p>
          </div>

          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            {(["monthly", "quarterly", "annual"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  billingCycle === cycle ? "bg-white text-black" : "text-slate-300"
                }`}
              >
                {cycle === "monthly" ? t.cycleMonthly : cycle === "quarterly" ? t.cycleQuarterly : t.cycleAnnual}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-4">
            {planCards.map((plan) => (
              <div
                key={plan.key}
                className={`rounded-[1.8rem] border p-6 ${
                  plan.featured
                    ? "border-amber-300/40 bg-gradient-to-b from-amber-500/15 to-white/5 shadow-[0_20px_80px_rgba(251,146,60,0.18)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                  {plan.badge}
                </div>
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <p className="mt-3 min-h-[88px] text-slate-300">{plan.subtitle}</p>
                <div className="mt-6 text-4xl font-black tracking-tight">
                  {plan.key === "enterprise" ? plan.priceLines.monthly : plan.priceLines[billingCycle]}
                </div>
                <p className="mt-3 min-h-[48px] text-sm text-emerald-300">{plan.helper}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-200">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-1 text-amber-300">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {plan.ctaKind === "free" && (
                    <Link href="/login">
                      <SalesCtaButton variant={plan.featured ? "primary" : "secondary"}>{plan.cta}</SalesCtaButton>
                    </Link>
                  )}
                  {plan.ctaKind === "sales" && (
                    <SalesCtaButton onClick={handleSalesClick} variant="ghost">
                      {plan.cta}
                    </SalesCtaButton>
                  )}
                  {plan.ctaKind === "checkout-pro" && (
                    <SalesCtaButton onClick={() => handleCheckout("PRO")} variant="primary">
                      {loadingCta === "PRO" ? "..." : plan.cta}
                    </SalesCtaButton>
                  )}
                  {plan.ctaKind === "checkout-teams" && (
                    <SalesCtaButton onClick={() => handleCheckout("TEAMS")} variant="secondary">
                      {loadingCta === "TEAMS" ? "..." : plan.cta}
                    </SalesCtaButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">{t.pricingFootnote}</p>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{t.comparisonTitle}</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.comparisonTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">{t.comparisonSubtitle}</p>
          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-black/30 text-slate-200">
                <tr>
                  <th className="px-5 py-4">Scenario</th>
                  <th className="px-5 py-4">15 x Pro</th>
                  <th className="px-5 py-4">Teams</th>
                </tr>
              </thead>
              <tbody>
                {t.comparisonRows.map((row) => (
                  <tr key={row[0]} className="border-t border-white/10 text-slate-300">
                    <td className="px-5 py-4 font-semibold text-white">{row[0]}</td>
                    <td className="px-5 py-4">{row[1]}</td>
                    <td className="px-5 py-4 text-emerald-300">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-lg text-slate-200">{t.comparisonSummary}</p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">{t.faqTitle}</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.faqTitle}</h2>
          <div className="mt-10 space-y-4">
            {t.faqItems.map((item) => (
              <details key={item.q} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <summary className="cursor-pointer text-lg font-semibold">{item.q}</summary>
                <p className="mt-4 text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-400/20 bg-gradient-to-r from-amber-500/12 via-orange-500/10 to-cyan-500/10 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold sm:text-5xl">{t.finalTitle}</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-200">{t.finalSubtitle}</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <SalesCtaButton variant="primary">{t.startFree}</SalesCtaButton>
            </Link>
            <SalesCtaButton variant="secondary" onClick={handleSalesClick}>
              {t.talkSales}
            </SalesCtaButton>
          </div>
          <p className="mt-5 text-sm text-slate-300">{t.contactHint}</p>
        </div>
      </section>
    </div>
  );
}
