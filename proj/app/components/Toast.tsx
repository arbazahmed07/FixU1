'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onCloseAction: () => void;
}

export function Toast({ message, type, duration = 3000, onCloseAction }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseAction();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onCloseAction]);

  const icon = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <AlertCircle className="text-blue-500" size={20} />,
  };

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md animate-fade-in shadow-lg rounded-lg px-4 py-3 ${bgColor[type]} border flex items-center`}>
      <div className="mr-2">{icon[type]}</div>
      <p className="flex-grow text-sm">{message}</p>
      <button onClick={onCloseAction} className="ml-4 text-gray-500 hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  );
}