import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { getPathname, type Href } from '@/navigation';
import { BASE_API_URL } from '@/utils/constants';
import type { Locale } from '@/config';

// Lazy load ProfileDetailsContent
const ProfileDetailsContent = dynamic(() => import('../ProfileDetailsContent'), { suspense: true });

type User = {
    id: string;
};

// ✅ This is the new function

export async function generateMetadata(
    { params: { id, locale } }: { params: { id: string; locale: Locale } }
): Promise<Metadata> {
    const href: Href = { pathname: '/profileDetails/[id]' as const, params: { id } };

    return {
        alternates: {
            canonical: getPathname({ locale, href }),
            languages: {
                'bg-BG': getPathname({ locale: 'bg', href }),
                'en-US': getPathname({ locale: 'en', href })
            }
        }
    };
}
export async function generateStaticParams(): Promise<{ id: string }[]> {
    try {
        const res = await fetch(`${BASE_API_URL}/api/profile/allUsers`);

        if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.statusText}`);
        }

        const users: User[] = await res.json();

        if (!Array.isArray(users)) {
            throw new Error('Expected an array of users, but got something else.');
        }

        return users.map((user) => ({
            id: user.id.toString()
        }));
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return [];
    }
}

const ProfileDetailsPage = ({ params }: { params: { locale: string; id: string } }) => {
    console.log('id is ' + params.id);
    if (!params.id) return notFound();

    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center py-72">
                    <img src="/load.gif" alt="Loading..." className="w-40 h-40" />
                </div>
            }
        >
            <ProfileDetailsContent userId={params.id} />
        </Suspense>
    );
};

export default ProfileDetailsPage;
