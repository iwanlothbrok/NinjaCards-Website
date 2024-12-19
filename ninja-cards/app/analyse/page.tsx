"use client";

import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { BASE_API_URL } from "@/utils/constants";
import { useAuth } from "../context/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardPage = () => {
    const { user } = useAuth();
    const [id, setId] = useState('')
    console.log('in');

    useEffect(() => {
        console.log(user);

        if (user) {
            setId(user.id)
        }
    }, [])
    const [dashboardData, setDashboardData] = useState({
        profileVisits: 0,
        vcfDownloads: 0,
        profileShares: 0,
        socialLinkClicks: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${BASE_API_URL}/api/dashboard/${id}`);
                if (!response.ok) throw new Error("Неуспешно зареждане на данните");
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error("Грешка при зареждането на данните:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [id]);

    const doughnutData = {
        labels: ["Посещения на профила", "VCF сваляния", "Споделяния на профила", "Кликове по социални мрежи"],
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
            },
        ],
    };

    const barData = {
        labels: ["Посещения на профила", "VCF сваляния", "Споделяния на профила", "Кликове по социални мрежи"],
        datasets: [
            {
                label: "Статистика",
                data: [
                    dashboardData.profileVisits,
                    dashboardData.vcfDownloads,
                    dashboardData.profileShares,
                    dashboardData.socialLinkClicks,
                ],
                backgroundColor: "#F59E0B",
                hoverBackgroundColor: "#FBBF24",
                borderRadius: 6,
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-8 px-4 pt-28 sm:px-6 lg:px-8 text-white">
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-12">Анализ на профила</h1>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gray-300 shadow-lg rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-semibold text-black">{dashboardData.profileVisits}</h2>
                        <p className="text-black mt-2">Посещения на профила</p>
                    </div>
                    <div className="bg-gray-300 shadow-lg rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-semibold text-black">{dashboardData.vcfDownloads}</h2>
                        <p className="text-black mt-2">VCF сваляния</p>
                    </div>
                    <div className="bg-gray-300 shadow-lg rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-semibold text-black">{dashboardData.profileShares}</h2>
                        <p className="text-black mt-2">Споделяния на профила</p>
                    </div>
                    <div className="bg-gray-300 shadow-lg rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-semibold text-black">{dashboardData.socialLinkClicks}</h2>
                        <p className="text-black mt-2">Кликове по социални мрежи</p>
                    </div>
                </div>

                {/* Graphs Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Doughnut Chart */}
                    <div className="bg-gray-300 shadow-lg rounded-lg p-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Общ изглед на данните</h3>
                        <Doughnut data={doughnutData} />
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-gray-300 shadow-lg rounded-lg p-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Разбивка на статистиката</h3>
                        <Bar data={barData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
