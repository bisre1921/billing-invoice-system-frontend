import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-[#f1f5f9] to-white py-24">
      <div className="container mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        <div className="w-full lg:w-1/2">
          <img
            src="/hero_section_image.svg"
            alt="Billing System Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4341d0] mb-6 leading-tight">
            The Ultimate Platform for Effortless Billing & Invoicing
          </h1>
          <p className="text-lg md:text-xl text-[#ea580c] mb-8">
            Empower your business with our intuitive and robust billing and invoice system. Designed for efficiency and growth.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-6">
            <Link
              href="/auth/LoginUser"
              className="bg-[#6366f1] text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-[#565ee0] transition duration-300 shadow-md"
            >
              Login
            </Link>
            <Link
              href="/auth/RegisterUser"
              className="bg-[#f97316] text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-[#ea580c] transition duration-300 shadow-md"
            >
              Register
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Hero;
