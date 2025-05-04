import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentModalProps {
  isOpen: boolean;
  orderId: string;
  amount: number;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  orderId,
  amount,
  onClose,
  onSuccess,
  customerName,
  customerEmail,
  customerPhone
}) => {
  const router = useRouter();

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      // Save payment information to the server
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({ paymentId }),
      });

      if (response.ok) {
        // Set a flag in session storage to prevent reopening
        sessionStorage.setItem('payment_completed_' + orderId, 'true');
        
        // Call the onSuccess callback
        if (onSuccess) {
          onSuccess(paymentId);
        }

        // Close the modal
        if (onClose) {
          onClose();
        }
      } else {
        console.error('Failed to update payment status');
        // Still close the modal, but don't mark as success
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      // Still close the modal, but don't mark as success
      if (onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (isOpen && sessionStorage.getItem('payment_completed_' + orderId) === 'true') {
      // Payment was already completed, close the modal
      if (onClose) {
        onClose();
      }
    }
  }, [isOpen, orderId, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          // Create Razorpay order
          const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, orderId }),
          });

          if (!response.ok) {
            throw new Error('Failed to create payment order');
          }

          const { order, key } = await response.json();

          // Initialize Razorpay
          const razorpay = new window.Razorpay({
            key,
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            name: 'FixU Services',
            description: 'Payment for service request',
            image: '/logo.png',
            prefill: {
              name: customerName,
              email: customerEmail,
              contact: customerPhone,
            },
            theme: {
              color: '#f97316',
            },
            handler: async function (response: any) {
              try {
                // Verify payment
                const verifyResponse = await fetch('/api/payment', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId
                  }),
                });

                if (!verifyResponse.ok) {
                  throw new Error('Payment verification failed');
                }

                // Call success callback with payment ID
                handlePaymentSuccess(response.razorpay_payment_id);
              } catch (error) {
                console.error('Payment verification error:', error);
                alert('Payment verification failed. Please try again.');
              }
            },
            modal: {
              ondismiss: onClose,
            },
          });

          razorpay.open();
        } catch (error) {
          console.error('Payment initiation error:', error);
          alert('Failed to initialize payment. Please try again.');
          onClose();
        }
      };

      return () => {
        // Re-enable scrolling when component unmounts
        document.body.style.overflow = '';
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen, amount, orderId, onClose, onSuccess, customerName, customerEmail, customerPhone]);

  return null; // Modal is handled by Razorpay
};

export default PaymentModal;
