import Link from 'next/link'
import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1e293b] to-[#334155] py-16 text-center text-[#cbd5e1]">
      <div className="container mx-auto px-8">
        <div className="space-y-6">
          {/* Links Section */}
          <div className="flex justify-center space-x-6">
            <p className="text-lg font-medium">
              <Link href="/privacy" className="hover:text-[#f1f5f9] transition duration-300 ease-in-out">Privacy Policy</Link>
            </p>
            <p className="text-lg font-medium">
              <Link href="/terms" className="hover:text-[#f1f5f9] transition duration-300 ease-in-out">Terms of Service</Link>
            </p>
          </div>

          {/* Copyright Text */}
          <p className="text-sm font-light text-neutral-400 mt-4">
            &copy; {new Date().getFullYear()} Your Billing System. All rights reserved.
          </p>

          {/* Social Media Icons */}
          <div className="mt-6 flex justify-center space-x-6 text-2xl">
            <Link href="https://www.facebook.com" target="_blank" className="text-neutral-300 hover:text-[#f1f5f9] transition duration-300 ease-in-out">
              <FaFacebookF />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="text-neutral-300 hover:text-[#f1f5f9] transition duration-300 ease-in-out">
              <FaTwitter />
            </Link>
            <Link href="https://www.instagram.com" target="_blank" className="text-neutral-300 hover:text-[#f1f5f9] transition duration-300 ease-in-out">
              <FaInstagram />
            </Link>
            <Link href="https://www.linkedin.com" target="_blank" className="text-neutral-300 hover:text-[#f1f5f9] transition duration-300 ease-in-out">
              <FaLinkedinIn />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
