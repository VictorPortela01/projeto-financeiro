import React from "react";

// Um pequeno componente Spinner para usar dentro do botão
const Spinner = () => (
  <svg
    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Button = ({
  children,
  type = "button",
  onClick,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 
                 font-semibold text-white shadow-lg transition-colors duration-200
                 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                 focus:ring-indigo-500 focus:ring-offset-2
                 dark:bg-indigo-500 dark:hover:bg-indigo-600 
                 dark:focus:ring-offset-gray-900
                 disabled:cursor-not-allowed disabled:bg-indigo-400 dark:disabled:bg-indigo-700"
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
