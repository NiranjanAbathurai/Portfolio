import { useForm } from 'react-hook-form';
import { ReusableInput } from '../shared/ui/ReusableInput';
import { ReusableButton } from '../shared/ui/ReusableButton';
import { signUpUser } from './authService';

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSubmitResult?: (message: string, isSuccess: boolean) => void; // For backward compatibility
  onSwitchToSignIn: () => void;
  headerGreen: string;
};

export const SignUpForm = (props: SignUpFormProps) => {
  const registerForm = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const { onSwitchToSignIn, headerGreen } = props;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signUpUser(data.username, data.email, data.password);
      const successMessage = `Account created for ${data.username}. Please check your email to verify your account.`;
      props.onSuccess?.(successMessage);
      props.onSubmitResult?.(successMessage, true); // Call old prop if it exists
      registerForm.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      props.onError?.(message);
      props.onSubmitResult?.(message, false); // Call old prop if it exists
    }
  };

  return (
    <form onSubmit={registerForm.handleSubmit(onSubmit)}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: headerGreen, fontSize:'1.25rem' }}>Sign Up</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <ReusableInput
          label="Username"
          name="username"
          register={registerForm.register}
          rules={{ required: 'Username is required' }}
          error={registerForm.formState.errors.username?.message}
          required
        />

        <ReusableInput
          label="Email"
          name="email"
          type="email"
          register={registerForm.register}
          rules={{
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
          }}
          error={registerForm.formState.errors.email?.message}
          required
        />

        <ReusableInput
          label="Password"
          name="password"
          type="password"
          register={registerForm.register}
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
          error={registerForm.formState.errors.password?.message}
          required
        />

        <ReusableInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={registerForm.register}
          rules={{
            required: 'Please confirm your password',
            validate: (value) => value === registerForm.watch('password') || 'Passwords do not match'
          }}
          error={registerForm.formState.errors.confirmPassword?.message}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReusableButton type="submit" label="Sign Up" variant="secondary" />
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onSwitchToSignIn}
            style={{ background: 'none', border: 'none', padding: 0, color: headerGreen, textDecoration: 'underline', cursor: 'pointer' }}
          >
            Sign in
          </button>
        </div>
      </div>
    </form>
  );
};
