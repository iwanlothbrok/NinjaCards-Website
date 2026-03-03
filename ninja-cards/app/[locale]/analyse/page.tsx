"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    TimeScale,
    LineElement,
    PointElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "chartjs-adapter-date-fns";
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subDays,
    subMonths,
    isWithinInterval,
    differenceInDays,
} from "date-fns";
import { useTranslations } from "next-intl";

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement,
    TimeScale, LineElement, PointElement
);

type FilterPeriod = "all" | "today" | "last7" | "last30" | "thisWeek" | "thisMonth" | "lastMonth" | "custom";
type GroupBy = "day" | "week" | "month";

interface EventEntry {
    date: string;
    visit: number;
    [key: string]: any;
}

function aggregateByPeriod(data: EventEntry[], groupBy: GroupBy) {
    const map = new Map<string, number>();
    for (const entry of data) {
        const d = new Date(entry.date);
        let key: string;
        if (groupBy === "day") key = format(d, "MMM dd");
        else if (groupBy === "week") key = `W${format(d, "ww · yyyy")}`;
        else key = format(d, "MMM yyyy");
        map.set(key, (map.get(key) ?? 0) + (entry.visit ?? 0));
    }
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

function computeMonthlyStats(data: EventEntry[]) {
    const map = new Map<string, number>();
    for (const entry of data) {
        const key = format(new Date(entry.date), "yyyy-MM");
        map.set(key, (map.get(key) ?? 0) + (entry.visit ?? 0));
    }
    return Array.from(map.entries())
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => a.month.localeCompare(b.month));
}

// ── Reusable Stat Card ─────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
    glow = "amber",
    delay = 0,
}: {
    label: string;
    value: React.ReactNode;
    sub?: string;
    glow?: "amber" | "emerald" | "red" | "blue" | "violet";
    delay?: number;
}) {
    const glowStyles: Record<string, { border: string; orb: string; dot: string }> = {
        amber: { border: "border-amber-500/20 hover:border-amber-400/45", orb: "bg-amber-500", dot: "bg-amber-400" },
        emerald: { border: "border-emerald-500/20 hover:border-emerald-400/45", orb: "bg-emerald-500", dot: "bg-emerald-400" },
        red: { border: "border-red-500/20 hover:border-red-400/45", orb: "bg-red-500", dot: "bg-red-400" },
        blue: { border: "border-blue-500/20 hover:border-blue-400/45", orb: "bg-blue-500", dot: "bg-blue-400" },
        violet: { border: "border-violet-500/20 hover:border-violet-400/45", orb: "bg-violet-500", dot: "bg-violet-400" },
    };
    const g = glowStyles[glow];
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className={`relative rounded-2xl border ${g.border} bg-gradient-to-br from-white/[0.045] to-white/[0.01] backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 shadow-xl group cursor-default`}
        >
            {/* Corner glow */}
            <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 ${g.orb}`} />
            {/* Bottom line accent */}
            <div className={`absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-current to-transparent ${glow === "amber" ? "text-amber-500" : glow === "emerald" ? "text-emerald-500" : glow === "red" ? "text-red-500" : glow === "blue" ? "text-blue-500" : "text-violet-500"
                }`} />

            <div className="flex items-center gap-2 mb-4">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${g.dot}`} />
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500 truncate">{label}</p>
            </div>
            <p className="text-[2rem] font-bold text-white leading-none tracking-tight tabular-nums">{value}</p>
            {sub && <p className="mt-2.5 text-sm text-gray-500">{sub}</p>}
        </motion.div>
    );
}

// ── Section Heading ────────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <div className="flex items-center gap-5 mb-6">
            <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-amber-500/70 mb-1">{eyebrow}</p>
                <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/15 to-transparent" />
        </div>
    );
}

// ── Chart Panel ────────────────────────────────────────────────────────────────
function ChartPanel({ label, children }: { label?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/[0.055] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl p-7 transition-all duration-300 hover:border-amber-500/18">
            {label && (
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500 mb-6">{label}</p>
            )}
            {children}
        </div>
    );
}

const commonScales = {
    x: {
        ticks: { color: "#4B5563", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.025)", drawBorder: false },
        border: { color: "transparent" },
    },
    y: {
        ticks: { color: "#4B5563", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.025)", drawBorder: false },
        border: { color: "transparent" },
    },
};

const tooltipDefaults = {
    backgroundColor: "#0E1117",
    borderColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    padding: 12,
    titleColor: "#F9FAFB",
    bodyColor: "#9CA3AF",
    cornerRadius: 10,
};

export default function DashboardPage() {
    const { user } = useAuth();
    const t = useTranslations("dashboard");

    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
    const [groupBy, setGroupBy] = useState<GroupBy>("day");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const [dashboardData, setDashboardData] = useState({
        profileVisits: 0, vcfDownloads: 0, profileShares: 0, socialLinkClicks: 0,
    });
    const [monthlyData, setMonthlyData] = useState<EventEntry[]>([]);

    useEffect(() => { if (user?.id) setId(user.id); }, [user]);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const [sRes, eRes] = await Promise.all([
                    fetch(`${BASE_API_URL}/api/dashboard/${id}`),
                    fetch(`${BASE_API_URL}/api/dashboard/events/${id}`),
                ]);
                if (!sRes.ok || !eRes.ok) throw new Error();
                setDashboardData(await sRes.json());
                setMonthlyData(await eRes.json());
            } finally { setLoading(false); }
        })();
    }, [id]);

    const filteredData = useMemo(() => {
        const now = new Date();
        let from: Date | null = null, to: Date | null = null;
        switch (filterPeriod) {
            case "today": { const d = new Date(); d.setHours(0, 0, 0, 0); from = d; to = new Date(); break; }
            case "last7": from = subDays(now, 6); to = now; break;
            case "last30": from = subDays(now, 29); to = now; break;
            case "thisWeek": from = startOfWeek(now, { weekStartsOn: 1 }); to = endOfWeek(now, { weekStartsOn: 1 }); break;
            case "thisMonth": from = startOfMonth(now); to = endOfMonth(now); break;
            case "lastMonth": { const lm = subMonths(now, 1); from = startOfMonth(lm); to = endOfMonth(lm); break; }
            case "custom":
                if (customFrom) from = new Date(customFrom);
                if (customTo) { to = new Date(customTo); to.setHours(23, 59, 59, 999); }
                break;
            default: return monthlyData;
        }
        if (!from && !to) return monthlyData;
        return monthlyData.filter(e => {
            const d = new Date(e.date);
            if (from && to) return isWithinInterval(d, { start: from, end: to });
            if (from) return d >= from;
            if (to) return d <= to;
            return true;
        });
    }, [filterPeriod, monthlyData, customFrom, customTo]);

    const chartPoints = useMemo(() => aggregateByPeriod(filteredData, groupBy), [filteredData, groupBy]);
    const monthlyStats = useMemo(() => computeMonthlyStats(monthlyData), [monthlyData]);

    const bestMonth = useMemo(() => {
        if (!monthlyStats.length) return null;
        return monthlyStats.reduce((b, c) => c.total > b.total ? c : b);
    }, [monthlyStats]);

    const monthlyGrowth = useMemo(() => {
        if (monthlyStats.length < 2) return null;
        const last = monthlyStats[monthlyStats.length - 1];
        const prev = monthlyStats[monthlyStats.length - 2];
        if (!prev.total) return null;
        const pct = ((last.total - prev.total) / prev.total) * 100;
        return { pct: pct.toFixed(1), positive: pct >= 0, month: last.month, prevMonth: prev.month };
    }, [monthlyStats]);

    const avgVisits = useMemo(() => {
        if (!filteredData.length) return "—";
        const total = filteredData.reduce((s, e) => s + (e.visit ?? 0), 0);
        const days = Math.max(1, differenceInDays(
            new Date(filteredData[filteredData.length - 1].date),
            new Date(filteredData[0].date)
        ) + 1);
        return (total / days).toFixed(1);
    }, [filteredData]);

    const peakDay = useMemo(() => {
        if (!filteredData.length) return null;
        const peak = filteredData.reduce((b, c) => (c.visit ?? 0) > (b.visit ?? 0) ? c : b);
        return { date: format(new Date(peak.date), "MMM dd, yyyy"), visits: peak.visit };
    }, [filteredData]);

    const trend = useMemo(() => {
        if (filteredData.length < 4) return null;
        const mid = Math.floor(filteredData.length / 2);
        const first = filteredData.slice(0, mid).reduce((s, e) => s + (e.visit ?? 0), 0);
        const second = filteredData.slice(mid).reduce((s, e) => s + (e.visit ?? 0), 0);
        if (!first) return null;
        const pct = ((second - first) / first) * 100;
        return { pct: pct.toFixed(1), positive: pct >= 0 };
    }, [filteredData]);

    const PERIODS: { value: FilterPeriod; label: string }[] = [
        { value: "all", label: t("filters.all") },
        { value: "today", label: t("filters.today") },
        { value: "last7", label: t("filters.last7") },
        { value: "last30", label: t("filters.last30") },
        { value: "thisWeek", label: t("filters.thisWeek") },
        { value: "thisMonth", label: t("filters.thisMonth") },
        { value: "lastMonth", label: t("filters.lastMonth") },
        { value: "custom", label: t("filters.custom") },
    ];

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080A0F] gap-5">
                <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border border-amber-500/15" />
                    <div className="absolute inset-0 rounded-full border border-transparent border-t-amber-500 animate-spin" />
                </div>
                <p className="text-[10.5px] uppercase tracking-[0.2em] text-gray-600 font-semibold">Loading analytics</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="min-h-screen pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8 text-gray-100"
            style={{
                background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(245,158,11,0.07) 0%, transparent 55%), #080A0F",
            }}
        >
            {/* Grid texture overlay */}
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    opacity: 0.018,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                }}
            />
            {/* Ambient light blobs */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
            <div className="fixed bottom-10 right-0 w-[400px] h-[300px] bg-orange/4 rounded-full blur-[80px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto space-y-20">

                {/* ── Page Header ─────────────────────────────────────────── */}
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"
                >
                    <div className="space-y-1">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-500/65">
                            {t("subtitle")}
                        </p>
                        <h1 className="text-4xl md:text-[2.8rem] font-bold text-white tracking-tight leading-none">
                            {t("title")}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2.5 self-start sm:self-auto px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-[11px] text-gray-500 font-semibold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)] animate-pulse" />
                        Live
                    </div>
                </motion.header>

                {/* ── Primary KPIs ────────────────────────────────────────── */}
                <section>
                    <SectionHeading eyebrow="Overview" title={t("title")} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(["profileVisits", "vcfDownloads", "profileShares", "socialLinkClicks"] as const).map((key, i) => (
                            <StatCard
                                key={key}
                                label={t(`metrics.${key}`)}
                                value={(dashboardData[key] ?? 0).toLocaleString()}
                                delay={0.12 + i * 0.08}
                                glow={["amber", "blue", "emerald", "violet"][i] as any}
                            />
                        ))}
                    </div>
                </section>

                {/* ── Insight KPIs ─────────────────────────────────────────── */}
                <section>
                    <SectionHeading eyebrow="Analysis" title={t("insights.title") || "Performance Insights"} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {bestMonth && (
                            <StatCard
                                label={t("insights.bestMonth")}
                                value={format(new Date(bestMonth.month + "-01"), "MMM yyyy")}
                                sub={`${bestMonth.total.toLocaleString()} ${t("metrics.profileVisits").toLowerCase()}`}
                                glow="amber"
                                delay={0.15}
                            />
                        )}
                        {monthlyGrowth && (
                            <StatCard
                                label={t("insights.monthlyGrowth")}
                                value={
                                    <span className={monthlyGrowth.positive ? "text-emerald-400" : "text-red-400"}>
                                        {monthlyGrowth.positive ? "+" : ""}{monthlyGrowth.pct}%
                                    </span>
                                }
                                sub={`${format(new Date(monthlyGrowth.prevMonth + "-01"), "MMM")} → ${format(new Date(monthlyGrowth.month + "-01"), "MMM yyyy")}`}
                                glow={monthlyGrowth.positive ? "emerald" : "red"}
                                delay={0.22}
                            />
                        )}
                        <StatCard
                            label={t("insights.avgDaily")}
                            value={avgVisits}
                            sub={t("insights.visitsPerDay")}
                            glow="amber"
                            delay={0.29}
                        />
                        {peakDay && (
                            <StatCard
                                label={t("insights.peakDay")}
                                value={peakDay.visits.toLocaleString()}
                                sub={peakDay.date}
                                glow="amber"
                                delay={0.36}
                            />
                        )}
                    </div>
                </section>

                {/* ── Distribution ────────────────────────────────────────── */}
                <section>
                    <SectionHeading eyebrow="Distribution" title={t("overview")} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <ChartPanel label={t("overview")}>
                            <div className="flex justify-center items-center">
                                <div style={{ width: 260, height: 260 }}>
                                    <Doughnut
                                        data={{
                                            labels: Object.keys(dashboardData).map(k => t(`metrics.${k}`)),
                                            datasets: [{
                                                data: Object.values(dashboardData),
                                                backgroundColor: ["#1D4ED8", "#059669", "#F59E0B", "#7C3AED"],
                                                borderColor: "#080A0F",
                                                borderWidth: 3,
                                                hoverOffset: 8,
                                            }],
                                        }}
                                        options={{
                                            responsive: true,
                                            cutout: "74%",
                                            plugins: {
                                                legend: {
                                                    position: "bottom",
                                                    labels: { color: "#6B7280", font: { size: 11 }, padding: 18, usePointStyle: true, pointStyleWidth: 7 },
                                                },
                                                tooltip: { ...tooltipDefaults, displayColors: true },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </ChartPanel>

                        <ChartPanel label={t("breakdown")}>
                            <div className="h-[260px]">
                                <Bar
                                    data={{
                                        labels: Object.keys(dashboardData).map(k => t(`metrics.${k}`)),
                                        datasets: [{
                                            data: Object.values(dashboardData),
                                            backgroundColor: [
                                                "rgba(29,78,216,0.75)",
                                                "rgba(5,150,105,0.75)",
                                                "rgba(245,158,11,0.9)",
                                                "rgba(124,58,237,0.75)",
                                            ],
                                            borderRadius: 8,
                                            borderSkipped: false,
                                            borderWidth: 0,
                                        }],
                                    }}
                                    options={{
                                        responsive: true, maintainAspectRatio: false,
                                        plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults, displayColors: false } },
                                        scales: commonScales,
                                    }}
                                />
                            </div>
                        </ChartPanel>
                    </div>
                </section>

                {/* ── Timeline ─────────────────────────────────────────────── */}
                <section>
                    <SectionHeading eyebrow="Timeline" title={t("monthlyActivity")} />

                    {/* Controls panel */}
                    <div className="rounded-2xl border border-white/[0.055] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl p-6 mb-5 space-y-6">

                        {/* Period pills */}
                        <div className="space-y-3">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gray-500">{t("filters.label")}</p>
                            <div className="flex flex-wrap gap-2">
                                {PERIODS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => setFilterPeriod(value)}
                                        className={`px-4 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-wide transition-all duration-200 border
                                            ${filterPeriod === value
                                                ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20"
                                                : "border-white/[0.07] text-gray-400 hover:text-white hover:border-white/15 bg-white/[0.025]"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom date inputs */}
                        <AnimatePresence>
                            {filterPeriod === "custom" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    {[["from", customFrom, setCustomFrom], ["to", customTo, setCustomTo]].map(([key, val, setter]) => (
                                        <div key={key as string} className="flex flex-col gap-1.5">
                                            <label className="text-[10px] uppercase tracking-[0.14em] text-gray-500 font-semibold">{t(`filters.${key}`)}</label>
                                            <input
                                                type="date"
                                                value={val as string}
                                                onChange={e => (setter as any)(e.target.value)}
                                                className="bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Divider */}
                        <div className="h-px bg-white/[0.05]" />

                        {/* Group by + trend in one row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gray-500">{t("filters.groupBy")}</p>
                                <div className="flex p-1 gap-1 rounded-xl bg-black/30 border border-white/[0.055] w-fit">
                                    {(["day", "week", "month"] as const).map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setGroupBy(g)}
                                            className={`px-5 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-wide transition-all duration-200
                                                ${groupBy === g
                                                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/15"
                                                    : "text-gray-500 hover:text-gray-300"
                                                }`}
                                        >
                                            {t(`filters.${g}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {trend && (
                                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-semibold ${trend.positive
                                    ? "bg-emerald-500/[0.07] border-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/[0.07] border-red-500/20 text-red-400"
                                    }`}>
                                    <span className="text-lg leading-none">{trend.positive ? "↑" : "↓"}</span>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] uppercase tracking-[0.1em] opacity-60 font-semibold leading-none">{t("insights.periodTrend")}</p>
                                        <p>{trend.positive ? "+" : ""}{trend.pct}% {t("insights.vsFirstHalf")}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Line chart */}
                    <ChartPanel>
                        <div className="flex items-center justify-between mb-7">
                            <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-gray-500">{t("metrics.profileVisits")}</p>
                            <span className="text-[11px] text-gray-600 font-medium tabular-nums">
                                {filteredData.length} {t("insights.dataPoints")}
                            </span>
                        </div>
                        <div className="h-[360px]">
                            <Line
                                data={{
                                    labels: chartPoints.map(p => p.label),
                                    datasets: [{
                                        label: t("metrics.profileVisits"),
                                        data: chartPoints.map(p => p.value),
                                        borderColor: "#F59E0B",
                                        backgroundColor: (ctx: any) => {
                                            const chart = ctx.chart;
                                            const { ctx: c, chartArea } = chart;
                                            if (!chartArea) return "transparent";
                                            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                            gradient.addColorStop(0, "rgba(245,158,11,0.2)");
                                            gradient.addColorStop(0.7, "rgba(245,158,11,0.04)");
                                            gradient.addColorStop(1, "rgba(245,158,11,0)");
                                            return gradient;
                                        },
                                        borderWidth: 2,
                                        fill: true,
                                        tension: 0.42,
                                        pointRadius: 4,
                                        pointHoverRadius: 7,
                                        pointBackgroundColor: "#F59E0B",
                                        pointBorderColor: "#080A0F",
                                        pointBorderWidth: 2,
                                        pointHoverBackgroundColor: "#FBBF24",
                                        pointHoverBorderColor: "#080A0F",
                                        pointHoverBorderWidth: 2.5,
                                    }],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            ...tooltipDefaults,
                                            displayColors: false,
                                            callbacks: {
                                                title: i => i[0].label,
                                                label: i => `${Number(i.raw).toLocaleString()} visits`,
                                            },
                                        },
                                    },
                                    scales: commonScales,
                                    interaction: { mode: "index", intersect: false },
                                }}
                            />
                        </div>
                    </ChartPanel>
                </section>

                {/* ── All-time Monthly Breakdown ───────────────────────────── */}
                {monthlyStats.length > 1 && (
                    <section>
                        <SectionHeading eyebrow="Monthly Overview" title={t("insights.allMonthsBreakdown")} />
                        <ChartPanel>
                            <div className="h-[260px]">
                                <Bar
                                    data={{
                                        labels: monthlyStats.map(m => format(new Date(m.month + "-01"), "MMM yy")),
                                        datasets: [{
                                            label: t("metrics.profileVisits"),
                                            data: monthlyStats.map(m => m.total),
                                            backgroundColor: monthlyStats.map(m =>
                                                m.month === bestMonth?.month
                                                    ? "#F59E0B"
                                                    : "rgba(245,158,11,0.2)"
                                            ),
                                            hoverBackgroundColor: monthlyStats.map(m =>
                                                m.month === bestMonth?.month
                                                    ? "#FBBF24"
                                                    : "rgba(245,158,11,0.42)"
                                            ),
                                            borderRadius: 7,
                                            borderSkipped: false,
                                            borderWidth: 0,
                                        }],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                ...tooltipDefaults,
                                                displayColors: false,
                                                callbacks: {
                                                    afterLabel: ctx => {
                                                        if (ctx.dataIndex > 0) {
                                                            const prev = monthlyStats[ctx.dataIndex - 1].total;
                                                            const cur = monthlyStats[ctx.dataIndex].total;
                                                            if (!prev) return "";
                                                            const pct = (((cur - prev) / prev) * 100).toFixed(1);
                                                            return `${Number(pct) >= 0 ? "+" : ""}${pct}% vs prev month`;
                                                        }
                                                        return "";
                                                    },
                                                },
                                            },
                                        },
                                        scales: commonScales,
                                    }}
                                />
                            </div>
                            <p className="text-center text-[11px] text-gray-600 mt-5 tracking-wide font-medium">
                                {t("insights.bestMonthHighlighted")}
                            </p>
                        </ChartPanel>
                    </section>
                )}

            </div>
        </motion.div>
    );
}