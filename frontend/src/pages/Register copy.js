import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import fullLogo from '../assets/logo-full.png'; // Import the logo (adjust path if needed)
import '../styles/new_styles.css'; // Main styles
import '../styles/Register.css'; // Specific styles (optional)
import '../styles/Login.css'; // Can reuse login styles for container/form

function Register() {
  // Form data state
  const [formData, setFormData] = useState({
    username: '',
    password: '', // Password stored here
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  // Add state specifically for the confirm password field
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add state for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle changes for standard form fields
  const handleChange = (e) => {
    // Clear error when user starts typing in main fields
    if (error) {
        setError('');
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle changes specifically for the confirm password field
  const handleConfirmPasswordChange = (e) => {
    // Clear error when user starts typing in confirm field
     if (error) {
        setError('');
    }
    setConfirmPassword(e.target.value);
  };


  // Update handleSubmit to include loading state and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors first

    // --- Check if passwords match ---
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // --- END: Check if passwords match ---

    // Basic password length validation example (add more if needed)
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true); // Set loading true only after validation passes

    try {
      // Send only the formData (which includes the password, but not confirmPassword)
      await apiClient.post('/api/users/register', formData);
      alert('Registration successful! Redirecting to login...'); // Keep alert or change to success message
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err.response || err); // Good for debugging
      let errorMessage = 'Error registering user. Please try again.'; // Default message

      // Check if the backend sent specific error details
      if (err.response && err.response.data) {
         // Use the backend's primary message if available (might still be generic)
         errorMessage = err.response.data.message || errorMessage;

         // --- UPDATED Specific Check ---
         // Check if the 'error' field specifically contains 'Validation error'.
         // This assumes the backend sends this for duplicate entries.
         // WARNING: This might also catch other validation errors if the backend isn't more specific.
         // A better long-term solution is modifying the backend to send a unique code for duplicates.
         if (err.response.data.error && err.response.data.error === 'Validation error') {
           // If the error field is exactly 'Validation error', assume it might be a duplicate.
           errorMessage = 'Username, email, or phone number may already be taken. Please try different values.';
         }
         // --- End Updated Specific Check ---

      } else if (err.response && err.response.status) {
         // Fallback for other types of HTTP errors
         errorMessage = `Error registering user (Status: ${err.response.status}).`;
      }
      // Set the determined error message in the state to display it
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Set loading false
    }
  };

  return (
    // Use the same container class as Login/Home for consistency
    <div className="login-container">
      {/* Add the logo */}
      <img src={fullLogo} alt="WWO Tradeworks Logo" style={{ maxWidth: '250px', marginBottom: '20px', display: 'block', margin: 'auto' }} />

      <h2>Register</h2>

      {/* Use a form with constrained width, remove table */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}> {/* Slightly wider for more fields */}

        {/* First Name Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        {/* Last Name Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        {/* Phone Number Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        {/* Username Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        {/* --- Password Field --- */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password" // Name matches formData key
            type="password"
            placeholder="Create a password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange} // Uses the standard handler
            required
            disabled={isLoading}
          />
        </div>

        {/* --- Confirm Password Field --- */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword" // Different name, handled separately
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword} // Uses the separate state variable
            onChange={handleConfirmPasswordChange} // Uses the specific handler
            required
            disabled={isLoading}
          />
        </div>
        {/* --- END: Confirm Password Field --- */}


        {/* Submit Button - full width within form */}
        <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {/* Display Area for Errors */}
        {error && (
            <p className="error-message" style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
                {error}
            </p>
         )}

      </form>

      {/* Link to Login Page */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;