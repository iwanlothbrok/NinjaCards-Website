// File: /app/[locale]/components/Navigation.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, usePathname } from "@/navigation";
import { useAuth } from "../context/AuthContext";
import { locales } from "@/config";
import { useTranslations } from "next-intl";
import { LangSwitcher } from "./layout/LangSwitcher";

type LinkHref = React.ComponentProps<typeof Link>["href"];

interface NavItemProps {
  href: LinkHref;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}
const NavItem: React.FC<NavItemProps> = ({ href, onClick, children, className }) => (
  <li>
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 hover:bg-darkOrange ${className || ""}`}
    >
      {children}
    </Link>
  </li>
);

/* -------- Helpers to decide when to hide the language switcher -------- */
// Strip locale prefix ("/bg", "/en") and return locale-less path.
function stripLocale(pathname: string | null | undefined): string {
  const p = pathname || "/";
  for (const loc of locales) {
    const prefix = `/${loc}`;
    if (p === prefix) return "/";
    if (p.startsWith(prefix + "/")) return p.slice(prefix.length);
  }
  return p;
}

// True if on /profileDetails/[id]
function isProfileDetailsPath(pathname: string | null | undefined): boolean {
  const path = stripLocale(pathname);
  return /^\/profileDetails\/[^\/?#]+(?:[\/?#]|$)/.test(path);
}

// True if on /products/[type]/[id]
function isProductsDetailsPath(pathname: string | null | undefined): boolean {
  const path = stripLocale(pathname);
  return /^\/products\/[^\/?#]+\/[^\/?#]+(?:[\/?#]|$)/.test(path);
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("Navbar");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAuthenticated = !!user;

  // Hide switcher on dynamic detail pages
  const hideLangSwitcher =
    isProfileDetailsPath(pathname) || isProductsDetailsPath(pathname);

  // If you still need special header offset for details page on phones:
  const isOnDetailsPage = isProfileDetailsPath(pathname);

  const toggleProductDropdown = useCallback(() => {
    setIsProductDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsPhone(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) setIsProductDropdownOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    };

    if (isDropdownOpen || isMenuOpen || isProductDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isMenuOpen, isProductDropdownOpen]);

  // Watch for pathname changes to hide loading
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) {
      setIsDropdownOpen(false);
      setIsProductDropdownOpen(false);
    }
  }, [isMenuOpen]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
    if (isPhone && !isDropdownOpen) setIsMenuOpen(true);
  }, [isPhone, isDropdownOpen]);

  const handleDropdownItemClick = useCallback(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    handleDropdownItemClick();
  }, [logout, handleDropdownItemClick]);

  const handleNavLinkClick = useCallback(() => {
    setIsLoading(true);
    if (isPhone) setIsMenuOpen(false);
  }, [isPhone]);

  // ... (rest of the code)

  return (
    <>
      <header
        className={`fixed ${isOnDetailsPage && isPhone ? "top-16" : "top-0"} left-0 z-40 w-full transition-all duration-500 ${isScrolled ? "bg-gradient-to-b !top-0 from-gray-900 via-gray-950 to-black shadow-md" : "bg-transparent"
          }`}
        aria-label={t("aria.header")}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative flex items-center justify-between py-3 lg:py-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-28">
                {!isOnDetailsPage ? (
                  <Link href="/" className="block" onClick={handleNavLinkClick}>
                    <img src="/navlogo.png" alt={t("logoAlt")} className="w-full" />
                  </Link>
                ) : (
                  <div className="w-28 mb-5" />
                )}
              </div>

              {/* Language switcher (desktop) */}
              {!hideLangSwitcher && (
                <div className="hidden lg:block">
                  <LangSwitcher setIsMenuOpen={setIsMenuOpen} />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                id="navbarToggler"
                aria-label={t("aria.toggleMenu")}
                className="block lg:hidden px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
                title={t("aria.toggleMenu")}
              >
                <span className="block h-1 w-6  bg-white my-1"></span>
                <span className="block h-1 w-6 bg-white my-1"></span>
                <span className="block h-1 w-6 bg-white my-1"></span>
              </button>

              <nav
                ref={menuRef}
                className={`fixed top-0 left-0 w-full h-screen bg-darkBg transform transition-transform duration-500 ease-in-out lg:relative lg:h-auto lg:w-auto lg:bg-transparent lg:transform-none ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                  } lg:translate-x-0`}
                aria-label={t("aria.mainNav")}
              >
                <div className="flex justify-between items-center p-4 lg:hidden">
                  <div>
                    {/* Language switcher (mobile) */}
                    {!hideLangSwitcher && <LangSwitcher setIsMenuOpen={setIsMenuOpen} />}
                  </div>
                  <button
                    onClick={toggleMenu}
                    aria-label={t("aria.closeMenu")}
                    className="text-orange font-bold text-3xl"
                    title={t("aria.closeMenu")}
                  >
                    ✕
                  </button>
                </div>

                <ul className="flex flex-col items-center justify-center h-2/3 lg:flex-row lg:space-x-8">
                  <li>
                    <Link className="text-white py-2 text-lg font-medium hover:text-orange" href="/" onClick={handleNavLinkClick}>
                      {t("menu.home")}
                    </Link>
                  </li>

                  <li className="relative group">
                    <button
                      onClick={toggleProductDropdown}
                      className="text-white py-2 text-lg font-medium hover:text-orange"
                      aria-expanded={isProductDropdownOpen}
                      aria-haspopup="true"
                    >
                      {t("menu.products")}
                    </button>
                    {isProductDropdownOpen && (
                      <div
                        ref={productDropdownRef}
                        className="absolute left-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-lg z-50"
                      >
                        <ul className="py-2 text-sm text-gray-200">
                          <NavItem href="/products/cards" onClick={handleNavLinkClick}>
                            {t("menu.cards")}
                          </NavItem>
                          <NavItem href="/products/reviews" onClick={handleNavLinkClick}>
                            {t("menu.reviews")}
                          </NavItem>
                          <NavItem href="/products/all" onClick={handleNavLinkClick}>
                            {t("menu.all")}
                          </NavItem>
                        </ul>
                      </div>
                    )}
                  </li>

                  <li>
                    <Link className="text-white py-2 text-lg font-medium hover:text-orange" href="/features" onClick={handleNavLinkClick}>
                      {t("menu.features")}
                    </Link>
                  </li>
                  <li>
                    <Link className="text-white py-2 text-lg font-medium hover:text-orange" href="/askedQuestions" onClick={handleNavLinkClick}>
                      {t("menu.faq")}
                    </Link>
                  </li>
                  <li>
                    <Link className="text-white py-2 text-lg font-medium hover:text-orange" href="/contact" onClick={handleNavLinkClick}>
                      {t("menu.contact")}
                    </Link>
                  </li>

                  {isAuthenticated && (
                    <li>
                      <Link className="text-white py-2 text-lg font-medium hover:text-orange" href="/profile" onClick={handleNavLinkClick}>
                        {t("menu.profile")}
                      </Link>
                    </li>
                  )}

                  {isAuthenticated ? (
                    <li className="relative flex items-center group mt-5 lg:mt-0">
                      {user.image ? (
                        <img
                          onClick={handleDropdownToggle}
                          className="w-20 h-20 rounded-full cursor-pointer border-2 border-orange shadow-md"
                          src={`data:image/jpeg;base64,${user.image}`}
                          alt={t("alt.userAvatar")}
                        />
                      ) : (
                        <div
                          onClick={handleDropdownToggle}
                          className="w-20 h-20 rounded-full cursor-pointer border-2 border-orange shadow-md flex items-center justify-center bg-gray-700 text-white"
                          aria-label={t("alt.userAvatar")}
                          title={t("alt.userAvatar")}
                        />
                      )}

                      {isDropdownOpen && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-80 w-44 bg-gray-800 rounded-lg shadow-lg z-50"
                        >
                          <div className="px-4 py-3 text-sm text-white">
                            <div className="text-orange">{user?.name}</div>
                            <div className="font-medium truncate text-orange">{user?.email}</div>
                          </div>
                          <ul className="py-2 text-sm text-gray-200">
                            <NavItem href="/profile" onClick={handleNavLinkClick}>
                              {t("menu.profile")}
                            </NavItem>
                            <NavItem href="/analyse" onClick={handleNavLinkClick}>
                              {t("menu.analysis")}
                            </NavItem>
                          </ul>
                          <div className="py-1">
                            <button
                              onClick={handleLogout}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-darkOrange"
                            >
                              {t("menu.logout")}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ) : isPhone ? (
                    <div className="flex flex-col items-center justify-center space-y-4 mt-2 lg:mt-0">
                      <Link
                        href="/login"
                        className="px-6 py-3 text-lg font-semibold text-orange border border-orange rounded-full hover:bg-orange hover:text-white"
                        onClick={handleNavLinkClick}
                      >
                        {t("menu.login")}
                      </Link>
                    </div>
                  ) : (
                    <div className="hidden lg:flex items-center ml-5 space-x-2 lg:space-x-3">
                      <Link
                        href="/login"
                        className="px-6 py-3 text-lg font-semibold text-orange border border-orange rounded-full hover:bg-orange hover:text-white"
                        onClick={handleNavLinkClick}
                      >
                        {t("menu.login")}
                      </Link>
                    </div>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <img src="/load.gif" className="w-24 h-24" alt="Loading" />
        </div>
      )}
    </>
  );
};

export default Navbar;
