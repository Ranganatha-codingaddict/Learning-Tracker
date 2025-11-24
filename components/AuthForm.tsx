

import React, { useState, useCallback } from 'react';
import Button from './Button';
import InputField from './InputField';
import LoadingSpinner from './LoadingSpinner';
import { UserCredentials, SignupDetails } from '../types';

interface AuthFormProps {
  onLogin: (credentials: UserCredentials) => Promise<void>;
  onSignup: (details: SignupDetails) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin({ email, password });
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await onSignup({ 
            email, 
            password,
            name: name.trim() || undefined,
            phone: phone.trim() || undefined,
            photoUrl: photoUrl.trim() || undefined
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [isLogin, email, password, confirmPassword, name, phone, photoUrl, onLogin, onSignup]);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <InputField
                label="Full Name (Optional)"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
            />
            <InputField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
            />
             <InputField
                label="Photo URL (Optional)"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
            />
          </>
        )}

        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your.email@example.com"
        />
        
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />

        {!isLogin && (
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="********"
            error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
          />
        )}

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? <LoadingSpinner /> : (isLogin ? 'Login' : 'Sign Up')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-700 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              // Reset fields when switching modes
              if (isLogin) { 
                  setConfirmPassword('');
                  setName('');
                  setPhone('');
                  setPhotoUrl('');
              }
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium focus:outline-none"
            type="button"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Note: This app uses local storage for mock authentication.
          Your details are saved locally in your browser.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;