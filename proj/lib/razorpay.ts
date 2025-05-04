import Razorpay from 'razorpay';

// Initialize Razorpay with your key id and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_test_key_secret',
});

export const createRazorpayOrder = async (amount: number, receipt: string) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export default razorpay;
