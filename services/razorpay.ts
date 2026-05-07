const RAZORPAY_KEY_ID = 'rzp_live_Wh4xEHePkQXqRO';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => any;
  }
}

export const openRazorpayCheckout = ({
  amount,
  courseIds,
  userPhone,
  userEmail,
  onSuccess,
  onCancel,
  onError
}: {
  amount: number;
  courseIds: string[];
  userPhone: string;
  userEmail: string;
  onSuccess: (paymentId: string) => void;
  onCancel?: () => void;
  onError: (error: any) => void;
}) => {
  if (!window.Razorpay) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    onError('SDK_NOT_LOADED');
    return;
  }

  try {
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      name: "Avada Design",
      description: `${courseIds.length} Course${courseIds.length > 1 ? 's' : ''} — All Access Bundle`,
      handler: function (response: any) {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        email: userEmail,
        contact: userPhone
      },
      theme: {
        color: "#2563eb"
      },
      modal: {
        ondismiss: function () {
          if (onCancel) onCancel();
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error("Razorpay Integration Error:", error);
    onError(error);
  }
};
