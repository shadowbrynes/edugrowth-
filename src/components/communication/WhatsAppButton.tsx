import React from 'react';
import { apiRequest } from '../../services/api';

interface WhatsAppButtonProps {
  teacherName: string;
  whatsappNumber: string;
  studentName?: string;
  className?: string;
  teacherId?: number;
  customMessage?: string;
  classNameCustom?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  teacherName,
  whatsappNumber,
  studentName = 'John Doe',
  className = 'SS3 Science',
  teacherId = 1,
  customMessage,
  classNameCustom = ''
}) => {
  const cleanNumber = (whatsappNumber || '2348022334455').replace(/[^0-9]/g, '');

  const defaultMessage =
    customMessage ||
    `Hello ${teacherName},\n\nI am the parent of ${studentName} from ${className}.\n\nI would like to discuss my child's academic progress.`;

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Log communication event
    try {
      await apiRequest('/communication/log', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: teacherId,
          communicationType: 'whatsapp'
        })
      });
    } catch (e) {
      // Ignore network errors on logging
    }

    const encodedText = encodeURIComponent(defaultMessage);
    const url = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className={`px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${classNameCustom}`}
      title={`Chat with ${teacherName} on WhatsApp`}
    >
      <span className="material-symbols-outlined text-base">chat</span>
      <span>WhatsApp</span>
    </button>
  );
};

export default WhatsAppButton;
