'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  type: string;
  description: string;
  active: boolean;
  category: string;
  price?: string;
  items: string[];
  icon?: React.ReactNode; // For compatibility with existing code
}

interface ServicesContextType {
  services: ServiceItem[];
  activeServices: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  isLoading: boolean;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed property - only active services
  const activeServices = services.filter(service => service.active);

  useEffect(() => {
    // Fetch services from API
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider value={{ services, activeServices, setServices, isLoading }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};