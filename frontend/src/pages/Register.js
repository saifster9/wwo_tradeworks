import { useState } from 'react';
import apiClient from '../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (keep existing code like setFormData, etc.)
    try {
      // Use apiClient assuming you set it up
      await apiClient.post('/api/users/register', formData); // Use relative path with apiClient
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error("Registration Error:", error.response || error); // Log the full error for debugging
      let errorMessage = 'Error registering user. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
         // Use the specific message from the backend if available
         errorMessage = error.response.data.message;
         if (error.response.data.error && typeof error.response.data.error === 'string' && error.response.data.error.includes('Duplicate entry')) {
           // Provide a more user-friendly message for unique constraint errors
           errorMessage = 'Username, email, or phone number may already be taken. Please try different values.';
         }
      } else if (error.response && error.response.status) {
         errorMessage = `Error registering user (Status: ${error.response.status}).`;
      }
      // Replace the generic alert with one that shows more detail
      alert(errorMessage);
    }
  };

  return (
    <div className="registration-container">
      
      <form onSubmit={handleSubmit}>
        <table>
            <tr>
                <td colSpan="2"><h2>Register</h2></td>
            </tr>
            <tr>
                <td><input name="firstName" placeholder="First Name" onChange={handleChange} required /></td>
                <td><input name="lastName" placeholder="Last Name" onChange={handleChange} required /></td>
            </tr>
            <tr>
                <td><input name="email" placeholder="Email" onChange={handleChange} required /></td>
            </tr>
            <tr>
                <td>
                <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                <input name="username" placeholder="Username" onChange={handleChange} required />
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                <button type="submit">Register</button>
                </td>
            </tr>
        </table>                
      </form>
    </div>
  );
}

export default Register;