"use client";

import Link from "next/link";
import React, { useEffect, useState, Fragment } from "react";
import { HiMenu, HiX, HiUserCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { getUser } from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { Dialog, Transition } from "@headlessui/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutDialog(false);
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const baseClasses = "transition duration-300 font-medium ";
  const btnClass = "py-2.5 px-5 rounded-md text-center block";

  return (
    <>
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
            <Link
              href="#hero"
              className={`${baseClasses} hover:text-[#6366f1]`}
            >
              Home
            </Link>
            <Link
              href="#about"
              className={`${baseClasses} hover:text-[#6366f1]`}
            >
              About
            </Link>
            <Link
              href="#companies"
              className={`${baseClasses} hover:text-[#6366f1]`}
            >
              Companies
            </Link>
            <Link
              href="#contact"
              className={`${baseClasses} hover:text-[#6366f1]`}
            >
              Contact
            </Link>

            {isAuthenticated && userInfo?.email ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className={`bg-[#565ee0] text-white flex gap-2 ${btnClass} cursor-pointer`}
                >
                  <HiUserCircle className="text-2xl" /> {userName}
                </Link>
                <button
                  onClick={handleLogoutClick}
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
            <Link
              href="#companies"
              className={`${baseClasses} block text-lg py-2`}
            >
              Companies
            </Link>
            <Link
              href="#contact"
              className={`${baseClasses} block text-lg py-2`}
            >
              Contact
            </Link>

            {isAuthenticated && userInfo?.email ? (
              <div className="flex flex-col items-start space-y-3">
                <Link
                  href="/profile"
                  className={`bg-[#565ee0] text-white flex gap-2 ${btnClass} cursor-pointer`}
                >
                  <HiUserCircle className="text-2xl" /> {userName}
                </Link>
                <button
                  onClick={handleLogoutClick}
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

      <Transition appear show={showLogoutDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleLogoutCancel}>
          {" "}          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/25" aria-hidden="true" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Logout
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to log out? You will need to sign in
                      again to access your account.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleLogoutConfirm}
                    >
                      Yes, Logout
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={handleLogoutCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Navbar;
