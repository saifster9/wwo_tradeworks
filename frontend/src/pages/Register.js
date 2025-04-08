import { useState } from 'react';
import axios from 'axios';
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
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Error registering user');
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