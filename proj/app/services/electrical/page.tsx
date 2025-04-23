'use client';

import React from 'react';
import { Zap, Check, Shield, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ElectricalServicePage() {
  const services = [
    'Electrical Installations',
    'Circuit Breaker Replacement',
    'Electrical Repairs',
    'Lighting Installation',
    'Ceiling Fan Installation',
    'Outlet & Switch Repairs',
    'Electrical Safety Inspections',
    'Generator Installation'
  ];

  const whyChooseUs = [
    {
      title: 'Licensed Electricians',
      description: 'Our team consists of licensed professionals with extensive experience in handling all electrical needs.'
    },
    {
      title: 'Safety First',
      description: 'We prioritize safety in every job, following strict protocols to ensure your home and family are protected.'
    },
    {
      title: 'Upfront Pricing',
      description: 'Get clear cost estimates before any work begins, with no hidden fees or surprise charges.'
    },
    {
      title: 'Rapid Response',
      description: 'Quick assistance for all your electrical needs, especially for emergency situations.'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-yellow-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/electrical-pattern.png')] bg-repeat"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Expert Electrical Services</h1>
            <p className="text-xl text-yellow-100 mb-8">
              From minor repairs to major installations, our licensed electricians provide safe, efficient solutions for all your electrical needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book?service=electrical" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
              >
                Book an Electrician
              </Link>
              <Link 
                href="#services" 
                className="bg-white text-yellow-900 py-3 px-8 rounded-md transition-colors font-medium hover:bg-yellow-50"
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
            <h2 className="text-3xl font-bold text-gray-900">Our Electrical Services</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Professional electrical services delivered by certified technicians, ensuring safety and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <Zap className="text-yellow-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/book?service=electrical" 
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
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Electrical Service</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              With our team of expert electricians, you can be confident your electrical systems are in safe, capable hands.
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
      <section className="bg-yellow-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need Electrical Work Done?</h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Don't risk DIY electrical work. Our certified professionals are just a click away.
          </p>
          <Link 
            href="/book?service=electrical" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium inline-block"
          >
            Book an Electrician Today
          </Link>
        </div>
      </section>
    </div>
  );
}