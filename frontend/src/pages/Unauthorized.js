import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import '../styles/new_styles.css'; // Import your main styles

function Unauthorized() {
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '60px' }}>
      {/* Clear heading indicating the issue */}
      <h2>Access Denied</h2>

      {/* Informative message to the user */}
      <p style={{ fontSize: '1.1em', margin: '20px 0' }}>
        Sorry, you do not have the necessary permissions to access the page you requested.
      </p>

      {/* Provide navigation options */}
      <div style={{ marginTop: '30px' }}>
        {/* Button to go back to the previous page */}
        <button
          onClick={() => navigate(-1)} // navigate(-1) goes back one step in history
          style={{ marginRight: '10px', width: 'auto', padding: '10px 20px' }} // Adjust button style
        >
          Go Back
        </button>

        {/* Link to the home page */}
        <Link to="/">
          <button style={{ width: 'auto', padding: '10px 20px' }}>
             Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;