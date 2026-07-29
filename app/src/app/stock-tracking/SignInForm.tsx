import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReusableInput } from '../shared/ui/ReusableInput';
import { ReusableButton } from '../shared/ui/ReusableButton';
import { loginUser } from './authService';

type SignInFormValues = {
  email: string;
  password: string;
};

type SignInFormProps = {
  onSubmitSuccess: (message: string) => void;
  onSwitchToSignUp: () => void;
  headerGreen: string;
};

export const SignInForm = ({ onSubmitSuccess, onSwitchToSignUp, headerGreen }: SignInFormProps) => {
  const [rememberMe, setRememberMe] = useState(false);
  const storageKey = 'stock-tracker-session-auth';

  const getStoredCredentials = () => {
    if (typeof window === 'undefined') return { email: '', password: '', rememberMe: false };

    try {
      const stored = window.sessionStorage.getItem(storageKey);
      if (!stored) return { email: '', password: '', rememberMe: false };

      const parsed = JSON.parse(stored) as { email?: string; password?: string; rememberMe?: boolean };
      return {
        email: parsed.email ?? '',
        password: parsed.password ?? '',
        rememberMe: parsed.rememberMe ?? false,
      };
    } catch {
      return { email: '', password: '', rememberMe: false };
    }
  };

  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      email: getStoredCredentials().email,
      password: getStoredCredentials().password,
    }
  });

  useEffect(() => {
    const stored = getStoredCredentials();
    if (stored.rememberMe) {
      setRememberMe(true);
      signInForm.setValue('email', stored.email);
      signInForm.setValue('password', stored.password);
    }
  }, []);

  const persistCredentials = (data: SignInFormValues) => {
    if (typeof window === 'undefined') return;

    if (rememberMe) {
      window.sessionStorage.setItem(storageKey, JSON.stringify({ email: data.email, password: data.password, rememberMe: true }));
    } else {
      window.sessionStorage.removeItem(storageKey);
    }
  };

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await loginUser(data.email, data.password);
      persistCredentials(data);
      onSubmitSuccess(`Welcome back, ${data.email}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      onSubmitSuccess(message);
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
                window.sessionStorage.removeItem(storageKey);
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
