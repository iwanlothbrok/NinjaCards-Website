"use client";

import React, { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    TimeScale,
    LineElement,
    PointElement
);

export default function DashboardPage() {
    const { user } = useAuth();
    const t = useTranslations("dashboard");

    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("");

    const [dashboardData, setDashboardData] = useState({
        profileVisits: 0,
        vcfDownloads: 0,
        profileShares: 0,
        socialLinkClicks: 0,
    });

    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        if (user?.id) setId(user.id);
    }, [user]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [summaryRes, eventsRes] = await Promise.all([
                    fetch(`${BASE_API_URL}/api/dashboard/${id}`),
                    fetch(`${BASE_API_URL}/api/dashboard/events/${id}`),
                ]);

                if (!summaryRes.ok || !eventsRes.ok) throw new Error();

                const summary = await summaryRes.json();
                const events = await eventsRes.json();

                setDashboardData(summary);
                setMonthlyData(events);
                setFilteredData(events);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = e.target.value;
        setSelectedMonth(month);

        if (!month) {
            setFilteredData(monthlyData);
        } else {
            setFilteredData(
                monthlyData.filter(
                    (e: any) => format(new Date(e.date), "yyyy-MM") === month
                )
            );
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <img src="/load.gif" className="w-24 h-24 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-gray-100"
        >
            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center space-y-3"
                >
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 text-lg font-light tracking-wide">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {Object.entries(dashboardData).map(([key, value], idx) => (
                        <motion.div
                            key={key}
                            whileHover={{ translateY: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="group relative rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/50 border border-amber-500/20 hover:border-amber-400/40 p-6 backdrop-blur-xl overflow-hidden transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <p className="text-4xl font-bold text-white">{value}</p>
                                <p className="text-gray-400 mt-2 text-sm font-medium">
                                    {t(`metrics.${key}`)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Grid */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="group rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-amber-500/20 hover:border-amber-400/40 p-8 backdrop-blur-xl transition-all duration-300">
                        <h3 className="text-lg font-semibold text-white mb-6 text-center">
                            {t("overview")}
                        </h3>
                        <Doughnut
                            data={{
                                labels: Object.keys(dashboardData).map((k) =>
                                    t(`metrics.${k}`)
                                ),
                                datasets: [
                                    {
                                        data: Object.values(dashboardData),
                                        backgroundColor: ["#1E40AF", "#059669", "#F59E0B", "#8B5CF6"],
                                        borderColor: "#0F172A",
                                        borderWidth: 2,
                                    },
                                ],
                            }}
                            options={{ responsive: true }}
                        />
                    </div>

                    <div className="group rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-amber-500/20 hover:border-amber-400/40 p-8 backdrop-blur-xl transition-all duration-300">
                        <h3 className="text-lg font-semibold text-white mb-6 text-center">
                            {t("breakdown")}
                        </h3>
                        <Bar
                            data={{
                                labels: Object.keys(dashboardData).map((k) =>
                                    t(`metrics.${k}`)
                                ),
                                datasets: [
                                    {
                                        data: Object.values(dashboardData),
                                        backgroundColor: "#F59E0B",
                                        borderRadius: 12,
                                        borderSkipped: false,
                                    },
                                ],
                            }}
                            options={{ responsive: true, plugins: { legend: { display: false } } }}
                        />
                    </div>
                </motion.div>

                {/* Filter Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-amber-500/20 p-8 backdrop-blur-xl"
                >
                    <label className="block text-sm font-medium text-amber-300 mb-3">
                        {t("filter")}
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-full bg-gray-900/80 border border-amber-500/30 hover:border-amber-400/50 rounded-xl px-4 py-3 text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300"
                    >
                        <option value="">{t("allMonths")}</option>
                        {Array.from(
                            new Set(monthlyData.map((e: any) => format(new Date(e.date), "yyyy-MM")))
                        ).map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </motion.div>

                {/* Line Chart */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-amber-500/20 p-8 backdrop-blur-xl"
                >
                    <h3 className="text-lg font-semibold text-white mb-6 text-center">
                        {t("monthlyActivity")}
                    </h3>
                    <div className="h-[400px]">
                        <Line
                            data={{
                                labels: filteredData.map((e: any) => format(new Date(e.date), "MMM dd")),
                                datasets: [
                                    {
                                        label: t("metrics.profileVisits"),
                                        data: filteredData.map((e: any) => e.visit),
                                        borderColor: "#F59E0B",
                                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                                        borderWidth: 3,
                                        fill: true,
                                        tension: 0.4,
                                        pointRadius: 6,
                                        pointBackgroundColor: "#F59E0B",
                                        pointBorderColor: "#0F172A",
                                        pointBorderWidth: 2,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: true, labels: { color: "#D1D5DB" } } },
                            }}
                        />
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
