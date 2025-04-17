import Link from 'next/link';
import { HomeIcon, DocumentDuplicateIcon, UserGroupIcon, CogIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // Example icons
import { usePathname } from 'next/navigation';
import React from 'react';

const NavigationSidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/invoices/all', label: 'Invoices', icon: <DocumentDuplicateIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/customers', label: 'Customers', icon: <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/employees', label: 'Employees', icon: <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <CogIcon className="w-5 h-5 mr-3 text-gray-400" /> },
  ];

  return (
    <aside className="bg-gray-900 text-gray-300 w-64 py-8 px-4 flex flex-col shadow-lg">
      <div className="mb-8 flex items-center justify-center">
        <Link href="/dashboard" className="text-2xl font-bold text-primary-500 block mb-1 tracking-tight">
          Yega Invoice
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition duration-200 ${
                  pathname === link.href ? 'bg-primary-700 font-semibold text-white' : ''
                }`}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 border-t border-gray-800 pt-4">
        <Link href="/logout" className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition duration-200 text-red-400 hover:text-red-300 font-medium text-sm">
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default NavigationSidebar;