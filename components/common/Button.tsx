import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-5 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-brand-red text-white hover:bg-brand-red/90 focus:ring-brand-red/70 hover:shadow-md hover:-translate-y-px',
    secondary: 'bg-gray-200 text-brand-gray hover:bg-gray-300/80 focus:ring-gray-400 hover:shadow-md hover:-translate-y-px'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;