'use client';

import React from 'react';
import { Wrench, Check, Clock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PlumbingServicePage() {
  const services = [
    'Leaky Faucet Repair',
    'Toilet Installation & Repair',
    'Pipe Fitting & Repairs',
    'Drain Cleaning',
    'Water Heater Installation',
    'Bathroom Fixture Installation',
    'Water Pressure Issues',
    'Sewer Line Maintenance'
  ];

  const whyChooseUs = [
    {
      title: 'Certified Professionals',
      description: 'All our plumbers are certified, experienced, and background-verified for your safety.'
    },
    {
      title: 'Transparent Pricing',
      description: 'Get clear estimates before work begins with no hidden charges or surprise fees.'
    },
    {
      title: 'Quality Materials',
      description: 'We only use high-quality, durable materials for all plumbing repairs and installations.'
    },
    {
      title: '24/7 Emergency Service',
      description: 'Plumbing emergencies dont wait for convenient hours, and neither do we.'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/plumbing-pattern.png')] bg-repeat"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Professional Plumbing Services</h1>
            <p className="text-xl text-blue-100 mb-8">
              Expert solutions for all your plumbing needs, from minor repairs to major installations. 
              Our certified plumbers deliver quality work, guaranteed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book?service=plumbing" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
              >
                Book a Plumber Now
              </Link>
              <Link 
                href="#services" 
                className="bg-white text-blue-900 py-3 px-8 rounded-md transition-colors font-medium hover:bg-blue-50"
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
            <h2 className="text-3xl font-bold text-gray-900">Our Plumbing Services</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              From fixing leaky faucets to complete bathroom remodeling, our experienced plumbers can handle it all with precision and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Wrench className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/book?service=plumbing" 
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
            >
              Book a Service <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Plumbing Service</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              We pride ourselves on delivering exceptional service with every plumbing job, big or small.
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
      <section className="bg-blue-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Plumber Now?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't let plumbing problems disrupt your home. Our professionals are just a click away.
          </p>
          <Link 
            href="/book?service=plumbing" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium inline-block"
          >
            Schedule a Service
          </Link>
        </div>
      </section>
    </div>
  );
}