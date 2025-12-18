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
            className="min-h-screen pt-32 sm:pt-36 px-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
        >
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(dashboardData).map(([key, value]) => (
                        <div
                            key={key}
                            className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6 text-center"
                        >
                            <p className="text-3xl font-bold text-white">{value}</p>
                            <p className="text-gray-400 mt-2">
                                {t(`metrics.${key}`)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">
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
                                        backgroundColor: ["#1E3A8A", "#10B981", "#F59E0B", "#7C3AED"],
                                    },
                                ],
                            }}
                        />
                    </div>

                    <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">
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
                                    },
                                ],
                            }}
                            options={{ plugins: { legend: { display: false } } }}
                        />
                    </div>
                </div>

                {/* Filter */}
                <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6">
                    <label className="block text-sm text-gray-400 mb-2">
                        {t("filter")}
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-200"
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
                </div>

                {/* Line chart */}
                <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">
                        {t("monthlyActivity")}
                    </h3>
                    <div className="h-[400px]">
                        <Line
                            data={{
                                labels: filteredData.map((e: any) => format(new Date(e.date), "yyyy-MM-dd")),
                                datasets: [
                                    {
                                        label: t("metrics.profileVisits"),
                                        data: filteredData.map((e: any) => e.visit),
                                        borderColor: "#F59E0B",
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
