"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Service {
  id: string;
  title: string;
  type: string;
  description: string;
  active: boolean;
  category: string;
  price?: string;
  items: string[];
  icon?: React.ReactNode;
  link?: string;
  serviceType?: string;
}

interface ServicesContextType {
  services: Service[];
  activeServices: Service[];
  refreshServices: () => Promise<void>;
  loading: boolean;
}

const ServicesContext = createContext<ServicesContextType>({
  services: [],
  activeServices: [],
  refreshServices: async () => {},
  loading: true
});

export const useServices = () => useContext(ServicesContext);

export const ServicesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      
      // Transform services to match the expected format
      const formattedServices = data.services.map((service: any) => ({
        ...service,
        link: `/book?service=${service.type}`,
        serviceType: service.type,
        icon: null // You may want to map icons based on service type
      }));
      
      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  
  // Filter active services
  const activeServices = services.filter(service => service.active);
  
  return (
    <ServicesContext.Provider value={{ 
      services, 
      activeServices, 
      refreshServices: fetchServices,
      loading 
    }}>
      {children}
    </ServicesContext.Provider>
  );
};