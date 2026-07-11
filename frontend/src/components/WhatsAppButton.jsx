import React, { useContext } from 'react';
import { BrandContext } from '../context/BrandContext';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  const { brand } = useContext(BrandContext);
  const raw = brand?.whatsappNumber || '917769039915';
  const number = raw.replace(/[^0-9+]/g, '');
  const url = `https://wa.me/${number}`;

  return (
    <a
      className="whatsapp-fab"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" role="img">
        <path fill="#fff" d="M20.52 3.48C18.07 1.03 14.7 0 11 0 4.94 0 0 4.94 0 11c0 1.94.5 3.83 1.45 5.48L0 24l7.06-1.85A11.93 11.93 0 0011 22c5.95 0 11-5.05 11-11 0-3.7-.99-7.07-3.48-9.52zM11 20.2c-1.73 0-3.42-.46-4.9-1.33l-.35-.2L3.1 19.4l1.07-2.64-.22-.36A8.93 8.93 0 012.1 11 9 9 0 1111 20.2zM16.85 14.28c-.25-.13-1.48-.73-1.71-.82-.23-.08-.4-.12-.57.12-.17.25-.66.82-.81.99-.15.17-.29.19-.54.07-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.38-.44.12-.15.16-.25.25-.42.08-.17.03-.3-.01-.42-.05-.12-.57-1.37-.78-1.87-.2-.49-.41-.42-.57-.43-.15-.01-.33-.01-.51-.01-.17 0-.45.06-.69.29-.24.24-.92.9-.92 2.2 0 1.29.94 2.54 1.07 2.72.12.17 1.86 2.86 4.51 3.89 3.14 1.24 3.14.83 3.7.78.56-.05 1.83-.75 2.09-1.48.26-.73.26-1.36.18-1.48-.08-.12-.23-.17-.48-.3z" />
      </svg>
    </a>
  );
}
