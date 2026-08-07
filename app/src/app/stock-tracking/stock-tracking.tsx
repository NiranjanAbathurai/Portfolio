import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { AppShellPortfolio } from './AppShellPortfolio';

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

    // ============================================================
    // DASHBOARD VIEW — New PWA-style AppShell
    // ============================================================
    if (formMode === 'dashboard') {
        return (
            <div style={{ minHeight: '70vh', background: '#000000' }}>
                <AppShellPortfolio onLogout={handleLogout} />
            </div>
        );
    }

    // ============================================================
    // AUTH FORMS VIEW
    // ============================================================
    return (
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'clamp(1rem, 3vw, 2rem)', background: '#000000', gap: '1.5rem' }}>
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

            {/* App Intro + Download Section */}
            <div style={{ width: '100%', maxWidth: '420px', background: darkBg, borderRadius: '12px', padding: '1.25rem', margin: '0 0.75rem', color: '#ccc', fontSize: '0.85rem', lineHeight: 1.6 }}>
                <h3 style={{ color: headerGreen, margin: '0 0 0.75rem', fontSize: '1.1rem', textAlign: 'center' }}>
                    📦 What is Stock Tracker?
                </h3>
                <p style={{ margin: '0 0 0.5rem' }}>
                    Stock Tracker helps you manage your <strong style={{ color: '#fff' }}>home inventory</strong> — track groceries, medicines, cleaning supplies, and more across multiple homes.
                </p>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                    <li>🏠 Organize stock by homes</li>
                    <li>📅 Track expiry dates</li>
                    <li>🔔 Get notified when products expire</li>
                    <li>🎤 AI voice commands to manage stock</li>
                    <li>📷 Add items by scanning bills</li>
                    <li>📱 Works offline as an installed app</li>
                </ul>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a
                        href="https://stock-tracker-app-ai.netlify.app/?install=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            textDecoration: 'none',
                            padding: '0.6rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                        }}
                    >
                        📲 Download App
                    </a>
                </div>
            </div>
        </div>
    );
};
