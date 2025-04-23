'use client';

import React from 'react';
import { MonitorSmartphone, Check, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ElectronicsServicePage() {
  const services = [
    'TV Repair & Installation',
    'Computer & Laptop Repair',
    'Smartphone Repair',
    'Smart Home Setup',
    'Audio Equipment Setup',
    'Gaming Console Repair',
    'Printer & Scanner Repair',
    'Network Troubleshooting'
  ];

  const whyChooseUs = [
    {
      title: 'Tech Specialists',
      description: 'Our technicians are skilled in repairing and servicing all major brands and models of electronic devices.'
    },
    {
      title: 'Quick Turnaround',
      description: 'Most repairs are completed on the same day or within 24-48 hours for complex issues.'
    },
    {
      title: 'Warranty on Service',
      description: 'All our repair services come with a warranty for your peace of mind.'
    },
    {
      title: 'Genuine Parts',
      description: 'We only use authentic replacement parts from trusted suppliers.'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/circuit-pattern.png')] bg-repeat"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Electronics Repair & Services</h1>
            <p className="text-xl text-gray-300 mb-8">
              Expert repair and maintenance for all your electronic devices. Our technicians fix everything from smartphones to home entertainment systems.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book?service=electronics" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
              >
                Book a Tech Now
              </Link>
              <Link 
                href="#services" 
                className="bg-white text-gray-900 py-3 px-8 rounded-md transition-colors font-medium hover:bg-gray-100"
              >
                See All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Electronics Services</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              From smartphones to smart homes, our technicians have the expertise to repair, install, and optimize your electronic devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <MonitorSmartphone className="text-purple-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/book?service=electronics" 
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
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Electronics Service</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Our tech specialists provide reliable, efficient solutions to keep your electronics working perfectly.
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
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Having Device Troubles?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't let technology problems slow you down. Our experts can diagnose and fix your issues quickly.
          </p>
          <Link 
            href="/book?service=electronics" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium inline-block"
          >
            Schedule a Repair
          </Link>
        </div>
      </section>
    </div>
  );
}