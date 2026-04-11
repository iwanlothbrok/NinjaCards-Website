import { Suspense } from 'react';
import AdminConsole from './components/AdminConsole';

export default function AdminPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#05080c] via-darkBg to-black text-white">
                    Loading admin console...
                </div>
            }
        >
            <AdminConsole />
        </Suspense>
    );
}
