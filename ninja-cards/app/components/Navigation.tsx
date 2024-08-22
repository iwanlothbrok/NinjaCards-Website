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
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPhone, setIsPhone] = useState(false);

  const pathname = usePathname();
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkIfPhone = () => {
      setIsPhone(window.innerWidth <= 768);
    };

    // Initial check
    checkIfPhone();

    // Listen for window resize
    window.addEventListener('resize', checkIfPhone);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIfPhone);
    };
  }, []);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when the menu is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when the menu is closed
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
        toggleMenu();
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the menu if clicking outside of it
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isOpen]);

  const handleLogout = useCallback(() => {
    logout();
    setIsDropdownOpen(false);
    toggleMenu();
  }, [logout]);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isPhone) {
      toggleMenu();
    }
  };
  const handleDropdownImgClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 z-40 w-full transition-all duration-500 ${scrolled ? 'bg-darkBg shadow-md' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative flex items-center justify-between py-4 lg:py-6">
          <div className="flex-shrink-0">
            <Link href="/" className="block w-24">
              <img src="/navLogo.png" alt="logo" className="w-full" />
            </Link>
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
              className={`fixed top-0 left-0 w-full h-screen bg-darkBg transform transition-transform duration-500 ease-in-out lg:relative lg:h-auto lg:w-auto lg:bg-transparent lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
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
                {[
                  '/',
                  '/about',
                  '/pricing',
                  '/team',
                  '/contact',
                  '/askedQuestions',
                ].map((path, idx) => (
                  <li key={idx} className="relative group">
                    <Link
                      href={path}
                      className={`flex py-2 text-lg font-medium text-white lg:inline-flex group-hover:text-orange transition-colors duration-300 ${pathname === path ? 'text-orange' : ''
                        }`}
                      onClick={() => setIsOpen(false)} // Close menu when link is clicked
                    >
                      {
                        path
                          .slice(1) // Remove the leading '/'
                          .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
                          .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first character
                      }

                      {/* {path.charAt(1).toUpperCase() + path.slice(2)} */}
                    </Link>
                  </li>
                ))}
                {isAuthenticated ? (
                  <li className="relative flex items-center group mt-5 lg:mt-0">
                    <img
                      onClick={handleDropdownImgClick}
                      className="w-20 h-20 rounded-full cursor-pointer border-2 border-orange shadow-md"
                      src={
                        user?.image
                          ? `data:image/jpeg;base64,${user.image}`
                          : 'https://tecdn.b-cdn.net/img/new/avatars/2.webp'
                      }
                      alt="User avatar"
                    />
                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-80 w-44  bg-darkesBg rounded-lg shadow-lg z-50"
                      >
                        {/* <div id="userDropdown" className="absolute  right-0 mt-2rounded-lg shadow-lg bg-darkesBg divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600"> */}

                        <div className="px-4 py-3 text-sm text-white">
                          <div className="text-orange">{user?.name}</div>
                          <div className="font-medium truncate text-orange">
                            {user?.email}
                          </div>
                        </div>
                        <ul className="py-2 text-sm text-gray-200">
                          <NavItem
                            href="/dashboard"
                            onClick={handleDropdownClick}
                          >
                            Dashboard
                          </NavItem>
                          <NavItem
                            href="/profile"
                            onClick={handleDropdownClick}
                          >
                            Profile
                          </NavItem>
                          <NavItem
                            href="/earnings"
                            onClick={handleDropdownClick}
                          >
                            Earnings
                          </NavItem>
                        </ul>
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-darkOrange"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ) : isPhone ? (
                  <div className="flex flex-col items-center justify-center space-y-4 mt-2 lg:mt-0">
                    {/* <div className="hidden lg:flex items-center ml-5 space-x-2 lg:space-x-3"> */}

                    <Link
                      href="/register"
                      className="px-6 py-3 text-lg font-semibold text-white bg-orange rounded-full transition-all duration-300 hover:bg-darkOrange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={() => setIsOpen(false)}
                    >
                      {/* className="px-6 py-2 text-lg font-semibold text-white bg-orange rounded-full transition-all duration-300 hover:bg-darkOrange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange" */}
                      Register
                    </Link>
                    <Link
                      href="/login"
                      className="px-6 py-3 text-lg font-semibold text-orange bg-transparent border border-orange rounded-full transition-all duration-300 hover:bg-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center ml-5 space-x-2 lg:space-x-3">
                    <Link
                      href="/register"
                      className="px-6 py-3 text-lg font-semibold text-white bg-orange rounded-full transition-all duration-300 hover:bg-darkOrange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={() => setIsOpen(true)}
                    >
                      {/* className="px-6 py-2 text-lg font-semibold text-white bg-orange rounded-full transition-all duration-300 hover:bg-darkOrange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange" */}
                      Register
                    </Link>
                    <Link
                      href="/login"
                      className="px-6 py-3 text-lg font-semibold text-orange bg-transparent border border-orange rounded-full transition-all duration-300 hover:bg-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                      onClick={() => setIsOpen(true)}
                    >
                      Login
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
