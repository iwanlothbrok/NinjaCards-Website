'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { useLocale } from 'next-intl';

import { useAuth } from '@/app/[locale]/context/AuthContext';
import { BASE_API_URL } from '@/utils/constants';

type PanelMode = 'compact' | 'full';

type StatusResponse = {
  canonicalPlan: 'FREE' | 'PRO' | 'TEAMS' | 'ENTERPRISE';
  billingCycle: 'monthly' | 'quarterly' | 'annual' | null;
  entitlements: {
    canonicalPlan: string;
    storedLeadLimit: number | null;
    canExportLeads: boolean;
    canUseAiTools: boolean;
    canRemoveBranding: boolean;
    hasAdvancedAnalytics: boolean;
    hasTeamFeatures: boolean;
  };
  leadUsage: {
    currentMonthLeadCount: number;
    storedLeadLimit: number | null;
    canStoreAnotherLead: boolean;
  };
  genericCard: {
    score: number;
    completionPct: number;
    qualifiesByScore: boolean;
    hasVerifiedEmail: boolean;
    eligible: boolean;
    state: 'ineligible' | 'eligible' | 'shipping_unpaid' | 'requested' | 'fulfilled';
    blockers: string[];
    requestedAt: string | null;
  };
  personalizedCard: {
    availableOnPaidPlans: boolean;
    checkoutReady: boolean;
    requestState: 'idle' | 'requested';
    requestedAt: string | null;
  };
};

const COPY = {
  en: {
    eyebrow: 'Plan and card status',
    title: 'Keep your profile ready for upgrade and card activation',
    leadUsage: 'Lead usage this month',
    genericCard: 'Generic card unlock',
    personalizedCard: 'Personalized card',
    startFree: 'Start with Pro',
    upgrade: 'Upgrade to Pro',
    talkSales: 'Talk to sales',
    requestGeneric: 'Request generic card',
    requestPersonalized: 'Request personalized card',
    requested: 'Request submitted',
    loading: 'Loading plan status...',
    loadError: 'Could not load your plan status right now.',
    freeLeadHint: 'Free stores 1 lead per month.',
    proLeadHint: 'Pro stores up to 10 leads per month.',
    teamsLeadHint: 'Teams uses team-level lead management.',
    genericReady: 'Your generic card can be requested now.',
    genericRequested: 'Your generic card request is already in progress.',
    genericBlocked: 'Finish the missing steps to unlock your generic card.',
    personalizedHintFree: 'Personalized cards unlock on paid plans.',
    personalizedHintPaid: 'Paid plans can request a personalized card through support.',
    personalizedHintMonthly: 'Monthly Pro can buy a personalized card instantly for €20.',
    shippingNote: 'Shipping is confirmed after request in this first release.',
    requestSuccess: 'Request sent successfully.',
    requestError: 'Could not submit the request.',
    checkoutError: 'Could not start the card checkout.',
    confirmGeneric: 'Submit a generic card request? Our team will confirm shipping before fulfillment.',
    confirmPersonalized: 'Submit a personalized card request? We will confirm pricing and next steps by email.',
    viewPlans: 'View plans',
  },
  bg: {
    eyebrow: 'План и карта',
    title: 'Дръж профила си готов за ъпгрейд и отключване на карта',
    leadUsage: 'Лийдове този месец',
    genericCard: 'Отключване на generic карта',
    personalizedCard: 'Персонализирана карта',
    startFree: 'Минете на Pro',
    upgrade: 'Ъпгрейд към Pro',
    talkSales: 'Говори с екипа',
    requestGeneric: 'Заяви generic карта',
    requestPersonalized: 'Заяви персонализирана карта',
    requested: 'Заявката е изпратена',
    loading: 'Зареждам статуса на плана...',
    loadError: 'Не успяхме да заредим статуса на плана.',
    freeLeadHint: 'Free записва 1 лийд на месец.',
    proLeadHint: 'Pro записва до 10 лийда на месец.',
    teamsLeadHint: 'Teams използва фирмено управление на лийдове.',
    genericReady: 'Generic картата ти вече може да бъде заявена.',
    genericRequested: 'Заявката за generic карта вече е в процес.',
    genericBlocked: 'Завърши липсващите стъпки, за да отключиш картата.',
    personalizedHintFree: 'Персонализираните карти се отключват на платен план.',
    personalizedHintPaid: 'Платените планове могат да заявят персонализирана карта през екипа.',
    personalizedHintMonthly: 'Monthly Pro може да купи персонализирана карта веднага за €20.',
    shippingNote: 'В тази първа версия shipping-ът се потвърждава след заявка.',
    requestSuccess: 'Заявката е изпратена успешно.',
    requestError: 'Не успяхме да изпратим заявката.',
    checkoutError: 'Не успяхме да стартираме checkout-а за картата.',
    confirmGeneric: 'Да изпратим ли заявка за generic карта? Екипът ще потвърди shipping-а преди изпълнение.',
    confirmPersonalized: 'Да изпратим ли заявка за персонализирана карта? Ще потвърдим цената и следващите стъпки по имейл.',
    viewPlans: 'Виж плановете',
  },
} as const;

function formatRequestedAt(value: string | null, locale: 'bg' | 'en') {
  if (!value) return null;
  return new Date(value).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MonetizationStatusPanel({ mode = 'full' }: { mode?: PanelMode }) {
  const { user } = useAuth();
  const locale = (useLocale() === 'bg' ? 'bg' : 'en') as 'bg' | 'en';
  const copy = COPY[locale];

  const [status, setStatus] = React.useState<StatusResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [requestLoading, setRequestLoading] = React.useState<'generic' | 'personalized' | null>(null);

  const fetchStatus = React.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BASE_API_URL}/api/profile/card-qualification?userId=${user.id}`);
      if (!res.ok) throw new Error(copy.loadError);
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      setError(err?.message || copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError, user?.id]);

  React.useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  const submitRequest = async (type: 'generic' | 'personalized') => {
    if (!user?.id) return;

    const confirmed = window.confirm(type === 'generic' ? copy.confirmGeneric : copy.confirmPersonalized);
    if (!confirmed) return;

    setRequestLoading(type);
    try {
      const res = await fetch(`${BASE_API_URL}/api/profile/card-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || copy.requestError);
      }

      window.alert(copy.requestSuccess);
      await fetchStatus();
    } catch (err: any) {
      window.alert(err?.message || copy.requestError);
    } finally {
      setRequestLoading(null);
    }
  };

  const startPersonalizedCheckout = async () => {
    if (!user?.id || !user.email) return;
    setRequestLoading('personalized');

    try {
      const res = await fetch(`${BASE_API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          checkoutMode: 'payment',
          metadata: {
            purchaseType: 'personalized_card',
          },
          items: [{ type: 'addon', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONALIZED_CARD, quantity: 1 }],
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || copy.checkoutError);
      }

      window.location.href = data.url;
    } catch (err: any) {
      window.alert(err?.message || copy.checkoutError);
      setRequestLoading(null);
    }
  };

  if (!user?.id) return null;

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm text-gray-400">
        {copy.loading}
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300">
        {error || copy.loadError}
      </div>
    );
  }

  const leadLimitLabel =
    status.leadUsage.storedLeadLimit === null
      ? 'Unlimited'
      : `${status.leadUsage.currentMonthLeadCount}/${status.leadUsage.storedLeadLimit}`;

  const genericRequestedAt = formatRequestedAt(status.genericCard.requestedAt, locale);
  const personalizedRequestedAt = formatRequestedAt(status.personalizedCard.requestedAt, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-amber-400/18 bg-[linear-gradient(135deg,rgba(245,158,11,0.1),rgba(255,255,255,0.03))] p-5 shadow-[0_10px_35px_rgba(245,158,11,0.08)]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/70">{copy.eyebrow}</p>
      {mode === 'full' && <h2 className="mt-2 text-xl font-black tracking-tight text-white">{copy.title}</h2>}

      <div className={`mt-4 grid gap-4 ${mode === 'compact' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{copy.leadUsage}</p>
          <p className="mt-2 text-2xl font-black text-white">{leadLimitLabel}</p>
          <p className="mt-2 text-sm text-gray-400">
            {status.canonicalPlan === 'FREE'
              ? copy.freeLeadHint
              : status.canonicalPlan === 'PRO'
                ? copy.proLeadHint
                : copy.teamsLeadHint}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{copy.genericCard}</p>
          <p className="mt-2 text-2xl font-black text-white">{status.genericCard.score}/100</p>
          <p className="mt-2 text-sm text-gray-400">
            {status.genericCard.state === 'requested'
              ? copy.genericRequested
              : status.genericCard.qualifiesByScore && status.genericCard.hasVerifiedEmail
                ? copy.genericReady
                : copy.genericBlocked}
          </p>
          {status.genericCard.blockers.length > 0 && status.genericCard.state !== 'requested' && (
            <ul className="mt-3 space-y-1 text-xs text-amber-200/80">
              {status.genericCard.blockers.map((blocker) => (
                <li key={blocker}>• {blocker}</li>
              ))}
            </ul>
          )}
          {genericRequestedAt && (
            <p className="mt-3 text-xs text-emerald-300/80">{copy.requested}: {genericRequestedAt}</p>
          )}
          <p className="mt-3 text-xs text-gray-500">{copy.shippingNote}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{copy.personalizedCard}</p>
          <p className="mt-2 text-2xl font-black text-white">{status.canonicalPlan}</p>
          <p className="mt-2 text-sm text-gray-400">
            {status.personalizedCard.checkoutReady
              ? copy.personalizedHintMonthly
              : status.personalizedCard.availableOnPaidPlans
                ? copy.personalizedHintPaid
                : copy.personalizedHintFree}
          </p>
          {personalizedRequestedAt && (
            <p className="mt-3 text-xs text-emerald-300/80">{copy.requested}: {personalizedRequestedAt}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {status.canonicalPlan === 'FREE' && (
          <button
            onClick={() => { window.location.href = '/lp-1'; }}
            className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            {copy.upgrade}
          </button>
        )}

        {status.genericCard.state !== 'requested' && status.genericCard.qualifiesByScore && status.genericCard.hasVerifiedEmail && (
          <button
            onClick={() => void submitRequest('generic')}
            disabled={requestLoading !== null}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/18 disabled:opacity-50"
          >
            {requestLoading === 'generic' ? '...' : copy.requestGeneric}
          </button>
        )}

        {status.personalizedCard.requestState !== 'requested' && status.personalizedCard.checkoutReady && (
          <button
            onClick={() => void startPersonalizedCheckout()}
            disabled={requestLoading !== null || !process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONALIZED_CARD}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/18 disabled:opacity-50"
          >
            {requestLoading === 'personalized' ? '...' : copy.requestPersonalized}
          </button>
        )}

        {status.personalizedCard.requestState !== 'requested' && !status.personalizedCard.checkoutReady && status.personalizedCard.availableOnPaidPlans && (
          <button
            onClick={() => void submitRequest('personalized')}
            disabled={requestLoading !== null}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/18 disabled:opacity-50"
          >
            {requestLoading === 'personalized' ? '...' : copy.requestPersonalized}
          </button>
        )}

        <button
          onClick={() => { window.location.href = '/contact?intent=enterprise-bulk'; }}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          {copy.talkSales}
        </button>
      </div>
    </motion.div>
  );
}
