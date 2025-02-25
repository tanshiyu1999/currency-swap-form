import React from "react";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
      onClick={onClose} 
    >
      <motion.div 
        className="bg-[#141414] rounded-2xl shadow-lg w-96 h-[700px] max-h-[95vh] pt-2 border-gray-700 border"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
