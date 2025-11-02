// src/components/auth/GoogleLoginButton.tsx
import React from 'react';
import GoogleIcon from '../icons/GoogleIcon';
import Button from '../common/Button';

interface GoogleLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick, disabled, label }) => {
  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full flex items-center justify-center gap-3"
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon />
      {label}
    </Button>
  );
};

export default GoogleLoginButton;
