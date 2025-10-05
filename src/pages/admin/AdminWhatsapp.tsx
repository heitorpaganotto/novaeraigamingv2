// src/pages/admin/AdminWhatsapp.tsx

import { useEffect } from "react";

const AdminWhatsapp = () => {
  useEffect(() => {
    window.open("https://web.whatsapp.com/", "_blank");
  }, []);

  return (
    <div className="text-white p-4">
      <h1 className="text-lg font-semibold">Abrindo WhatsApp Web...</h1>
      <p>Se não abriu automaticamente, <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">clique aqui</a>.</p>
    </div>
  );
};

export default AdminWhatsapp;
