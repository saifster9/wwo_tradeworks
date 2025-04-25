import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import fullLogo from '../assets/logo-full.png'; // Import the logo (adjust path if needed)
import '../styles/new_styles.css'; // Main styles
import '../styles/Register.css'; // Specific styles (optional)
import '../styles/Login.css'; // Can reuse login styles for container/form

// Helper function to format phone number
const formatPhoneNumber = (value) => {
  if (!value) return value; // Return empty if no value

  // Remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, '');

  // Apply formatting based on length
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

function Register() {
  // Form data state (phoneNumber here will store digits only)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '' // Will store cleaned digits
  });
  // State specifically for the confirm password field
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for formatted phone number display
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle changes for standard form fields (excluding phone)
  const handleChange = (e) => {
    if (error) {
        setError('');
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Specific handler for Phone Number input 
  const handlePhoneChange = (e) => {
     if (error) {
        setError('');
    }
    const rawValue = e.target.value;
    // Clean the input (keep only digits)
    const cleanedValue = rawValue.replace(/[^\d]/g, '');
    // Limit to 10 digits
    const limitedValue = cleanedValue.slice(0, 10);

    // Update the actual state value sent to backend (digits only)
    setFormData({ ...formData, phoneNumber: limitedValue });
    // Update the formatted value for display in the input field
    setFormattedPhoneNumber(formatPhoneNumber(limitedValue));
  };

  // Handle changes specifically for the confirm password field
  const handleConfirmPasswordChange = (e) => {
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

    // Basic password length validation example (add more if needed)
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    // --- NEW: Validate phone number length ---
    if (formData.phoneNumber.length !== 10) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }


    setIsLoading(true); // Set loading true only after validation passes

    try {
      // formData now contains the cleaned, digits-only phone number
      await apiClient.post('/api/users/register', formData);
      alert('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err.response || err);
      let errorMessage = 'An error occurred during registration. Please try again.';

      // Use specific message from backend if available
      if (err.response && err.response.data && err.response.data.message) {
         errorMessage = err.response.data.message;
      } else if (err.response && err.response.status) {
         errorMessage = `Error registering user (Status: ${err.response.status}). Please try again.`;
      } else {
         errorMessage = 'Registration failed. Please check your connection and try again.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <img src={fullLogo} alt="WWO Tradeworks Logo" style={{ maxWidth: '250px', marginBottom: '20px', display: 'block', margin: 'auto' }} />
      <h2>Registration</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>

        {/* Other Fields (First Name, Last Name, Email) using handleChange */}
         <div style={{ marginBottom: '15px' }}>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required disabled={isLoading}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required disabled={isLoading}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required disabled={isLoading}/>
        </div>


        {/* UPDATED Phone Number Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber" // Name still used, but value/onChange are specific
            type="tel"
            placeholder="123-456-7890" // Show desired format
            value={formattedPhoneNumber} // Bind value to formatted state
            onChange={handlePhoneChange} // Use specific phone handler
            required
            disabled={isLoading}
          />
        </div>


        {/* Username, Password, Confirm Password fields */}
         <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required disabled={isLoading}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Create a password (min. 6 characters)" value={formData.password} onChange={handleChange} required disabled={isLoading}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={handleConfirmPasswordChange} required disabled={isLoading}/>
        </div>


        {/* Submit Button */}
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