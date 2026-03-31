export type AdminRole = 'SUPER_ADMIN' | 'OPERATIONS';
export type AdminStatus = 'ACTIVE' | 'DISABLED';

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
    status: AdminStatus;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface AdminSession {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
    status: AdminStatus;
    lastLoginAt: string | null;
}
