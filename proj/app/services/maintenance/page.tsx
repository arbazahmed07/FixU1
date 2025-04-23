'use client';

import React from 'react';
import { ShieldCheck, Check, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MaintenanceServicePage() {
  const services = [
    'Regular Home Maintenance',
    'Preventive Safety Checks',
    'Seasonal Home Preparation',
    'Appliance Maintenance',
    'Structural Inspections',
    'Weather-proofing',
    'System Efficiency Checks',
    'Maintenance Plans'
  ];

  const whyChooseUs = [
    {
      title: 'Comprehensive Service',
      description: 'We offer complete maintenance solutions that cover every aspect of your home.'
    },
    {
      title: 'Preventive Focus',
      description: 'Our approach emphasizes preventing issues before they become costly problems.'
    },
    {
      title: 'Expert Technicians',
      description: 'Multi-skilled professionals capable of handling diverse maintenance tasks.'
    },
    {
      title: 'Customized Plans',
      description: 'Maintenance schedules tailored to your specific home needs and budget.'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/maintenance-pattern.png')] bg-repeat"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Home Maintenance Services</h1>
            <p className="text-xl text-green-100 mb-8">
              Keep your home in perfect condition with our professional maintenance services. Prevent costly repairs with regular upkeep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book?service=maintenance" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
              >
                Schedule Maintenance
              </Link>
              <Link 
                href="#services" 
                className="bg-white text-green-900 py-3 px-8 rounded-md transition-colors font-medium hover:bg-green-50"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Maintenance Services</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Comprehensive maintenance solutions to keep your home safe, efficient, and in top condition year-round.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <ShieldCheck className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/book?service=maintenance" 
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
            >
              Book Maintenance <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Maintenance Service</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Our proactive approach to home maintenance saves you time, money, and stress in the long run.
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
      <section className="bg-green-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Investment?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Regular maintenance is the key to preserving your home's value and preventing costly emergency repairs.
          </p>
          <Link 
            href="/book?service=maintenance" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}