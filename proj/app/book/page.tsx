"use client"
import React, { useEffect } from 'react';
import ServiceForm from "../components/ServiceForm";
import { useServices } from "../../contexts/ServicesContext";

const Book: React.FC = () => {
  const { refreshServices } = useServices();
  
  // Ensure we have the latest services when navigating to this page
  useEffect(() => {
    refreshServices();
  }, []);
  
  return (
    <ServiceForm />
  );
}

export default Book;