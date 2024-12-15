import { useState } from "react";
import Image from "next/image";

interface FormModalProps {
  title: string; // Added title prop
  onClose: () => void;
  children: React.ReactNode;
}

const FormModal = ({ title, onClose, children }: FormModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-[90%] max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <Image src="/close.png" alt="Close" width={20} height={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default FormModal;
