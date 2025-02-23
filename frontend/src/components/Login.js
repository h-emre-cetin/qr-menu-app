import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { validateEmail, validatePassword } from '../utils/validation';
import { sendPasswordResetEmail, signInWithCustomToken } from 'firebase/auth';
import styles from './Login.module.css';
import { auth } from '../config/firebase';

const Login = () => {
  const navigate = useNavigate();
  const { updateTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setEmailError(emailError || '');
    setPasswordError(passwordError || '');

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/authRoutes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data.customToken) {
        throw new Error('No custom token received from server');
      }

      try {
        console.log('Starting Firebase authentication...');
        // Initialize Firebase Auth
        if (!auth) {
          throw new Error('Firebase Auth not initialized');
        }

        // Exchange custom token
        const userCredential = await signInWithCustomToken(auth, data.customToken);
        if (!userCredential || !userCredential.user) {
          throw new Error('Failed to get user credentials');
        }

        console.log('Firebase authentication successful');
        const idToken = await userCredential.user.getIdToken();

        // Store tokens and business info
        localStorage.setItem('token', idToken);
        localStorage.setItem('businessId', data.businessId);
        localStorage.setItem('businessName', data.businessName);
        if (data.menuId) {
          localStorage.setItem('menuId', data.menuId);
        }

        // Get business theme
        try {
          const db = getFirestore();
          const businessRef = doc(db, 'businesses', data.businessId);
          const businessDoc = await getDoc(businessRef);
          
          if (businessDoc.exists() && businessDoc.data().theme) {
            updateTheme(businessDoc.data().theme);
          }
        } catch (themeError) {
          console.error('Theme loading error:', themeError);
          // Continue without theme if there's an error
        }

        navigate('/dashboard');
      } catch (firebaseError) {
        console.error('Firebase authentication error:', firebaseError);
        throw new Error(`Firebase authentication failed: ${firebaseError.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to manage your restaurant</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="Email"
              required
              className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            />
            {emailError && <div className={styles.errorMessage}>{emailError}</div>}
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              placeholder="Password"
              required
              className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}

          <div className={styles.forgotPassword}>
            <button
              type="button"
              onClick={handlePasswordReset}
              className={styles.resetLink}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;