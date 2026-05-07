import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    visible?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ visible = true }) => {
    if (!visible) return null;
    const phoneNumber = '919198747810';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi, I have a question about the design courses.`;

    const handleWhatsAppClick = () => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Contact');
        }
    };

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-50 group"
            aria-label="Chat on WhatsApp"
        >
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                Need help? Chat with us
            </span>

            {/* Pulse effect */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></span>

            {/* Main button */}
            <div className="relative bg-[#25D366] text-white p-3 md:p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
                <svg 
                    viewBox="0 0 24 24" 
                    className="w-7 h-7 md:w-8 md:h-8 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 7.604c-1.615 0-3.197-.435-4.582-1.259l-.33-.196-3.41.893.908-3.32-.215-.341c-.904-1.438-1.383-3.099-1.383-4.808 0-5.11 4.156-9.266 9.27-9.266 2.479 0 4.808.965 6.558 2.717 1.75 1.751 2.714 4.08 2.714 6.55 0 5.111-4.157 9.267-9.27 9.267M24.066 1.64C21.439-0.988 17.948-2.433 14.187-2.433c-7.85 0-14.238 6.388-14.238 14.238 0 2.51.655 4.96 1.9 7.126l-2.022 7.382 7.553-1.981c2.096 1.144 4.464 1.748 6.877 1.748 7.854 0 14.242-6.388 14.242-14.238 0-3.766-1.465-7.307-4.092-9.933" />
                </svg>

                {/* Unread dot */}
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
            </div>
        </a>
    );
};
