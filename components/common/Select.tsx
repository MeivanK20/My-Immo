
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        id={id}
        className="mt-1 block w-full py-2.5 px-3 border border-brand-card bg-brand-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-white"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
