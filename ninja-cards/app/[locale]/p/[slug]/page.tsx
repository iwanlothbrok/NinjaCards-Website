import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { Locale } from '@/config';
import { BASE_API_URL, PUBLIC_SITE_URL, buildPublicAssetUrl } from '@/utils/constants';

export const dynamic = 'force-dynamic';

const ProfileDetailsContent = dynamicImport(
    () => import('../../profileDetails/ProfileDetailsContent'),
    { suspense: true }
);

export async function generateMetadata(
    { params: { slug, locale } }: { params: { slug: string; locale: Locale } }
): Promise<Metadata> {
    let user: any = null;
    try {
        const res = await fetch(`${BASE_API_URL}/api/profile/${slug}`, { cache: 'no-store' });
        if (res.ok) user = await res.json();
    } catch { }

    const name = user?.name ?? 'Ninja Cards NFC';
    const title = user?.name ? `${user.name} | Ninja Cards NFC` : 'Ninja Cards NFC';
    const description = user?.position
        ? `${user.name} - ${user.position}`
        : 'Смарт NFC визитки – дигитално споделяне на контакти';
    const image = user?.image ?? buildPublicAssetUrl('/navlogo.png');
    const canonicalPath = `/${locale}/p/${slug}`;

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
                'bg-BG': `${PUBLIC_SITE_URL}/bg/p/${slug}`,
                'en-US': `${PUBLIC_SITE_URL}/en/p/${slug}`,
            },
        },
    };
}

const SlugProfilePage = ({ params }: { params: { slug: string } }) => {
    if (!params.slug) return notFound();

    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center py-72">
                    <Image src="/load.gif" alt="Loading..." className="w-40 h-40" />
                </div>
            }
        >
            <ProfileDetailsContent userId={params.slug} />
        </Suspense>
    );
};

export default SlugProfilePage;
