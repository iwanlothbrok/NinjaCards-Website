'use client';

import React from 'react';
import { Link, useRouter, type Href } from '@/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock, faEnvelope, faMapMarkerAlt, faImage, faChartLine, faUser, faLink,
  faEye, faIdCard, faQrcode, faCogs, faChartBar, faVideo, faGlobe, faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from 'next-intl';

type StaticTab = {
  kind: 'static';
  href: Href;
  labelKey: string;
  icon: any;
};

type DynamicTab = {
  kind: 'dynamic';
  buildHref: (id: string) => Href;
  labelKey: string;
  icon: any;
};

const tabs: Array<StaticTab | DynamicTab> = [
  { kind: 'static', href: '/profile/settings', labelKey: 'changePassword', icon: faLock },
  { kind: 'static', href: '/profile/changeEmail', labelKey: 'changeEmail', icon: faEnvelope },
  { kind: 'static', href: '/profile/changeAddress', labelKey: 'changeAddress', icon: faMapMarkerAlt },
  { kind: 'static', href: '/profile/changeImage', labelKey: 'changeImage', icon: faImage },
  { kind: 'static', href: '/profile/information', labelKey: 'info', icon: faUser },
  { kind: 'static', href: '/profile/links', labelKey: 'links', icon: faLink },
  // { kind: 'static', href: '/profile/preview', labelKey: 'preview', icon: faEye },
  {
    kind: 'dynamic',
    buildHref: (id: string) => ({ pathname: '/profileDetails/[id]', params: { id } } as const),
    labelKey: 'businessCard',
    icon: faIdCard
  },
  { kind: 'static', href: '/profile/profileQr', labelKey: 'qr', icon: faQrcode },
  { kind: 'static', href: '/profile/features', labelKey: 'features', icon: faCogs },
  { kind: 'static', href: '/analyse', labelKey: 'analyse', icon: faChartBar },
  { kind: 'static', href: '/profile/video', labelKey: 'video', icon: faVideo },
  { kind: 'static', href: '/profile/changeLanguage', labelKey: 'language', icon: faGlobe },
  { kind: 'static', href: '/profile/help', labelKey: 'help', icon: faCircleQuestion },
  { kind: 'static', href: '/profile/subscribed', labelKey: 'clients', icon: faChartLine }
];

function Tile({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const classes = `relative flex flex-col items-center justify-center p-5 rounded-lg shadow-lg border border-gray-700 
    transition-all bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-amber-600 
    hover:via-amber-700 hover:to-amber-800 hover:text-white transform hover:scale-105 focus:ring-4 focus:ring-orange-300
    ${disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`;
  return (
    <div className={classes} style={{ width: '100%', height: '160px' }}>
      {children}
    </div>
  );
}

export default function ProfileTabs() {
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : null;
  const t = useTranslations('ProfileTabs');

  return (
    <div className="flex flex-col items-center pt-28 sm:pt-36 justify-center min-h-screen p-4 
      bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white mb-8 tracking-wide">{t('title')}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 animate-fadeIn">
          {tabs.map((tab) => {
            if (tab.kind === 'static') {
              return (
                <Link key={tab.labelKey} href={tab.href} className="contents">
                  <Tile>
                    <FontAwesomeIcon icon={tab.icon} size="2x" className="mb-3 text-amber-500" />
                    <h3 className="text-lg font-semibold">{t(`tabs.${tab.labelKey}`)}</h3>
                  </Tile>
                </Link>
              );
            }

            const disabled = !userId;
            if (disabled) {
              return (
                <Tile key={tab.labelKey} disabled>
                  <FontAwesomeIcon icon={tab.icon} size="2x" className="mb-3 text-amber-500" />
                  <h3 className="text-lg font-semibold">{t(`tabs.${tab.labelKey}`)}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('needId')}</p>
                </Tile>
              );
            }

            const href = tab.buildHref(userId);
            return (
              <Link key={tab.labelKey} href={href} className="contents">
                <Tile>
                  <FontAwesomeIcon icon={tab.icon} size="2x" className="mb-3 text-amber-500" />
                  <h3 className="text-lg font-semibold">{t(`tabs.${tab.labelKey}`)}</h3>
                </Tile>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
