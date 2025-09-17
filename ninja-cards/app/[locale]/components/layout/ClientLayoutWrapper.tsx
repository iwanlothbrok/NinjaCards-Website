// app/components/layout/ClientLayoutWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatlingWidget from '../ChatlingWidget';

export default function ClientLayoutWrapper() {
    const pathname = usePathname();
    const [showChatling, setShowChatling] = useState(false);

    useEffect(() => {
        const shouldShow = !(pathname?.toLowerCase().includes('profiledetails'));
        if (shouldShow) {
            const timer = setTimeout(() => setShowChatling(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setShowChatling(false);
        }
    }, [pathname]);

    if (!showChatling) return null;

    return <ChatlingWidget />;
}
