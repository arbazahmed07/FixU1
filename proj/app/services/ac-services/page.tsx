'use client';

import React from 'react';
import { Snowflake, Check, ThermometerSnowflake, Wind, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ACServicePage() {
  const services = [
    'AC Installation',
    'AC Repair',
    'Preventive Maintenance',
    'Gas Refilling',
    'Filter Cleaning',
    'Cooling Efficiency Check',
    'Duct Cleaning',
    'AC Replacement'
  ];

  const whyChooseUs = [
    {
      title: 'Certified AC Technicians',
      description: 'Our team consists of trained professionals with expertise in all major AC brands and models.'
    },
    {
      title: 'Prompt Service',
      description: 'Quick response time to ensure your cooling needs are addressed without delay.'
    },
    {
      title: 'Comprehensive Diagnostics',
      description: 'Thorough inspection to identify all potential issues before recommending solutions.'
    },
    {
      title: 'Affordable Maintenance Plans',
      description: 'Regular maintenance packages to keep your AC running efficiently year-round.'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-cyan-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/snowflake-pattern.png')] bg-repeat"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Professional AC Services</h1>
            <p className="text-xl text-cyan-100 mb-8">
              Keep your space cool and comfortable with our expert AC installation, repair, and maintenance services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book?service=ac" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
              >
                Book AC Service
              </Link>
              <Link 
                href="#services" 
                className="bg-white text-cyan-900 py-3 px-8 rounded-md transition-colors font-medium hover:bg-cyan-50"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our AC Services</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              From routine maintenance to emergency repairs, our technicians provide complete solutions for all your air conditioning needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-cyan-100 p-3 rounded-full mr-4">
                    <Snowflake className="text-cyan-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/book?service=ac" 
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
            >
              Schedule Service <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our AC Service</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Our experienced technicians deliver reliable service to ensure your cooling systems operate at peak efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cyan-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">AC Not Working? We Can Help!</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Don't suffer in the heat. Our trained technicians can quickly diagnose and fix any AC problem.
          </p>
          <Link 
            href="/book?service=ac" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium inline-block"
          >
            Book Emergency Service
          </Link>
        </div>
      </section>
    </div>
  );
}