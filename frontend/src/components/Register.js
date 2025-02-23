import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateEmail, validatePassword } from '../utils/validation';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateBusinessName = (name) => {
    if (!name || name.trim() === '') {
      return 'Business name is required';
    }
    if (name.length < 2) {
      return 'Business name must be at least 2 characters';
    }
    if (name.length > 50) {
      return 'Business name must be less than 50 characters';
    }
    return '';
  };

  const validateForm = () => {
    const businessError = validateBusinessName(businessName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setBusinessNameError(businessError);
    setEmailError(emailError);
    setPasswordError(passwordError);

    return !businessError && !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/authRoutes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Register Your Restaurant</h1>
        <p className={styles.subtitle}>Create an account to start managing your menu</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                setBusinessNameError('');
              }}
              placeholder="Restaurant Name"
              required
              className={`${styles.input} ${businessNameError ? styles.inputError : ''}`}
            />
            {businessNameError && <div className={styles.errorMessage}>{businessNameError}</div>}
          </div>

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
            <div className={styles.passwordWrapper}>
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
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;