
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        id={id}
        className="mt-1 block w-full px-4 py-2 bg-brand-dark border border-brand-card rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-white disabled:bg-brand-card"
        {...props}
      />
    </div>
  );
};

export default Input;
