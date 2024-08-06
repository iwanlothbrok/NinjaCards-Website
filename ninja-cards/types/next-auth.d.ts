import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface User extends DefaultUser {
        id: number;
    }

    interface Session extends DefaultSession {
        user: {
            id: number;
        } & DefaultSession['user'];
    }

    interface JWT {
        id: number;
    }
}
