import React from 'react';

const Companies = () => {
  const companies = [
    { name: 'Innovate Solutions Inc.', logo: '/companies_logo_1.png', testimonial: 'Our productivity has soared since implementing this system. The reporting features are invaluable.' },
    { name: 'GlobalTech Enterprises', logo: '/companies_logo_2.png', testimonial: 'The seamless integration with our other tools has made billing a breeze. Excellent support too!' },
    { name: 'Pioneer Digital Agency', logo: '/companies_logo_3.png', testimonial: 'We handle a large volume of invoices, and this system has proven to be scalable and reliable.' },
  ];

  return (
    <section className="bg-gradient-to-br from-[#f3f4f6] via-[#e2e8f0] to-[#ffffff] py-20">
      <div className="container mx-auto px-6 lg:px-16">
        <h2 className="text-4xl font-extrabold text-[#6366f1] mb-10 text-center">
          Trusted by Leading Organizations Worldwide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              {company.logo && (
                <img
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  className="max-h-20 mx-auto mb-6 object-contain transition-transform duration-300 transform hover:scale-110"
                />
              )}

              <h3 className="text-2xl font-semibold text-[#1e293b] mb-3 text-center">
                {company.name}
              </h3>

              <p className="text-[#475569] text-sm italic text-center">
                "{company.testimonial}"
              </p>

              <div className="flex justify-center mt-6">
                <span className="text-[#f97316] font-semibold text-lg">Trusted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;
