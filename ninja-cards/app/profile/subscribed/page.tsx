// File: /components/UserLeadsTable.tsx

'use client'

import { useAuth } from '@/app/context/AuthContext'
import { BASE_API_URL } from '@/utils/constants'
import React, { useEffect, useState } from 'react'

interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    message?: string
    createdAt: string
}


const UserLeadsTable: React.FC = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/subscribed/${user?.id}`)
                if (!res.ok) throw new Error('Грешка при зареждане на лийдове')
                const data = await res.json()

                console.log('data: ', data);

                setLeads(data.leads)
            } catch (err) {
                console.error(err)
                setError('Неуспешно зареждане на данните.')
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [user?.id])

    const downloadCSV = () => {
        window.location.href = `${BASE_API_URL}/api/subscribed/csv/${user?.id}?format=csv`
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <img src="/load.gif" alt="Зареждане..." className="w-24 h-24 animate-spin" />
        </div>
    )
    if (error) return (
        <div className="flex justify-center items-center  h-32">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
    )
    if (!leads.length) return (
        <div className="flex justify-center items-center mt-32 h-32">
            <p className="text-red-500 text-2xl">Няма записани потенциални клиенти.</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="w-full max-w-5xl mx-auto mt-36 p-8 bg-gradient-to-b from-gray-800 to-gray-900 
            rounded-3xl shadow-2xl border border-gray-700 sm:mx-6 md:mx-10 lg:mx-auto">

                <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
                    📋 Вашите Потенциални клиенти
                </h2>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-white">Списък с Потенциални клиенти</h3>
                    <button
                        onClick={downloadCSV}
                        className="bg-orange text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition duration-200"
                    >
                        Изтегли като CSV
                    </button>
                </div>
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-inner">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-700 text-white">
                            <tr>
                                <th className="p-4 text-sm font-semibold">Име</th>
                                <th className="p-4 text-sm font-semibold">Имейл</th>
                                <th className="p-4 text-sm font-semibold">Телефон</th>
                                <th className="p-4 text-sm font-semibold">Съобщение</th>
                                <th className="p-4 text-sm font-semibold">Дата</th>
                                <th className="p-4 text-sm font-semibold">Функции</th>

                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead, index) => (
                                <tr
                                    key={lead.id}
                                    className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                                        } hover:bg-gray-700 transition duration-150`}
                                >
                                    <td className="p-4 text-sm text-gray-300">{lead.name}</td>
                                    <td className="p-4 text-sm text-gray-300">{lead.email || '-'}</td>
                                    <td className="p-4 text-sm text-gray-300">{lead.phone || '-'}</td>
                                    <td className="p-4 text-sm text-gray-300">{lead.message || '-'}</td>
                                    <td className="p-4 text-sm text-gray-300">
                                        {new Date(lead.createdAt).toLocaleString('bg-BG')}
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(`${BASE_API_URL}/api/subscribed/delete/${lead.id}`, {
                                                        method: 'DELETE',
                                                    });
                                                    if (!res.ok) throw new Error('Грешка при изтриване на лийда');
                                                    setLeads((prevLeads) => prevLeads.filter((l) => l.id !== lead.id));
                                                } catch (err) {
                                                    console.error(err);
                                                    setError('Неуспешно изтриване на лийда.');
                                                }
                                            }}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200"
                                        >
                                            Изтрий
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserLeadsTable