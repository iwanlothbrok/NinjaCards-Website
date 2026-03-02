'use client';

import React from 'react';
import Image from 'next/image';
import { Link, useRouter, type Href } from '@/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock, faEnvelope, faMapMarkerAlt, faImage, faChartLine, faUser, faLink,
  faEye, faIdCard, faQrcode, faCogs, faChartBar, faVideo, faGlobe, faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
  {
    kind: 'dynamic',
    buildHref: (id: string) => ({ pathname: '/profileDetails/[id]', params: { id } } as const),
    labelKey: 'businessCard',
    icon: faIdCard
  },
  { kind: 'static', href: '/profile/subscribed', labelKey: 'clients', icon: faUser },
  { kind: 'static', href: '/analyse', labelKey: 'analyse', icon: faChartBar },
  { kind: 'static', href: '/profile/links', labelKey: 'links', icon: faLink },
  { kind: 'static', href: '/profile/profileQr', labelKey: 'qr', icon: faQrcode },
  { kind: 'static', href: '/profile/changeLanguage', labelKey: 'language', icon: faGlobe },
  { kind: 'static', href: '/profile/settings', labelKey: 'changePassword', icon: faCogs },
  { kind: 'static', href: '/profile/information', labelKey: 'info', icon: faCircleQuestion },
  { kind: 'static', href: '/profile/changeEmail', labelKey: 'changeEmail', icon: faEnvelope },
  { kind: 'static', href: '/profile/changeImage', labelKey: 'changeImage', icon: faImage },
  { kind: 'static', href: '/profile/features', labelKey: 'features', icon: faEye },
  { kind: 'static', href: '/profile/help', labelKey: 'help', icon: faMapMarkerAlt },
  { kind: 'static', href: '/profile/cover', labelKey: 'cover', icon: faVideo },
  { kind: 'static', href: '/profile/billing', labelKey: 'billing', icon: faChartLine },
];

export default function ProfileTabs() {
  const { user, loading } = useAuth();

  const userId = user?.id ? String(user.id) : null;
  const t = useTranslations('ProfileTabs');

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleNavigation = (href: Href) => {
    setIsLoading(true);
    router.push(href);
  };

  React.useEffect(() => {

    if (loading) return;        // ✅ don’t redirect while auth is hydrating
    if (!user) router.replace('/'); // or '/login' (your choice)
  }, [loading, user, router]);
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Image src="/load.gif" alt={t("loading.alt")} width={96} height={96} className="animate-spin" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center pt-32 sm:pt-36 justify-center min-h-screen p-4 
        bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200 overflow-hidden"
      >
        {/* Glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-5xl relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 
            bg-clip-text text-transparent mb-4 animate-fade-in">
              {t('title')}
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-amber-500/60 rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="h-1 w-12 bg-amber-500/60 rounded-full"></div>
            </div>
          </motion.div>

          {/* Main Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tabs.slice(0, 6).map((tab, index) => {
              if (tab.kind === 'static') {
                return (
                  <motion.div
                    key={tab.labelKey}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div onClick={() => handleNavigation(tab.href)} className="cursor-pointer">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50
                      hover:bg-gradient-to-br hover:from-amber-600/15 hover:to-orange-600/10 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all group">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center
                          group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all"
                        >
                          <FontAwesomeIcon icon={tab.icon} className="text-amber-500 text-xl" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-white">{t(`tabs.${tab.labelKey}.label`)}</h3>
                          <p className="text-sm text-gray-300">{t(`tabs.${tab.labelKey}.desc`)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              const disabled = !userId;
              if (disabled) {
                return (
                  <motion.div
                    key={tab.labelKey}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30
                    opacity-50 cursor-not-allowed"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-700/30 flex items-center justify-center">
                      <FontAwesomeIcon icon={tab.icon} className="text-gray-500 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-400">{t(`tabs.${tab.labelKey}.label`)}</h3>
                      <p className="text-xs text-gray-500">{t('needId')}</p>
                    </div>
                  </motion.div>
                );
              }

              const href = tab.buildHref(userId);
              return (
                <motion.div
                  key={tab.labelKey}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div onClick={() => handleNavigation(href)} className="cursor-pointer">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50
                    hover:bg-gradient-to-br hover:from-amber-600/15 hover:to-orange-600/10 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all group">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center
                        group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all"
                      >
                        <FontAwesomeIcon icon={tab.icon} className="text-amber-500 text-xl" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white">{t(`tabs.${tab.labelKey}.label`)}</h3>
                        <p className="text-sm text-gray-300">{t(`tabs.${tab.labelKey}.desc`)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Options */}
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-xl font-semibold text-white mb-4"
          >
            {t('moreOptions')}
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tabs.slice(6).map((tab, index) => {
              const disabled = tab.kind === 'dynamic' && !userId;
              return (
                <motion.div
                  key={tab.labelKey}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                  whileHover={!disabled ? { scale: 1.05, y: -3 } : {}}
                  whileTap={!disabled ? { scale: 0.95 } : {}}
                >
                  <div
                    onClick={() => !disabled && handleNavigation(tab.kind === 'static' ? tab.href : tab.buildHref(userId || ''))}
                    className={`flex flex-col items-center justify-center p-6 h-40 rounded-xl border transition-all ${disabled
                      ? 'bg-gray-800/20 border-gray-700/20 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/40 hover:from-amber-600/20 hover:to-orange-600/15 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/15 cursor-pointer'
                      }`}
                  >
                    <motion.div
                      whileHover={!disabled ? { rotate: [0, -10, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <FontAwesomeIcon icon={tab.icon} className={`text-3xl mb-3 ${disabled ? 'text-gray-600' : 'text-amber-500'}`} />
                    </motion.div>
                    <span className={`text-sm font-semibold text-center ${disabled ? 'text-gray-500' : 'text-white'}`}>
                      {t(`tabs.${tab.labelKey}.label`)}
                    </span>
                    <span className={`text-xs text-center mt-1 ${disabled ? 'text-gray-600' : 'text-gray-400'}`}>
                      {disabled ? t('needId') : t(`tabs.${tab.labelKey}.desc`)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );

}
