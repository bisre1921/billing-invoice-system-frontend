import React from 'react';
import { FaCheckCircle, FaShieldAlt, FaRegLightbulb, FaFileInvoiceDollar } from 'react-icons/fa'; // Sophisticated icons

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-gradient-to-br from-white to-[#f1f5f9] py-24 overflow-hidden"
    >
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#c7d2fe] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 z-10 relative">
        
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#6366f1] to-[#4338ca] text-transparent bg-clip-text mb-6 leading-tight">
            Our Vision for Seamless Billing
          </h2>
          <p className="text-lg md:text-xl text-[#334155] mb-6 leading-relaxed">
            Managing your finances shouldn’t feel like a burden. We’ve built a billing system that empowers your workflow – making every transaction smooth, smart, and secure.
          </p>
          <p className="text-lg md:text-xl text-[#334155] mb-10 leading-relaxed">
            From sleek invoices to automated payment flows, our tools help you focus on growing your business without worrying about the back office.
          </p>
        </div>

        <div className="w-full lg:w-1/2">
          <img
            src="/about_section_image.png"
            alt="About Illustration"
            className="w-full h-auto object-contain animate-fade-in"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 text-center">
        <h3 className="text-3xl font-semibold text-[#6366f1] mb-8">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Professional Invoices",
              icon: <FaFileInvoiceDollar size={24} className="text-[#6366f1]" />,
              description: "Create invoices effortlessly with our professional templates."
            },
            {
              title: "Auto Payment Reminders",
              icon: <FaRegLightbulb size={24} className="text-[#f97316]" />,
              description: "Stay on top of payments with automatic reminders."
            },
            {
              title: "Secure Platform",
              icon: <FaShieldAlt size={24} className="text-[#10b981]" />,
              description: "Your data is encrypted and protected by the highest standards."
            },
            {
              title: "User-Friendly Interface",
              icon: <FaCheckCircle size={24} className="text-[#0ea5e9]" />,
              description: "A simple and intuitive interface for smooth navigation."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-4 bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
            >
              <div className="p-4 bg-[#e0e7ff] rounded-full">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1e293b]">{item.title}</h3>
              <p className="text-sm text-center text-[#4b5563]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
