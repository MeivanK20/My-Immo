import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-5 py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm';
  
  const variantClasses = {
    primary: 'bg-brand-red text-white hover:bg-brand-red-dark focus:ring-brand-red/70 hover:shadow-glow-red hover:-translate-y-px',
    secondary: 'bg-transparent border border-brand-gray text-brand-gray hover:bg-brand-gray/10 hover:text-white focus:ring-brand-gray hover:-translate-y-px'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
