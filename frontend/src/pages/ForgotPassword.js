// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For linking back to login
import apiClient from '../api/axiosConfig'; // Your configured API client
import '../styles/new_styles.css'; // Or specific styles
import '../styles/Login.css'; // Can reuse login styles

// --- Helper function to format phone number ---
const formatPhoneNumber = (value) => {
  if (!value) return value; // Return empty if no value
  const phoneNumber = value.replace(/[^\d]/g, ''); // Remove non-digits
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
// --- END: Helper function ---

function ForgotPassword() {
  // State for different steps: 'enterDetails', 'resetPassword', 'done'
  const [step, setStep] = useState('enterDetails');

  // Input states
  const [identifier, setIdentifier] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Stores CLEANED digits only
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for formatted phone number display
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

  // Feedback states
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // Flag to know if 'message' is an error
  const [isLoading, setIsLoading] = useState(false);

  // Store userId after successful verification
  const [verifiedUserId, setVerifiedUserId] = useState(null);

  // --- CORRECTED: Specific handler for Phone Number input ---
  const handlePhoneChange = (e) => {
     // Clear previous message when user types in phone field
     if (message) {
        setMessage('');
        setIsError(false); // Reset error flag as well
     }
     // --- End Correction ---

     const rawValue = e.target.value;
     // Clean the input (keep only digits)
     const cleanedValue = rawValue.replace(/[^\d]/g, '');
     // Limit to 10 digits
     const limitedValue = cleanedValue.slice(0, 10);

     // Update the actual state value sent to backend (digits only)
     setPhoneNumber(limitedValue); // Update the state used for submission/comparison
     // Update the formatted value for display in the input field
     setFormattedPhoneNumber(formatPhoneNumber(limitedValue));
  };
  // --- END: Specific handler ---

  // Handler for Step 1 & 2: Verify Identifier and Phone Number
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    // Validate phone number length
     if (phoneNumber.length !== 10) {
        setMessage('Please enter a valid 10-digit phone number.');
        setIsError(true);
        setIsLoading(false); // Stop loading
        return;
    }

    try {
      // Send identifier (email/username) AND CLEANED phone number
      const response = await apiClient.post('/api/users/verify-identity', {
        identifier,
        phoneNumber // This state now holds only digits
      });

      setVerifiedUserId(response.data.userId);
      setStep('resetPassword');
      setMessage('');

    } catch (error) {
      console.error("Identity Verification Error:", error.response || error);
      setMessage(error.response?.data?.message || 'Verification failed. Please check your details and try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Step 3: Reset Password (remains the same)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Clear message on new attempt
    setMessage('');
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      setIsError(true);
      return;
    }
     if (newPassword.length < 6) {
        setMessage('Password must be at least 6 characters long.');
        setIsError(true);
        return;
    }
    setIsLoading(true);

    try {
      await apiClient.post('/api/users/reset-password-direct', {
        userId: verifiedUserId,
        newPassword: newPassword
      });
      setMessage('Password has been reset successfully!');
      setIsError(false);
      setStep('done');
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
              type="text"
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => { setMessage(''); setIsError(false); setIdentifier(e.target.value);}} // Clear message on change
              required
              disabled={isLoading}
            />
            {/* --- UPDATED Phone Input --- */}
            <label htmlFor="phoneNumber" style={{marginTop: '10px'}}>Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber" // Keep name if needed, but onChange is specific
              type="tel"
              placeholder="123-456-7890"
              value={formattedPhoneNumber} // Bind to formatted state
              onChange={handlePhoneChange} // Use specific handler
              required
              disabled={isLoading}
            />
            {/* --- END: UPDATED Phone Input --- */}
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
            <input id="newPassword" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => { setMessage(''); setIsError(false); setNewPassword(e.target.value);}} required disabled={isLoading}/>
            <label htmlFor="confirmPassword" style={{marginTop: '10px'}}>Confirm New Password</label>
            <input id="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => { setMessage(''); setIsError(false); setConfirmPassword(e.target.value);}} required disabled={isLoading}/>
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
        return null;
    }
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>
      {renderStep()}
      {/* Display Message Area - shows 'message' state */}
      {step !== 'done' && message && (
          <p style={{
             color: isError ? 'red' : 'green', // Use isError flag to style
             marginTop: '15px',
             textAlign: 'center',
             maxWidth: '350px',
             margin: '15px auto 0 auto'
           }}>
            {message}
          </p>
        )}
      {step === 'enterDetails' && (
         <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Remember your password? <Link to="/login">Login here</Link>
          </p>
      )}
    </div>
  );
}

export default ForgotPassword;