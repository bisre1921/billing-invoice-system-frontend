'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-[#e2e8f0]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link href="/" className="text-2xl font-bold text-[#565ee0]">
          Billing System
        </Link>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-3xl text-[#565ee0] focus:outline-none"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        <div className="hidden lg:flex items-center space-x-8">
          <NavLinks />
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden px-6 pb-4 space-y-4 bg-white shadow-md">
          <NavLinks mobile />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const baseClasses = "transition duration-300 font-medium";
  const linkClass = mobile ? 'block text-lg' : 'hover:text-[#6366f1]';
  const btnClass = "py-2.5 px-5 rounded-md text-center block";

  return (
    <>
      <Link href="#hero" className={`${baseClasses} ${linkClass}`}>
        Home
      </Link>
      <Link href="#about" className={`${baseClasses} ${linkClass}`}>
        About
      </Link>
      <Link href="#companies" className={`${baseClasses} ${linkClass}`}>
        Companies
      </Link>
      <Link href="#contact" className={`${baseClasses} ${linkClass}`}>
        Contact
      </Link>
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
  );
};

export default Navbar;
