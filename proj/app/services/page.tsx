"use client"

import React, { useState, useEffect } from 'react';
import { Monitor, Megaphone, Heart, Briefcase, ArrowRight, ChevronUp, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../contexts/ServicesContext';
import { useRouter } from 'next/navigation';

interface Service {
  icon: React.ReactNode;
  title: string;
  items: string[];
  link: string;
  serviceType: string;
}

const ServicesSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { user, token, isAuthenticated } = useAuth();
  const { activeServices } = useServices(); // Use the active services from context
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
    agreeToTerms: false,
    selectedItem: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // Update form data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phoneNumber: user.phone || prev.phoneNumber
      }));
    }
  }, [isAuthenticated, user]);

  const handleBookService = (service: any) => {
    // Ensure service has the required fields for the Service interface
    const completeService: Service = {
      ...service,
      link: service.link || '#',
      serviceType: service.serviceType || service.title?.toLowerCase() || 'general'
    };
    setSelectedService(completeService);
    setIsModalOpen(true);
    // Reset errors and submit status when opening modal
    setErrors({});
    setSubmitStatus(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setErrors({});
    setSubmitStatus(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error for this field when it's edited
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.selectedItem) {
      newErrors.selectedItem = 'Please select a specific service';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginRedirect = () => {
    router.push(`/login?from=/services`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated first
    if (!isAuthenticated || !token) {
      setSubmitStatus({
        success: false,
        message: 'Please log in to submit a service request.',
      });
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Debug log for token
      console.log("Using token for request:", token.substring(0, 20) + "...");
      
      // 1. Send the email notification
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          serviceType: selectedService?.serviceType || "general",
          specificService: formData.selectedItem
        }),
      });
      
      if (!emailResponse.ok) {
        const emailErrorText = await emailResponse.text();
        console.error("Email API error:", emailErrorText);
        throw new Error('Failed to send email notification');
      }

      // 2. Create order in database
      const orderData = {
        serviceName: selectedService?.title || 'General Service',
        specificService: formData.selectedItem,
        serviceProvider: "FixU Service Provider",
        status: 'pending',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        price: Math.floor(Math.random() * 2000) + 500,
        address: formData.message,
        customerName: formData.fullName,
        customerPhone: formData.phoneNumber,
        customerEmail: formData.email,
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("API error details:", {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          errorBody: errorText
        });
        throw new Error(`API error: ${orderResponse.status} - ${errorText || 'Unknown error'}`);
      }

      setSubmitStatus({
        success: true,
        message: 'Your service request has been submitted successfully! We will contact you soon.',
      });
      
      // Reset form on successful submission
      setFormData({
        fullName: user?.name || '',
        phoneNumber: user?.phone || '',
        email: user?.email || '',
        message: '',
        agreeToTerms: false,
        selectedItem: ''
      });

      // Close modal after a short delay
      setTimeout(() => {
        closeModal();
        // Redirect to profile page after modal closes
        router.push('/profile');
      }, 2000);
      
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Services</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Professional services delivered by experts across India. Find what you need, when you need it.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Use activeServices instead of hardcoded services array */}
          {activeServices.length > 0 ? activeServices.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {service.icon || <Monitor className="text-orange-500" size={28} />}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>

              <ul className="space-y-3 mb-8">
                {service.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleBookService(service)}
                className="inline-flex items-center text-orange-500 font-medium hover:text-orange-600 transition-colors"
              >
                Book Service <ArrowRight size={18} className="ml-1" />
              </button>
            </div>
          )) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-xl text-gray-600">No active services available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedService.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {!isAuthenticated ? (
                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                  <h3 className="text-xl font-semibold mb-4">Login Required</h3>
                  <p className="text-gray-700 mb-6">
                    Please log in to submit a service request. Creating an account helps you track your service history and get personalized recommendations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleLoginRedirect}
                      className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md transition-colors"
                    >
                      Login to Continue
                    </button>
                    <button
                      onClick={() => router.push('/register?from=/services')}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {submitStatus && (
                    <div className={`p-4 mb-6 rounded-md ${
                      submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Service selection dropdown - Fixed styling */}
                    <div className="mb-6">
                      <label htmlFor="selectedItem" className="block mb-2 text-gray-800 font-medium">
                        Select Specific Service
                      </label>
                      <div className={`relative rounded-md ${
                        errors.selectedItem ? 'ring-2 ring-red-500' : ''
                      }`}>
                        <select
                          id="selectedItem"
                          name="selectedItem"
                          value={formData.selectedItem}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 appearance-none border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                          required
                        >
                          <option value="">-- Select a service --</option>
                          {selectedService.items.map((item, idx) => (
                            <option key={idx} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
              
                        </div>
                      </div>
                      {errors.selectedItem && (
                        <p className="text-red-500 text-sm mt-1">{errors.selectedItem}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="fullName" className="block mb-2 text-gray-800 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`w-full px-4 py-3 border ${
                          errors.fullName ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block mb-2 text-gray-800 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        className={`w-full px-4 py-3 border ${
                          errors.phoneNumber ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block mb-2 text-gray-800 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`w-full px-4 py-3 border ${
                          errors.email ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        readOnly
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="message" className="block mb-2 text-gray-800 font-medium">
                        Address
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Provide clear address"
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          className={`mr-2 h-5 w-5 ${errors.agreeToTerms ? 'ring-2 ring-red-500' : ''}`}
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          required
                        />
                        <span className="text-gray-800">
                          I agree to the{' '}
                          <a
                            href="#"
                            className="text-orange-500 hover:underline"
                          >
                            Terms & Conditions
                          </a>
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </section>
  );
};

export default ServicesSection;