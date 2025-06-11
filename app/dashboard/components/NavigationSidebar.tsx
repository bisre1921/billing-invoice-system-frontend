import Link from "next/link";
import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import React, { Fragment, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

const NavigationSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5 mr-3 text-gray-400" />,
    },
    {
      href: "/dashboard/invoices/all",
      label: "Invoices",
      icon: <DocumentDuplicateIcon className="w-5 h-5 mr-3 text-gray-400" />,
    },
    {
      href: "/dashboard/customers",
      label: "Customers",
      icon: <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />,
    },
    {
      href: "/dashboard/employees",
      label: "Employees",
      icon: <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" />,
    },
    {
      href: "/dashboard/reports/all",
      label: "Reports",
      icon: <DocumentCheckIcon className="w-5 h-5 mr-3 text-gray-400" />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <CogIcon className="w-5 h-5 mr-3 text-gray-400" />,
    },
  ];

  return (
    <>
      <aside className="bg-gray-900 text-gray-300 w-64 py-8 px-4 flex flex-col shadow-lg">
        <div className="mb-8 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-primary-500 block mb-1 tracking-tight"
          >
            Yegna Invoice
          </Link>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition duration-200 ${
                    pathname === link.href
                      ? "bg-primary-700 font-semibold text-white"
                      : ""
                  }`}
                >
                  {link.icon}
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>{" "}
        <div className="mt-8 border-t border-gray-800 pt-4">
          <button
            onClick={handleLogoutClick}
            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition duration-200 text-red-400 hover:text-red-300 font-medium text-sm w-full text-left"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

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

export default NavigationSidebar;
