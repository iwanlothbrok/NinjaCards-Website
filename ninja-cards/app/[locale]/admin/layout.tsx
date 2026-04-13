import type { ReactNode } from 'react';
import { AdminAuthProvider } from './AdminAuthProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
