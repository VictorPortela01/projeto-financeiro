import React from "react";

const Input = ({ type = "text", placeholder, value, onChange, name, id }) => {
  return (
    <input
      type={type}
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-500"
    ></input>
  );
};

export default Input;
