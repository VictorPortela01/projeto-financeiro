import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Impede que o clique DENTRO do modal o feche
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* O Contêiner do Modal */}
      <div
        onClick={handleContentClick}
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
           onClick={onClose}
           className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
           title="Fechar"
           >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        {/* Conteúdo (o formulário virá aqui) */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
