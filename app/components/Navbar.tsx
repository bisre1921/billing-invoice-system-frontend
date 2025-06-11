'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { HiMenu, HiX, HiUserCircle } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { getUser } from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const { isAuthenticated, userInfo, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const fetchUserName = async () => {
    if (!userInfo?.user_id) return;
    try {
      const response = await getUser(userInfo.user_id);
      setUserName(response.data.user.name);
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchUserName();
    }
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    router.push("/")
  };

  const baseClasses = "transition duration-300 font-medium ";
  const btnClass = "py-2.5 px-5 rounded-md text-center block";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-[#e2e8f0]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#565ee0]">
          Yegna Invoice
        </Link>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-3xl text-[#565ee0] focus:outline-none"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        <div className="hidden lg:flex items-center space-x-8">
          <Link href="#hero" className={`${baseClasses} hover:text-[#6366f1]`}>
            Home
          </Link>
          <Link href="#about" className={`${baseClasses} hover:text-[#6366f1]`}>
            About
          </Link>
          <Link href="#companies" className={`${baseClasses} hover:text-[#6366f1]`}>
            Companies
          </Link>
          <Link href="#contact" className={`${baseClasses} hover:text-[#6366f1]`}>
            Contact
          </Link>

          {isAuthenticated && userInfo?.email ? (
            <div className="flex items-center space-x-3">
              <Link href="/profile" className={`bg-[#565ee0] text-white flex gap-2 ${btnClass} cursor-pointer`}>
                <HiUserCircle className="text-2xl" /> {userName}
              </Link>
              <button
                onClick={handleLogout}
                className={`bg-red-500 text-white hover:bg-red-600 ${btnClass}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/LoginUser"
                className={`bg-[#6366f1] text-white hover:bg-[#565ee0] ${btnClass}`}
              >
                Login
              </Link>
              <Link
                href="/auth/RegisterUser"
                className={`bg-[#f97316] text-white hover:bg-[#ea580c] ${btnClass}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden px-6 pb-4 space-y-4 bg-white shadow-md">
          <Link href="#hero" className={`${baseClasses} block text-lg py-2`}>
            Home
          </Link>
          <Link href="#about" className={`${baseClasses} block text-lg py-2`}>
            About
          </Link>
          <Link href="#companies" className={`${baseClasses} block text-lg py-2`}>
            Companies
          </Link>
          <Link href="#contact" className={`${baseClasses} block text-lg py-2`}>
            Contact
          </Link>

          {isAuthenticated && userInfo?.email ? (
            <div className="flex flex-col items-start space-y-3">
              <Link href="/profile" className={`bg-[#565ee0] text-white flex gap-2 ${btnClass} cursor-pointer`}>
                <HiUserCircle className="text-2xl" /> {userName}
              </Link>
              <button
                onClick={handleLogout}
                className={`bg-red-500 text-white hover:bg-red-600 ${btnClass}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/LoginUser"
                className={`bg-[#6366f1] text-white hover:bg-[#565ee0] ${btnClass}`}
              >
                Login
              </Link>
              <Link
                href="/auth/RegisterUser"
                className={`bg-[#f97316] text-white hover:bg-[#ea580c] ${btnClass}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
