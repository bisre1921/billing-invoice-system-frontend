import React from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-[#F7FAFC] to-[#E2E8F0]">
      <div className="container mx-auto px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0">
        
        <div className="w-full lg:w-1/2 max-w-xl flex justify-center items-center">
          <img
            src="/contact_section_image.svg" 
            alt="Contact Us"
            className="w-full h-auto rounded-3xl shadow-xl object-cover max-h-[500px]" 
          />
        </div>

        <div className="w-full lg:w-1/2 max-w-3xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl font-semibold text-[#1A202C] mb-6 tracking-tight leading-tight">
              Get in Touch with Us
            </h2>
            <p className="text-lg text-[#4A5568]">
              We are here to assist you! Whether you have a question or need assistance, our team is ready to help. Feel free to reach out using the form or contact us directly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-[#1A202C] text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="shadow-md border border-[#CBD5E0] rounded-lg w-full py-4 px-6 text-[#4A5568] focus:ring-2 focus:ring-[#3182CE] focus:border-transparent transition duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-[#1A202C] text-sm font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-md border border-[#CBD5E0] rounded-lg w-full py-4 px-6 text-[#4A5568] focus:ring-2 focus:ring-[#3182CE] focus:border-transparent transition duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-[#1A202C] text-sm font-medium mb-2">Your Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="shadow-md border border-[#CBD5E0] rounded-lg w-full py-4 px-6 text-[#4A5568] focus:ring-2 focus:ring-[#3182CE] focus:border-transparent transition duration-300"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#3182CE] text-white py-3 px-8 rounded-md hover:bg-[#2B6CB0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] transition duration-300 w-full"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#4A5568] text-md">Alternatively, you can contact us directly through:</p>
            <div className="flex justify-center items-center mt-6 space-x-6">
              <div className="flex items-center space-x-2 text-[#3182CE] hover:text-[#2B6CB0] transition duration-300">
                <FaEnvelope size={22} />
                <p className="font-semibold">info@yourcompany.com</p>
              </div>
              <div className="flex items-center space-x-2 text-[#3182CE] hover:text-[#2B6CB0] transition duration-300">
                <FaPhoneAlt size={22} />
                <p className="font-semibold">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
