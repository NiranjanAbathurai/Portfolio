import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ReusableInput } from '../shared/ui/ReusableInput';
import { ReusableButton } from '../shared/ui/ReusableButton';
import { loginUser } from './authService';

type SignInFormValues = {
  email: string;
  password: string;
};

type SignInFormProps = {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSubmitSuccess?: (message: string) => void; // For backward compatibility
  onSwitchToSignUp: () => void;
  headerGreen: string;
};

export const SignInForm = (props: SignInFormProps) => {
  const storageKey = 'stock-tracker-session-auth';
  const { onSwitchToSignUp, headerGreen } = props;

  const storedCredentials = useMemo(() => {
    if (typeof window === 'undefined') return { email: '', password: '', rememberMe: false };
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return { email: '', password: '', rememberMe: false };
      const parsed = JSON.parse(stored) as { email?: string; password?: string; rememberMe?: boolean };
      return {
        email: parsed.email ?? '',
        password: parsed.password ?? '',
        rememberMe: parsed.rememberMe ?? false,
      };
    } catch (e) {
      console.error("Failed to parse stored credentials:", e);
      return { email: '', password: '', rememberMe: false };
    }
  }, []);

  const [rememberMe, setRememberMe] = useState(storedCredentials.rememberMe);

  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      email: storedCredentials.email,
      password: storedCredentials.password,
    }
  });

  useEffect(() => {
    if (storedCredentials.rememberMe) {
      signInForm.setValue('email', storedCredentials.email);
      signInForm.setValue('password', storedCredentials.password);
    }
  }, [storedCredentials, signInForm]);

  const persistCredentials = useCallback((data: SignInFormValues) => {
    if (typeof window === 'undefined') return;
    if (rememberMe) {
      window.localStorage.setItem(storageKey, JSON.stringify({ email: data.email, password: data.password, rememberMe: true }));
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }, [rememberMe]);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await loginUser(data.email, data.password);
      persistCredentials(data);
      const successMessage = `Welcome back, ${data.email}!`;
      props.onSuccess?.(successMessage);
      props.onSubmitSuccess?.(successMessage); // Call old prop if it exists
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      props.onError?.(message);
      // The old prop was used for both success and error, so we call it here too.
      if (props.onSubmitSuccess) {
        props.onSubmitSuccess(message);
      }
    }
  };

  return (
    <form onSubmit={signInForm.handleSubmit(onSubmit)}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: headerGreen, fontSize:'1.25rem' }}>Sign In</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <ReusableInput
          label="Email"
          name="email"
          type="email"
          register={signInForm.register}
          rules={{
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
          }}
          error={signInForm.formState.errors.email?.message}
          required
        />

        <ReusableInput
          label="Password"
          name="password"
          type="password"
          register={signInForm.register}
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
          error={signInForm.formState.errors.password?.message}
          required
        />

        <label style={{ display: 'flex', alignItems: 'center', color: '#fff', fontSize: '0.95rem' }}>
          <input
            type="checkbox"
            style={{ width: '12px', marginTop: '4px', marginRight: '0.5rem' }}
            checked={rememberMe}
            onChange={(e) => {
              const checked = e.target.checked;
              setRememberMe(checked);
              if (!checked) {
                window.localStorage.removeItem(storageKey);
              }
            }}
          />
          Remember me
        </label>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReusableButton type="submit" label="Sign In"/>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            style={{ background: 'none', border: 'none', padding: 0, color: headerGreen, textDecoration: 'underline', cursor: 'pointer' }}
          >
            Sign up
          </button>
        </div>
      </div>
    </form>
  );
};
