import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { StockTrackerDashboard } from './StockTrackerDashboard';

export const StockTracking = () => {
    const [formMode, setFormMode] = useState<'signin' | 'signup' | 'dashboard'>('signin');
    const [signInMessage, setSignInMessage] = useState<string | null>(null);
    const [registerMessage, setRegisterMessage] = useState<string | null>(null);
    const headerGreen = '#1db954';
    const darkBg = '#111111';
    const cardText = '#ffffff';

    const switchToSignUp = () => {
        setFormMode('signup');
        setSignInMessage(null);
        setRegisterMessage(null);
    };

    const switchToSignIn = () => {
        setFormMode('signin');
        setSignInMessage(null);
        setRegisterMessage(null);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            // Clear the "Remember me" session
            window.sessionStorage.removeItem('stock-tracker-session-auth');
        }
        setFormMode('signin');
        setSignInMessage('You have been logged out.');
        setTimeout(() => {
            setSignInMessage(null);
        }, 3000);
    };
    const showTemporarySignInMessage = (message: string) => {
        setSignInMessage(message);
        setRegisterMessage(null);
        setFormMode('signin');
        setTimeout(() => {
            setSignInMessage(null);
        }, 3000);
    };

    if (formMode === 'dashboard') {
        return (
            <div style={{ minHeight: '70vh', padding: 'clamp(1rem, 3vw, 2rem)', background: '#000000' }}>
                <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', border: `2px solid ${headerGreen}`, borderRadius: '12px', background: darkBg, color: cardText, padding: 'clamp(1rem, 3vw, 1.5rem)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <StockTrackerDashboard onLogout={handleLogout} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(1rem, 3vw, 2rem)', background: '#000000' }}>
            <div style={{ width: '100%', maxWidth: '420px', border: `2px solid ${headerGreen}`, borderRadius: '12px', background: darkBg, color: cardText, padding: 'clamp(1rem, 3vw, 1.5rem)', margin: '0 0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                {formMode === 'signin' ? (
                    <>
                        <SignInForm
                            onSubmitSuccess={(message) => {
                                setSignInMessage(message);
                                if (message.includes('Welcome back')) {
                                    setFormMode('dashboard');
                                }
                            }}
                            onSwitchToSignUp={switchToSignUp}
                            headerGreen={headerGreen}
                        />
                        {signInMessage && <p style={{ marginTop: '1rem', color: cardText, textAlign: 'center' }}>{signInMessage}</p>}
                    </>
                ) : (
                    <>
                        <SignUpForm
                            onSubmitResult={(message, isSuccess) => {
                                if (isSuccess) {
                                    showTemporarySignInMessage('Please confirm your email address to complete sign up.');
                                } else {
                                    setRegisterMessage(message);
                                    setFormMode('signup');
                                }
                            }}
                            onSwitchToSignIn={switchToSignIn}
                            headerGreen={headerGreen}
                        />
                        {registerMessage && <p style={{ marginTop: '1rem', color: cardText, textAlign: 'center' }}>{registerMessage}</p>}
                    </>
                )}
            </div>
        </div>
    );
};