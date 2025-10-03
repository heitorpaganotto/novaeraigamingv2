// src/components/ui/modal.tsx
import { FC, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar no conteúdo
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};
