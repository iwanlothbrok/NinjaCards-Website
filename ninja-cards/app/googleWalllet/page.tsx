'use client'
import React from 'react'
import AddToGoogleWallet from '../components/profile/GoogleWallet'
import { useAuth } from '../context/AuthContext'

export default function Page() {
    const { user } = useAuth()
    return (

        <div className='justify-center items-center flex flex-col mt-52'>
            <h1>Your Business Card</h1>
            <AddToGoogleWallet userId={user?.id || ''} />
        </div>
    )
}
