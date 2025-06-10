import Link from 'next/link';
import { HomeIcon, DocumentDuplicateIcon, UserGroupIcon, CogIcon, ArrowLeftOnRectangleIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'; // Example icons
import { usePathname } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const NavigationSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/');
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/invoices/all', label: 'Invoices', icon: <DocumentDuplicateIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/customers', label: 'Customers', icon: <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/employees', label: 'Employees', icon: <UserGroupIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/reports/all', label: 'Reports', icon: <DocumentCheckIcon className="w-5 h-5 mr-3 text-gray-400" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <CogIcon className="w-5 h-5 mr-3 text-gray-400" /> },
  ];

  return (
    <aside className="bg-gray-900 text-gray-300 w-64 py-8 px-4 flex flex-col shadow-lg">
      <div className="mb-8 flex items-center justify-center">
        <Link href="/dashboard" className="text-2xl font-bold text-primary-500 block mb-1 tracking-tight">
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
                  pathname === link.href ? 'bg-primary-700 font-semibold text-white' : ''
                }`}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>      <div className="mt-8 border-t border-gray-800 pt-4">
        <button 
          onClick={handleLogout}
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition duration-200 text-red-400 hover:text-red-300 font-medium text-sm w-full text-left"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default NavigationSidebar;