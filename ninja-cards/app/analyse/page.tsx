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
import "chartjs-adapter-date-fns";
import { format } from "date-fns";

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

const DashboardPage = () => {
    const { user } = useAuth();
    const [id, setId] = useState("");
    const [dashboardData, setDashboardData] = useState({
        profileVisits: 0,
        vcfDownloads: 0,
        profileShares: 0,
        socialLinkClicks: 0,
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        if (user) setId(user.id);
    }, [user]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!id) return;
            try {
                const [dashboardRes, eventsRes] = await Promise.all([
                    fetch(`${BASE_API_URL}/api/dashboard/${id}`),
                    fetch(`${BASE_API_URL}/api/dashboard/events/${id}`),
                ]);

                if (!dashboardRes.ok || !eventsRes.ok) throw new Error("Error loading data");

                const dashboard = await dashboardRes.json();
                const events = await eventsRes.json();

                setDashboardData(dashboard);
                setMonthlyData(events);
                setFilteredData(events); // Default to all data
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [id]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const month = event.target.value;
        setSelectedMonth(month);

        if (month === "") {
            setFilteredData(monthlyData);
        } else {
            const filtered = monthlyData.filter((e: any) =>
                format(new Date(e.date), "yyyy-MM") === month
            );
            setFilteredData(filtered);
        }
    };

    const doughnutData = {
        labels: ["Посещения на профила", "Изтегляния", "Споделяния", "Кликове"],
        datasets: [
            {
                data: [
                    dashboardData.profileVisits,
                    dashboardData.vcfDownloads,
                    dashboardData.profileShares,
                    dashboardData.socialLinkClicks,
                ],
                backgroundColor: ["#1E3A8A", "#10B981", "#F59E0B", "#7C3AED"],
                hoverBackgroundColor: ["#3B82F6", "#22C55E", "#FBBF24", "#A78BFA"],
                borderWidth: 2,
            },
        ],
    };

    const barData = {
        labels: ["Посещения", "Изтегляния", "Споделяния", "Кликове"],
        datasets: [
            {
                label: "Общ брой",
                data: [
                    dashboardData.profileVisits,
                    dashboardData.vcfDownloads,
                    dashboardData.profileShares,
                    dashboardData.socialLinkClicks,
                ],
                backgroundColor: "#F59E0B",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#FBBF24",
            },
        ],
    };

    const lineData = {
        labels: filteredData.map((e: any) => e.date),
        datasets: [
            {
                label: "Посещения",
                data: filteredData.map((e: any) => e.visit),
                borderColor: "#1E3A8A",
                backgroundColor: "rgba(30, 58, 138, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Изтегляния",
                data: filteredData.map((e: any) => e.download),
                borderColor: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Споделяния",
                data: filteredData.map((e: any) => e.share),
                borderColor: "#F59E0B",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Кликове",
                data: filteredData.map((e: any) => e.socialClick),
                borderColor: "#7C3AED",
                backgroundColor: "rgba(124, 58, 237, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const metricLabels: Record<string, string> = {
        profileVisits: "Посещения на профила",
        vcfDownloads: "Изтегляния на визитка",
        profileShares: "Споделяния на профила",
        socialLinkClicks: "Кликове по социални мрежи",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="flex justify-center items-center py-72">
                    <img src="/load.gif" alt="Loading..." className="w-40 h-40" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-8 px-4 pt-28 sm:px-6 lg:px-8 text-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-12">Анализ на профила</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {Object.entries(dashboardData).map(([key, value]) => (
                        <div key={key} className="bg-gray-300 shadow-lg rounded-lg p-6 text-center">
                            <h2 className="text-2xl font-semibold text-black">{value}</h2>
                            <p className="text-black mt-2">{metricLabels[key]}</p>
                        </div>
                    ))}
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-300 shadow-lg rounded-lg p-8 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Общ изглед на данните</h3>
                        <div className="w-full max-w-xs">
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>

                    <div className="bg-gray-300 shadow-lg rounded-lg p-8 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Разбивка на статистиката</h3>
                        <div className="w-full max-w-xs">
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { enabled: true },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-8">
                    <label htmlFor="month-filter" className="block text-lg font-medium text-gray-300 mb-2">
                        Филтрирай по месец:
                    </label>
                    <select
                        id="month-filter"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="bg-gray-700 text-white rounded-lg p-2 w-full"
                    >
                        <option value="">Всички месеци</option>
                        {Array.from(new Set(monthlyData.map((e: any) => format(new Date(e.date), "yyyy-MM")))).map(
                            (month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            )
                        )}
                    </select>
                </div>
                <div className="bg-gray-300 shadow-lg rounded-lg p-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Месечна активност</h3>
                    <Line
                        data={lineData}
                        options={{
                            responsive: true,
                            interaction: {
                                mode: "nearest",
                                axis: "x",
                                intersect: false,
                            },
                            plugins: {
                                legend: { position: "top" },
                                tooltip: {
                                    mode: "index",
                                    intersect: false,
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            const dataset = lineData.datasets[tooltipItem.datasetIndex];
                                            const value = dataset.data[tooltipItem.dataIndex];
                                            return `${dataset.label}: ${value}`;
                                        },
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    type: "time",
                                    time: {
                                        unit: "month",
                                        tooltipFormat: "PPP",
                                        displayFormats: {
                                            month: "MMM yyyy",
                                        },
                                    },
                                    title: {
                                        display: true,
                                        text: "Месец",
                                    },
                                },
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: "Брой събития",
                                    },
                                },
                            },
                        }}
                    />
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
