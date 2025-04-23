  'use client';

import React from 'react';
import { Home, Check, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeCareServicePage() {
  const services = [
    'Deep Cleaning Services',
    'Carpet & Upholstery Cleaning',
    'Window Cleaning',
    'Sanitization Services',
    'Kitchen Deep Cleaning',
    'Bathroom Sanitization',
    'Move-in/Move-out Cleaning',
    'Post-construction Cleaning'
  ];

  const whyChooseUs = [
    {
      title: 'Trained Cleaning Professionals',
      description: 'Our staff is thoroughly trained in modern cleaning techniques and safety protocols.'
    },
    {
      title: 'Eco-friendly Options',
      description: 'We offer green cleaning solutions that are safe for your family, pets, and the environment.'
    },
    {
      title: 'Customized Cleaning Plans',
      description: 'Services tailored to your specific needs, schedule, and budget requirements.'
    },
    {
      title: 'Reliable & Consistent',
      description: 'Count on us to deliver the same high standard of cleanliness with every visit.'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/cleaning-pattern.png')] bg-repeat"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Professional Home Care Services</h1>
            <p className="text-xl text-indigo-100 mb-8">
              Transform your living space with our comprehensive cleaning and home care services. Experience the joy of coming home to a spotless environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book?service=home-care" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium"
              >
                Book a Cleaning
              </Link>
              <Link 
                href="#services" 
                className="bg-white text-indigo-900 py-3 px-8 rounded-md transition-colors font-medium hover:bg-indigo-50"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Home Care Services</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              From routine cleaning to specialized sanitization, we keep your home fresh, clean, and healthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Home className="text-indigo-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{service}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/book?service=home-care" 
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
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Home Care Service</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Our professional approach to home care ensures your space is not just clean, but healthy and welcoming.
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
      <section className="bg-indigo-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for a Cleaner Home?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Let our professionals handle the cleaning while you focus on what matters most to you.
          </p>
          <Link 
            href="/book?service=home-care" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md transition-colors font-medium inline-block"
          >
            Book Home Care Service
          </Link>
        </div>
      </section>
    </div>
  );
}