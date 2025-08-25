import React, { useState } from 'react';
import EmailLinkLoginForm from './EmailLinkLoginForm';
import EmailLinkSignUpForm from './EmailLinkSignUpForm';
import SimpleLoginForm from './SimpleLoginForm';
import SignUpForm from './SignUpForm';

type AuthMode = 'email-link-login' | 'email-link-signup' | 'password-login' | 'password-signup';

const UnifiedAuth: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('email-link-login');

  const switchToEmailLinkLogin = () => setAuthMode('email-link-login');
  const switchToEmailLinkSignup = () => setAuthMode('email-link-signup');
  const switchToPasswordLogin = () => setAuthMode('password-login');
  const switchToPasswordSignup = () => setAuthMode('password-signup');

  const handleLoginSuccess = () => {
    // This will be handled by the parent component
    window.location.reload();
  };

  const handleSignUpSuccess = () => {
    // Switch to login mode after successful signup
    setAuthMode('email-link-login');
  };

  switch (authMode) {
    case 'email-link-login':
      return (
        <EmailLinkLoginForm
          onSwitchToPassword={switchToPasswordLogin}
          onSwitchToSignUp={switchToEmailLinkSignup}
        />
      );

    case 'email-link-signup':
      return (
        <EmailLinkSignUpForm
          onSwitchToPassword={switchToPasswordSignup}
          onSwitchToLogin={switchToEmailLinkLogin}
        />
      );

    case 'password-login':
      return (
        <SimpleLoginForm
          onLoginSuccess={handleLoginSuccess}
        />
      );

    case 'password-signup':
      return (
        <SignUpForm
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToLogin={switchToPasswordLogin}
        />
      );

    default:
      return (
        <EmailLinkLoginForm
          onSwitchToPassword={switchToPasswordLogin}
          onSwitchToSignUp={switchToEmailLinkSignup}
        />
      );
  }
};

export default UnifiedAuth;
