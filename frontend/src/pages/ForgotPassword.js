// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import '../styles/new_styles.css';
import '../styles/Login.css';

function ForgotPassword() {
  // State for different steps: 'enterDetails', 'resetPassword', 'done'
  const [step, setStep] = useState('enterDetails');

  // Input states
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback states
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Store userId after successful verification
  const [verifiedUserId, setVerifiedUserId] = useState(null);

  // Handler for Step 1 & 2: Verify Identifier and Phone Number
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // NEW Backend Endpoint: Send identifier (email/username) AND phone number
      const response = await apiClient.post('/api/users/verify-identity', {
        identifier, // Send email or username
        phoneNumber
      });

      // If successful, backend confirms match and might return userId
      setVerifiedUserId(response.data.userId); // Assuming backend returns userId on success
      setStep('resetPassword'); // Move to the next step
      setMessage(''); // Clear any previous messages

    } catch (error) {
      console.error("Identity Verification Error:", error.response || error);
      setMessage(error.response?.data?.message || 'Verification failed. Please check your details and try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Basic validation
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      setIsError(true);
      return;
    }
    if (newPassword.length < 6) { // Example minimum length
        setMessage('Password must be at least 6 characters long.');
        setIsError(true);
        return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // NEW Backend Endpoint: Send verified userId and new password
      await apiClient.post('/api/users/reset-password-direct', {
        userId: verifiedUserId, // Send the userId confirmed in the previous step
        newPassword: newPassword
      });

      setMessage('Password has been reset successfully!');
      setIsError(false);
      setStep('done'); // Move to a final confirmation step

    } catch (error) {
      console.error("Password Reset Error:", error.response || error);
      setMessage(error.response?.data?.message || 'Failed to reset password. Please try again later.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Render different forms based on the current step
  const renderStep = () => {
    switch (step) {
      case 'enterDetails':
        return (
          <form onSubmit={handleVerifyIdentity} style={{ maxWidth: '350px', margin: '0 auto' }}>
            <p style={{ marginBottom: '20px', textAlign: 'center' }}>
              Enter your account identifier (email or username) and the associated phone number to verify your identity.
            </p>
            <label htmlFor="identifier">Email or Username</label>
            <input
              id="identifier"
              type="text" // Allow email or username
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
            <label htmlFor="phoneNumber" style={{marginTop: '10px'}}>Phone Number</label>
            <input
              id="phoneNumber"
              type="tel" // Use 'tel' type for phone numbers
              placeholder="Enter registered phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '20px' }}>
              {isLoading ? 'Verifying...' : 'Verify Identity'}
            </button>
          </form>
        );

      case 'resetPassword':
        return (
          <form onSubmit={handleResetPassword} style={{ maxWidth: '350px', margin: '0 auto' }}>
             <p style={{ marginBottom: '20px', textAlign: 'center' }}>
              Identity verified. Please enter your new password below.
            </p>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <label htmlFor="confirmPassword" style={{marginTop: '10px'}}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '20px' }}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        );

        case 'done':
            return (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>
                    <Link to="/login">
                        <button style={{ width: 'auto', padding: '10px 20px', marginTop: '10px' }}>
                            Proceed to Login
                        </button>
                    </Link>
                </div>
            );

      default:
        return null; // Should not happen
    }
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>

      {/* Render the current step's form */}
      {renderStep()}

      {/* Display messages if not in the 'done' step */}
      {step !== 'done' && message && (
          <p style={{
             color: isError ? 'red' : 'green',
             marginTop: '15px',
             textAlign: 'center',
             maxWidth: '350px', // Match form width
             margin: '15px auto 0 auto'
           }}>
            {message}
          </p>
        )}

      {/* Link back to Login (only show if not finished) */}
      {step === 'enterDetails' && (
         <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Remember your password? <Link to="/login">Login here</Link>
          </p>
      )}
    </div>
  );
}

export default ForgotPassword;