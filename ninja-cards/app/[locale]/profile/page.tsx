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
  { kind: 'static', href: '/profile/settings', labelKey: 'changePassword', icon: faLock },
  { kind: 'static', href: '/profile/changeEmail', labelKey: 'changeEmail', icon: faEnvelope },
  // { kind: 'static', href: '/profile/changeAddress', labelKey: 'changeAddress', icon: faMapMarkerAlt },
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
  // { kind: 'static', href: '/profile/video', labelKey: 'video', icon: faVideo },
  { kind: 'static', href: '/profile/changeLanguage', labelKey: 'language', icon: faGlobe },
  { kind: 'static', href: '/profile/help', labelKey: 'help', icon: faCircleQuestion },
  { kind: 'static', href: '/profile/subscribed', labelKey: 'clients', icon: faChartLine }
];

export default function ProfileTabs() {
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : null;
  const t = useTranslations('ProfileTabs');

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleNavigation = (href: Href) => {
    setIsLoading(true);
    router.push(href);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <img src="/load.gif" alt={t("loading.alt")} className="w-24 h-24 animate-spin" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center pt-32 sm:pt-36 justify-center min-h-screen p-4 
        bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200"
      >
        <div className="w-full max-w-5xl">
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
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50
                      hover:bg-amber-600/10 hover:border-amber-500/50 transition-all group">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center
                          group-hover:bg-amber-500/20 transition-all"
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
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50
                    hover:bg-amber-600/10 hover:border-amber-500/50 transition-all group">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center
                        group-hover:bg-amber-500/20 transition-all"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {tabs.slice(6).map((tab, index) => (
              <motion.div
                key={tab.labelKey}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  onClick={() => handleNavigation(tab.kind === 'static' ? tab.href : tab.buildHref(userId || ''))}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800/30 border border-gray-700/30
                  hover:bg-gray-800/50 hover:border-gray-600/50 transition-all cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="text-amber-500/80 text-2xl mb-2" />
                  </motion.div>
                  <span className="text-sm text-gray-300 text-center">{t(`tabs.${tab.labelKey}.label`)}</span>
                  <span className="text-xs text-gray-500 text-center">{t(`tabs.${tab.labelKey}.desc`)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );

}
