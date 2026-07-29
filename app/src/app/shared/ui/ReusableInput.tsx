import React from 'react';
import { type RegisterOptions, type UseFormRegister } from 'react-hook-form';

type ReusableInputProps = {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
};

export const ReusableInput = ({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  required = false,
  register,
  rules,
}: ReusableInputProps) => {
  const fieldProps = register && name ? register(name, rules) : {};
  const { ref, ...restFieldProps } = fieldProps as React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <div>{label}{required ? ' *' : ''}</div>
      <input
        {...restFieldProps}
        ref={ref}
        name={name}
        type={type}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ced4da', background: '#ffffff', color: '#111111' }}
      />
      {error && <small style={{ color: 'crimson' }}>{error}</small>}
    </label>
  );
};
