import React from 'react';

type ReusableButtonProps = {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export const ReusableButton = ({
  label,
  type = 'button',
  variant = 'primary',
  onClick,
}: ReusableButtonProps) => {
  const bgColor = variant === 'secondary' ? '#1db954' : '#1db954';

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ padding: '0.7rem 1rem', border: 'none', borderRadius: '4px', background: bgColor, color: '#fff', cursor: 'pointer', width: '100%' }}
    >
      {label}
    </button>
  );
};
