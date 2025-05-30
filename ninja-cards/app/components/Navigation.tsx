'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
  href: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  onClick,
  children,
  className,
}) => (
  <li>
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 hover:bg-darkOrange ${className || ''}`}
    >
      {children}
    </Link>
  </li>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isOnDetailsPage, setIsOnDetailsPage] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null); // Separate ref for the product dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAuthenticated = !!user;

  const toggleProductDropdown = useCallback(() => {
    setIsProductDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsPhone(window.innerWidth <= 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProductDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isDropdownOpen || isMenuOpen || isProductDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMenuOpen, isProductDropdownOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) {
      setIsDropdownOpen(false);
      setIsProductDropdownOpen(false); // Close product dropdown when menu is toggled
    }
  }, [isMenuOpen]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
    if (isPhone && !isDropdownOpen) {
      setIsMenuOpen(true);
    }
  }, [isPhone, isDropdownOpen]);

  const handleDropdownItemClick = useCallback(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    handleDropdownItemClick();
  }, [logout, handleDropdownItemClick]);

  useEffect(() => {
    if (pathname?.includes('profileDetails')) {
      setIsOnDetailsPage(true);
    } else {
      setIsOnDetailsPage(false);
    }
  }, [pathname]);

  return (
    <header
      className={`fixed ${isOnDetailsPage && isPhone ? 'top-16' : 'top-0'}  left-0 z-40 w-full transition-all duration-500 ${isScrolled
        ? 'bg-gradient-to-b !top-0 from-gray-900 via-gray-950 to-black shadow-md'
        : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative flex items-center justify-between py-3 lg:py-5">
          <div className="flex-shrink-0 w-28">
            {!isOnDetailsPage ? (
              <Link href="/" className="block">
                <img src="/navlogo.png" alt="logo" className="w-full" />
              </Link>
            ) : (
              <div className="w-28 mb-5"></div>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              id="navbarToggler"
              aria-label="Toggle Menu"
              className="block lg:hidden px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            >
              <span className="block h-1 w-6 bg-white my-1 transition-transform duration-300 transform origin-center"></span>
              <span className="block h-1 w-6 bg-white my-1 transition-transform duration-300 transform origin-center"></span>
              <span className="block h-1 w-6 bg-white my-1 transition-transform duration-300 transform origin-center"></span>
            </button>
            <nav
              ref={menuRef}
              className={`fixed top-0 left-0 w-full h-screen bg-darkBg transform transition-transform duration-500 ease-in-out lg:relative lg:h-auto lg:w-auto lg:bg-transparent lg:transform-none ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
              <div className="flex justify-end p-2 lg:hidden">
                <button
                  onClick={toggleMenu}
                  aria-label="Close Menu"
                  className="text-orange font-bold text-3xl"
                >
                  ✕
                </button>
              </div>
              <ul className="flex flex-col items-center justify-center h-2/3 lg:flex-row lg:space-x-8">
                <li className="relative group">
                  <Link
                    href="/"
                    className={`flex py-2 text-lg font-medium text-white lg:inline-flex group-hover:text-orange transition-colors duration-300 ${pathname === '/' ? 'text-orange' : ''
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Начало
                  </Link>
                </li>
                <li className="relative group">
                  <button
                    onClick={toggleProductDropdown}
                    className="text-white py-2 text-lg font-medium hover:text-orange"
                  >
                    Продукти
                  </button>
                  {isProductDropdownOpen && (
                    <div
                      ref={productDropdownRef}
                      className="absolute left-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-lg z-50"
                    >
                      <ul className="py-2 text-sm text-gray-200">
                        <NavItem
                          href="/products/cards"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Визитки
                        </NavItem>
                        <NavItem
                          href="/products/reviews"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Ревюта
                        </NavItem>
                        <NavItem
                          href="/products/all"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Всички
                        </NavItem>
                      </ul>
                    </div>
                  )}
                </li>
                <li className="relative group">
                  <Link
                    href="/features"
                    className={`flex py-2 text-lg font-medium text-white lg:inline-flex group-hover:text-orange transition-colors duration-300 ${pathname === '/features' ? 'text-orange' : ''
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Функции
                  </Link>
                </li>
                <li className="relative group">
                  <Link
                    href="/askedQuestions"
                    className={`flex py-2 text-lg font-medium text-white lg:inline-flex group-hover:text-orange transition-colors duration-300 ${pathname === '/askedQuestions' ? 'text-orange' : ''
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Задавани Въпроси
                  </Link>
                </li>
                <li className="relative group">
                  <Link
                    href="/contact"
                    className={`flex py-2 text-lg font-medium text-white lg:inline-flex group-hover:text-orange transition-colors duration-300 ${pathname === '/contact' ? 'text-orange' : ''
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Контакт
                  </Link>
                </li>
                {isAuthenticated && (
                  <li className="relative group">
                  <Link
                    href="/profile"
                    className={`flex py-2 text-lg font-medium text-white lg:inline-flex group-hover:text-orange transition-colors duration-300 ${pathname === '/profile' ? 'text-orange' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Профил
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
                        alt="User avatar"
                      />
                    ) : (
                      <div
                        onClick={handleDropdownToggle}
                        className="w-20 h-20 rounded-full cursor-pointer border-2 border-orange shadow-md flex items-center justify-center bg-gray-700 text-white"
                      >
                      </div>
                    )}
                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-80 w-44 bg-gray-800 rounded-lg shadow-lg z-50"
                      >
                        <div className="px-4 py-3 text-sm text-white">
                          <div className="text-orange">{user?.name}</div>
                          <div className="font-medium truncate text-orange">
                            {user?.email}
                          </div>
                        </div>
                        <ul className="py-2 text-sm text-gray-200">
                          <NavItem
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Профил
                          </NavItem>
                          <NavItem
                            href="/analyse"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Анализ
                          </NavItem>
                        </ul>
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-darkOrange"
                          >
                            Изход
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ) : isPhone ? (
                  <div className="flex flex-col items-center justify-center space-y-4 mt-2 lg:mt-0">
                    <Link
                      href="/login"
                      className="px-6 py-3 text-lg font-semibold text-orange bg-transparent border border-orange rounded-full transition-all duration-300 hover:bg-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Логин
                    </Link>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center ml-5 space-x-2 lg:space-x-3">
                    <Link
                      href="/login"
                      className="px-6 py-3 text-lg font-semibold text-orange bg-transparent border border-orange rounded-full transition-all duration-300 hover:bg-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={() => setIsMenuOpen(true)}
                    >
                      Логин
                    </Link>
                  </div>
                )}

              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
