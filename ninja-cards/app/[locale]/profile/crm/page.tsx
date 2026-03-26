
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

type CRMStage = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'MEETING' | 'WON' | 'LOST';
type Lead = { id: string; name: string; email?: string | null; phone?: string | null; message?: string | null; source?: string | null; sourceDetail?: string | null; tapsBeforeLead?: number; createdAt: string };
type CRMNote = { id: string; body: string; createdAt: string };
type CRMTask = { id: string; title: string; completed: boolean };
type CRMDeal = { id: string; title: string; stage: CRMStage; value?: number | null; source?: string | null; sourceDetail?: string | null; taps: number; leadCapturedAt?: string | null; nextReminderAt?: string | null; lead?: Lead | null; notes: CRMNote[]; tasks: CRMTask[] };
type CRMReport = { taps: number; leads: number; meetings: number; deals: number; tapToLeadRate: number; meetingToDealRate: number };
type CRMData = { deals: CRMDeal[]; unassignedLeads: Lead[]; report: CRMReport | null };
type BoardCard =
    | { kind: 'deal'; id: string; stage: CRMStage; title: string; subtitle: string; meta: string; badge: string; highlight: string; deal: CRMDeal }
    | { kind: 'lead'; id: string; stage: 'NEW'; title: string; subtitle: string; meta: string; badge: string; highlight: string; lead: Lead };

const stages: CRMStage[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'WON', 'LOST'];
const labels: Record<CRMStage, string> = { NEW: 'Нови', CONTACTED: 'Свързах се', QUALIFIED: 'Потенциални', MEETING: 'Среща', WON: 'Спечелени', LOST: 'Изгубени' };
const descriptions: Record<CRMStage, string> = {
    NEW: 'Нови контакти.',
    CONTACTED: 'Първи контакт.',
    QUALIFIED: 'Реален интерес.',
    MEETING: 'Среща.',
    WON: 'Клиент.',
    LOST: 'Спрян lead.',
};
const styles: Record<CRMStage, { chip: string; dot: string; border: string }> = {
    NEW: { chip: 'border-sky-500/20 bg-sky-500/10 text-sky-300', dot: 'bg-sky-400', border: 'border-sky-500/15' },
    CONTACTED: { chip: 'border-amber-500/20 bg-amber-500/10 text-amber-300', dot: 'bg-amber-400', border: 'border-amber-500/15' },
    QUALIFIED: { chip: 'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300', dot: 'bg-fuchsia-400', border: 'border-fuchsia-500/15' },
    MEETING: { chip: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', dot: 'bg-emerald-400', border: 'border-emerald-500/15' },
    WON: { chip: 'border-green-500/20 bg-green-500/10 text-green-300', dot: 'bg-green-400', border: 'border-green-500/15' },
    LOST: { chip: 'border-rose-500/20 bg-rose-500/10 text-rose-300', dot: 'bg-rose-400', border: 'border-rose-500/15' },
};

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Няма дата';
const formatDateTime = (value?: string | null) => value ? new Date(value).toLocaleString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Няма дата';
const subtitle = (lead?: Lead | null, source?: string | null) => lead?.email || lead?.phone || source || 'Лийд от профила';
const meta = (lead?: Lead | null, deal?: CRMDeal | null) => `${deal?.source || lead?.source || 'profile'} • ${deal?.taps || lead?.tapsBeforeLead || 1} tap`;

export default function CRMPage() {
    const { user, loading } = useAuth();
    const [data, setData] = React.useState<CRMData>({ deals: [], unassignedLeads: [], report: null });
    const [selectedKind, setSelectedKind] = React.useState<'deal' | 'lead' | null>(null);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [noteBody, setNoteBody] = React.useState('');
    const [taskTitle, setTaskTitle] = React.useState('');
    const [dragging, setDragging] = React.useState<{ kind: 'deal' | 'lead'; id: string } | null>(null);
    const [mobileStage, setMobileStage] = React.useState<CRMStage>('NEW');

    const loadCRM = React.useCallback(async () => {
        if (!user?.id) return;
        const res = await fetch(`/api/crm/${user.id}`);
        if (!res.ok) throw new Error('Failed to load CRM');
        const json = await res.json();
        setData({ deals: json.deals ?? [], unassignedLeads: json.unassignedLeads ?? [], report: json.report ?? null });
    }, [user?.id]);

    React.useEffect(() => {
        if (!loading && user?.id) loadCRM().catch(console.error);
    }, [loading, user?.id, loadCRM]);

    const filteredDeals = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data.deals;
        return data.deals.filter((deal) => [deal.title, deal.lead?.name, deal.lead?.email, deal.lead?.phone, deal.source, deal.sourceDetail].filter(Boolean).join(' ').toLowerCase().includes(q));
    }, [data.deals, search]);

    const filteredLeads = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data.unassignedLeads;
        return data.unassignedLeads.filter((lead) => [lead.name, lead.email, lead.phone, lead.source, lead.sourceDetail].filter(Boolean).join(' ').toLowerCase().includes(q));
    }, [data.unassignedLeads, search]);

    const board = React.useMemo<Record<CRMStage, BoardCard[]>>(() => {
        const result: Record<CRMStage, BoardCard[]> = { NEW: [], CONTACTED: [], QUALIFIED: [], MEETING: [], WON: [], LOST: [] };
        filteredLeads.forEach((lead) => result.NEW.push({ kind: 'lead', id: lead.id, stage: 'NEW', title: lead.name, subtitle: subtitle(lead), meta: meta(lead), badge: 'lead', highlight: lead.message || 'Нов интерес от Ninja профил.', lead }));
        filteredDeals.forEach((deal) => result[deal.stage].push({ kind: 'deal', id: deal.id, stage: deal.stage, title: deal.title, subtitle: subtitle(deal.lead, deal.source), meta: meta(deal.lead, deal), badge: `${deal.tasks.filter((task) => !task.completed).length || 0} задачи`, highlight: deal.lead?.message || deal.sourceDetail || 'Работен pipeline запис.', deal }));
        return result;
    }, [filteredDeals, filteredLeads]);

    const selectedDeal = selectedKind === 'deal' ? data.deals.find((item) => item.id === selectedId) ?? null : null;
    const selectedLead = selectedKind === 'lead' ? data.unassignedLeads.find((item) => item.id === selectedId) ?? null : null;
    const activeTasks = React.useMemo(() => data.deals.flatMap((deal) => deal.tasks.filter((task) => !task.completed).map((task) => ({ ...task, dealTitle: deal.title }))).slice(0, 5), [data.deals]);
    const freshLeads = React.useMemo(() => data.unassignedLeads.slice(0, 4), [data.unassignedLeads]);

    async function createDealFromLead(leadId: string) {
        if (!user?.id) return;
        const lead = data.unassignedLeads.find((item) => item.id === leadId);
        setBusy(true);
        try {
            const res = await fetch(`/api/crm/${user.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId, title: lead?.name || 'New deal' }) });
            if (!res.ok) throw new Error('Failed to create deal');
            await loadCRM();
        } finally { setBusy(false); }
    }

    async function moveDeal(dealId: string, stage: CRMStage) {
        const res = await fetch(`/api/crm/deal/${dealId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) });
        if (!res.ok) throw new Error('Failed to update stage');
        await loadCRM();
    }

    async function handleDrop(targetStage: CRMStage) {
        if (!dragging) return;
        setBusy(true);
        try {
            if (dragging.kind === 'lead') {
                await createDealFromLead(dragging.id);
                if (targetStage !== 'NEW') {
                    const latest = await fetch(`/api/crm/${user?.id}`);
                    const refreshed = await latest.json();
                    const created = (refreshed.deals ?? []).find((deal: CRMDeal) => deal.lead?.id === dragging.id);
                    if (created) await moveDeal(created.id, targetStage);
                }
            } else {
                await moveDeal(dragging.id, targetStage);
            }
        } finally {
            setDragging(null);
            setBusy(false);
        }
    }

    async function addNote() {
        if (!selectedDeal || !noteBody.trim()) return;
        setBusy(true);
        try {
            const res = await fetch('/api/crm/note', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dealId: selectedDeal.id, body: noteBody }) });
            if (!res.ok) throw new Error('Failed to add note');
            setNoteBody('');
            await loadCRM();
        } finally { setBusy(false); }
    }

    async function addTask() {
        if (!selectedDeal || !taskTitle.trim()) return;
        setBusy(true);
        try {
            const res = await fetch('/api/crm/task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dealId: selectedDeal.id, title: taskTitle }) });
            if (!res.ok) throw new Error('Failed to add task');
            setTaskTitle('');
            await loadCRM();
        } finally { setBusy(false); }
    }

    async function toggleTask(taskId: string, completed: boolean) {
        const res = await fetch(`/api/crm/task/${taskId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed }) });
        if (!res.ok) throw new Error('Failed to update task');
        await loadCRM();
    }

    if (loading) return <div className="min-h-screen bg-[#07090d] pt-32 text-center text-gray-400">Зареждам CRM...</div>;

    return (
        <div className="min-h-screen overflow-hidden px-4 pb-24 pt-24 text-gray-200 sm:px-6 lg:px-8" style={{ background: 'radial-gradient(circle at top, rgba(245,158,11,0.10), transparent 22%), radial-gradient(circle at 20% 15%, rgba(59,130,246,0.09), transparent 22%), radial-gradient(circle at 85% 35%, rgba(16,185,129,0.07), transparent 20%), #07090d' }}>
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
            <div className="mx-auto max-w-[1860px] space-y-4 lg:space-y-5">
                <motion.section initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-5">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                    <div className="absolute -right-10 top-0 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
                    <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2">
                                <div className="h-2 w-2 rounded-full bg-amber-400" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">Premium CRM</span>
                            </div>
                            <div className="space-y-2">
                                <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl xl:text-[44px]">CRM за leads, задачи и етапи</h1>
                                <p className="max-w-3xl text-sm leading-6 text-gray-300 sm:text-[15px]">Всичко е на един екран. Избери карта, мести между етапите и работи по нея.</p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Нови</p><p className="mt-2 text-sm leading-6 text-white">{freshLeads.length} за контакт.</p></div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Задачи</p><p className="mt-2 text-sm leading-6 text-white">{activeTasks.length} активни.</p></div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Работа</p><p className="mt-2 text-sm leading-6 text-white">Drag, drop и готово.</p></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
                            {[
                                ['Tap-ове', data.report?.taps ?? 0],
                                ['Лийдове', data.report?.leads ?? 0],
                                ['Срещи', data.report?.meetings ?? 0],
                                ['Сделки', data.report?.deals ?? 0],
                                ['Tap -> Lead', `${data.report?.tapToLeadRate ?? 0}%`],
                                ['Meeting -> Deal', `${data.report?.meetingToDealRate ?? 0}%`],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{label}</p>
                                    <p className="mt-2 text-xl font-black text-white sm:text-2xl">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.30)] backdrop-blur">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-3">
                            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">{busy ? 'Обновявам...' : dragging ? 'Пусни картата' : 'Готово за работа'}</div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">Нови: {board.NEW.length}</div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">Потенциални: {board.QUALIFIED.length}</div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">Спечелени: {board.WON.length}</div>
                        </div>
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Търси..." className="w-full rounded-2xl border border-white/10 bg-[#0b0f15] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500/40 lg:max-w-[360px]" />
                    </div>
                </section>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
                    <section className="space-y-4">
                        <div className="hidden overflow-x-auto pb-2 lg:block">
                            <div className="flex min-w-max gap-4">
                            {stages.map((stage) => (
                                <div key={stage} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(stage)} className={`w-[280px] xl:w-[300px] shrink-0 rounded-[24px] border bg-white/[0.03] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl transition ${dragging ? 'border-amber-500/20' : styles[stage].border}`}>
                                    <div className="mb-4 space-y-3">
                                        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><div className={`h-2.5 w-2.5 rounded-full ${styles[stage].dot}`} /><p className="text-[15px] font-black text-white">{labels[stage]}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${styles[stage].chip}`}>{board[stage].length}</span></div>
                                        <p className="text-xs leading-6 text-gray-400">{descriptions[stage]}</p>
                                    </div>
                                    <div className="max-h-[68vh] space-y-3 overflow-y-auto pr-1">
                                        {board[stage].map((card, index) => (
                                            <motion.button key={`${card.kind}-${card.id}`} draggable onDragStart={() => setDragging({ kind: card.kind, id: card.id })} onDragEnd={() => setDragging(null)} onClick={() => { setSelectedKind(card.kind); setSelectedId(card.id); }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }} className={`group relative w-full overflow-hidden rounded-[22px] border text-left transition-all ${selectedId === card.id ? 'border-amber-500/35 bg-amber-500/10 shadow-[0_16px_34px_rgba(245,158,11,0.14)]' : 'border-white/10 bg-[#0c1016] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]'}`}>
                                                <div className={`absolute inset-x-0 top-0 h-1 ${card.kind === 'lead' ? 'bg-sky-400/80' : styles[stage].dot}`} />
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0"><p className="truncate text-sm font-bold text-white">{card.title}</p><p className="mt-1 truncate text-xs text-gray-400">{card.subtitle}</p></div>
                                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${card.kind === 'lead' ? 'bg-sky-500/10 text-sky-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{card.badge}</span>
                                                    </div>
                                                    <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-gray-300">{card.highlight}</p>
                                                    <div className="mt-3 flex items-center justify-between gap-3"><p className="text-[11px] font-medium text-amber-300">{card.meta}</p><span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">{card.kind === 'lead' ? 'Нов' : labels[stage]}</span></div>
                                                </div>
                                            </motion.button>
                                        ))}
                                        {board[stage].length === 0 && <div className="rounded-[24px] border border-dashed border-white/10 bg-black/15 px-4 py-12 text-center text-sm text-gray-500">Пусни карта тук</div>}
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        <div className="space-y-4 lg:hidden">
                            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                                {stages.map((stage) => (
                                    <button key={stage} onClick={() => setMobileStage(stage)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${mobileStage === stage ? styles[stage].chip : 'border-white/10 bg-white/[0.03] text-gray-300'}`}>
                                        {labels[stage]} ({board[stage].length})
                                    </button>
                                ))}
                            </div>
                            <div onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(mobileStage)} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className={`h-2.5 w-2.5 rounded-full ${styles[mobileStage].dot}`} /><p className="text-lg font-black text-white">{labels[mobileStage]}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${styles[mobileStage].chip}`}>{board[mobileStage].length}</span></div>
                                    <p className="text-sm leading-6 text-gray-400">{descriptions[mobileStage]}</p>
                                </div>
                                <div className="space-y-3">
                                    {board[mobileStage].map((card) => (
                                        <button key={`${card.kind}-${card.id}`} draggable onDragStart={() => setDragging({ kind: card.kind, id: card.id })} onDragEnd={() => setDragging(null)} onClick={() => { setSelectedKind(card.kind); setSelectedId(card.id); }} className={`relative w-full overflow-hidden rounded-[20px] border text-left transition ${selectedId === card.id ? 'border-amber-500/35 bg-amber-500/10' : 'border-white/10 bg-[#0c1016]'}`}>
                                            <div className={`absolute inset-x-0 top-0 h-1 ${card.kind === 'lead' ? 'bg-sky-400/80' : styles[mobileStage].dot}`} />
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-white">{card.title}</p><p className="mt-1 truncate text-xs text-gray-400">{card.subtitle}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${card.kind === 'lead' ? 'bg-sky-500/10 text-sky-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{card.badge}</span></div>
                                                <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-gray-300">{card.highlight}</p>
                                                <p className="mt-3 text-[11px] text-amber-300">{card.meta}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {board[mobileStage].length === 0 && <div className="rounded-[22px] border border-dashed border-white/10 px-4 py-10 text-center text-sm text-gray-500">Пусни карта тук</div>}
                                </div>
                            </div>
                        </div>
                    </section>
                    <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
                        <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5">
                            {!selectedDeal && !selectedLead && (
                                <div className="space-y-4">
                                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Детайли</div>
                                    <h2 className="text-2xl font-black text-white">Избери карта</h2>
                                    <p className="text-sm leading-7 text-gray-400">Избери lead или deal, за да видиш контакти, бележки и задачи.</p>
                                </div>
                            )}
                            {selectedLead && (
                                <div className="space-y-5">
                                    <div className="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Нов lead</div>
                                    <div><h2 className="text-3xl font-black tracking-tight text-white">{selectedLead.name}</h2><p className="mt-2 text-sm text-gray-400">{selectedLead.email || selectedLead.phone || 'Няма контактни данни'}</p></div>
                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Източник</p><p className="mt-2 text-sm text-white">{selectedLead.source || 'profile'}</p></div>
                                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Създаден</p><p className="mt-2 text-sm text-white">{formatDate(selectedLead.createdAt)}</p></div>
                                    </div>
                                    {selectedLead.message && <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Съобщение</p><p className="mt-3 text-sm leading-7 text-gray-300">{selectedLead.message}</p></div>}
                                    <button onClick={() => createDealFromLead(selectedLead.id)} disabled={busy} className="w-full rounded-2xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 px-5 py-3.5 text-sm font-black text-black shadow-[0_14px_30px_rgba(245,158,11,0.24)] disabled:opacity-50">Превърни в deal</button>
                                </div>
                            )}
                            {selectedDeal && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-3"><div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${styles[selectedDeal.stage].chip}`}>{labels[selectedDeal.stage]}</div><div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">{selectedDeal.source || 'profile'}</div></div>
                                    <div><h2 className="text-3xl font-black tracking-tight text-white">{selectedDeal.title}</h2><p className="mt-2 text-sm text-gray-400">{selectedDeal.lead?.name || 'Без lead'} • {selectedDeal.lead?.email || selectedDeal.lead?.phone || 'Няма контакт'}</p></div>
                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Създаден</p><p className="mt-2 text-sm text-white">{formatDateTime(selectedDeal.leadCapturedAt)}</p></div>
                                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Следващо напомняне</p><p className="mt-2 text-sm text-white">{formatDateTime(selectedDeal.nextReminderAt)}</p></div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-white">Бележки</p>
                                        <div className="flex flex-col gap-2">
                                            <textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} placeholder="Напиши какво си говорил с този човек..." className="min-h-[100px] rounded-2xl border border-white/10 bg-[#0b0f15] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500/40" />
                                            <button onClick={addNote} disabled={busy || !noteBody.trim()} className="rounded-2xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 px-4 py-3 text-sm font-black text-black disabled:opacity-50">Добави бележка</button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedDeal.notes.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-gray-500">Все още няма бележки.</p>}
                                            {selectedDeal.notes.map((note) => <div key={note.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><p className="text-sm leading-7 text-gray-200">{note.body}</p><p className="mt-2 text-[11px] text-gray-500">{formatDateTime(note.createdAt)}</p></div>)}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-white">Задачи</p>
                                        <div className="flex flex-col gap-2">
                                            <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Обади се утре, прати оферта, насрочи среща..." className="rounded-2xl border border-white/10 bg-[#0b0f15] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/40" />
                                            <button onClick={addTask} disabled={busy || !taskTitle.trim()} className="rounded-2xl bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 px-4 py-3 text-sm font-black text-black disabled:opacity-50">Добави задача</button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedDeal.tasks.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-gray-500">Все още няма задачи.</p>}
                                            {selectedDeal.tasks.map((task) => <label key={task.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4"><input type="checkbox" checked={task.completed} onChange={(event) => toggleTask(task.id, event.target.checked)} /><span className={`flex-1 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{task.title}</span></label>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5">
                            <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-black text-white">Бърз поглед</h3><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">live</span></div>
                            <div className="mt-4 space-y-3">
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">Нови лийдове</p>
                                    <div className="mt-3 space-y-2">
                                        {freshLeads.length === 0 && <p className="text-sm text-gray-500">Няма нови лийдове в момента.</p>}
                                        {freshLeads.map((lead) => <button key={lead.id} onClick={() => { setSelectedKind('lead'); setSelectedId(lead.id); }} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left transition hover:border-white/20"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{lead.name}</p><p className="truncate text-xs text-gray-400">{lead.email || lead.phone || 'Без контакт'}</p></div><span className="text-[11px] text-amber-300">{formatDate(lead.createdAt)}</span></button>)}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">Отворени задачи</p>
                                    <div className="mt-3 space-y-2">
                                        {activeTasks.length === 0 && <p className="text-sm text-gray-500">Няма отворени задачи.</p>}
                                        {activeTasks.map((task) => <div key={task.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"><p className="text-sm font-semibold text-white">{task.title}</p><p className="mt-1 text-xs text-gray-400">{task.dealTitle}</p></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
