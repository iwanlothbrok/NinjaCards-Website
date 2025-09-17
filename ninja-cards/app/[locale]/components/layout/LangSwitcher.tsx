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
        <div className="flex items-center gap-2">
            {locales.map((l) => {
                const isActive = pathname.startsWith(`/${l}`);
                const href = buildHrefForCurrentRoute(pathname);
                return (
                    <Link
                        key={l}
                        href={href}
                        locale={l}
                        aria-current={isActive ? 'page' : undefined}
                        className={`relative px-3 py-1 rounded-full border text-sm uppercase tracking-wide font-semibold transition-all duration-200
              ${isActive
                                ? 'border-orange bg-gradient-to-r from-orange to-yellow-400 text-white shadow-lg scale-105'
                                : 'border-orange/60 text-orange hover:bg-orange hover:text-white hover:scale-105'
                            }`}
                        onClick={() => setIsMenuOpen(false)}
                        style={{ minWidth: 40, textAlign: 'center' }}
                    >
                        {isActive && (
                            <span className="absolute -top-2 -right-2 bg-orange text-white text-xs rounded-full px-1.5 py-0.5 shadow-md animate-bounce">
                                ✓
                            </span>
                        )}
                        <span className="drop-shadow">{l}</span>
                    </Link>
                );
            })}
        </div>
    );
}
