import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPathname, type Href } from '@/navigation';
import { BASE_API_URL, PUBLIC_SITE_URL, buildPublicAssetUrl } from '@/utils/constants';
import type { Locale } from '@/config';

export const dynamic = 'force-dynamic';

const ProfileDetailsContent = dynamicImport(() => import('../ProfileDetailsContent'), { suspense: true });

export async function generateMetadata(
    { params: { id, locale } }: { params: { id: string; locale: Locale } }
): Promise<Metadata> {
    const href: Href = { pathname: '/profileDetails/[id]' as const, params: { id } };

    let user: any = null;
    try {
        const res = await fetch(`${BASE_API_URL}/api/profile/${id}`, { cache: 'no-store' });
        if (res.ok) user = await res.json();
    } catch { }

    const name = user?.name ?? 'Ninja Cards NFC';
    const title = user?.name ? `${user.name} | Ninja Cards NFC` : 'Ninja Cards NFC';
    const description = user?.jobTitle
        ? `${user.name} - ${user.jobTitle}`
        : 'Смарт NFC визитки – дигитално споделяне на контакти';
    const image = user?.image ?? buildPublicAssetUrl('/navlogo.png');
    const canonicalPath = getPathname({ locale, href });

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image, width: 1200, height: 630, alt: name }],
            type: 'profile',
        },
        alternates: {
            canonical: `${PUBLIC_SITE_URL}${canonicalPath}`,
            languages: {
                'bg-BG': `${PUBLIC_SITE_URL}${getPathname({ locale: 'bg', href })}`,
                'en-US': `${PUBLIC_SITE_URL}${getPathname({ locale: 'en', href })}`
            }
        }
    };
}

const ProfileDetailsPage = ({ params }: { params: { locale: string; id: string } }) => {
    if (!params.id) return notFound();

    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center py-72">
                    <Image src="/load.gif" alt="Loading..." className="w-40 h-40" />
                </div>
            }
        >
            <ProfileDetailsContent userId={params.id} />
        </Suspense>
    );
};

export default ProfileDetailsPage;
