// File: /app/[locale]/components/layout/LangSwitcher.tsx  (keep your path)
'use client';

import { Link, usePathname } from '@/navigation';
import { locales } from '@/config';

// Typed alias for convenience
export type LinkHref = React.ComponentProps<typeof Link>['href'];

/**
 * Language switcher compatible with next-intl + dynamic routes.
 * - Derives params from the current pathname (no useParams in header).
 * - For dynamic routes returns object Href: { pathname, params }.
 * - For static routes returns the concrete path string.
 */
function stripLocale(pathname: string): { locale: string | null; path: string } {
    for (const loc of locales) {
        const prefix = `/${loc}`;
        if (pathname === prefix) return { locale: loc, path: '/' };
        if (pathname.startsWith(prefix + '/')) return { locale: loc, path: pathname.slice(prefix.length) };
    }
    return { locale: null, path: pathname };
}

function buildHrefForCurrentRoute(fullPathname: string): LinkHref {
    const { path } = stripLocale(fullPathname || '/');

    // /profileDetails/[id]
    const mProfile = path.match(/^\/profileDetails\/([^\/?#]+)/);
    if (mProfile) {
        const id = mProfile[1];
        return { pathname: '/profileDetails/[id]', params: { id } } as const;
    }

    // /products/[type]/[id]
    const mProduct = path.match(/^\/products\/([^\/?#]+)\/([^\/?#]+)/);
    if (mProduct) {
        const [, type, id] = mProduct;
        return { pathname: '/products/[type]/[id]', params: { type, id } } as const;
    }

    // Static or unmapped path: return concrete path
    return (path || '/') as LinkHref;
}

export function LangSwitcher({ setIsMenuOpen }: { setIsMenuOpen: (v: boolean) => void }) {
    const pathname = usePathname() ?? '/'; // e.g. "/en/profileDetails/1"

    return (
        <div className="flex items-center gap-3">
            {locales.map((l) => {
                const isActive = pathname.startsWith(`/${l}`);
                const href = buildHrefForCurrentRoute(pathname);
                return (
                    <Link
                        key={l}
                        href={href}
                        locale={l}
                        aria-current={isActive ? 'page' : undefined}
                        className={`relative px-4 py-2 rounded-lg border text-sm uppercase tracking-widest font-bold transition-all duration-300
              ${isActive
                                ? 'border-orange bg-gradient-to-r from-orange via-yellow-400 to-orange text-white shadow-[0_8px_16px_rgba(255,140,0,0.4)] scale-110 backdrop-blur-sm'
                                : 'border-orange/40 text-orange hover:border-orange/80 hover:bg-orange/5 hover:shadow-[0_4px_12px_rgba(255,140,0,0.2)] hover:scale-105'
                            }`}
                        onClick={() => setIsMenuOpen(false)}
                        style={{ minWidth: 50, textAlign: 'center' }}
                    >
                        {isActive && (
                            <span className="absolute -top-3 -right-3 bg-gradient-to-r from-orange to-yellow-400 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg animate-pulse">
                                ★
                            </span>
                        )}
                        <span className="drop-shadow-lg">{l}</span>
                    </Link>
                );
            })}
        </div>
    );
}
