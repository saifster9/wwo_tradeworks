import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

  function UserDashboard() {
      const [firstName, setFirstName] = useState('');
      const [portfolio, setPortfolio] = useState([]);
      const [transactions, setTransactions] = useState([]);
      const navigate = useNavigate(); // Initialize navigate
      const userId = localStorage.getItem('userId');

      useEffect(() => {
          const fetchUserData = async () => {
              try {
                  // Retrieve the user's first name from localStorage
                  const storedFirstName = localStorage.getItem('firstName');
                  if (storedFirstName) {
                      setFirstName(storedFirstName);
                  }

                  // Fetch portfolio data
//                  const portfolioResponse = await axios.get(`http://localhost:5000/api/users/${userId}/portfolio`);
//                  setPortfolio(portfolioResponse.data);

                  // Fetch transaction history
//                  const transactionsResponse = await axios.get(`http://localhost:5000/api/users/${userId}/transactions`);
//                  setTransactions(transactionsResponse.data);

              } catch (error) {
                  console.error('Error fetching user data:', error);
                  alert('Error fetching user data.');
              }
          };

          fetchUserData();
      }, []);

      return (
          <div className="dashboard-container">
              <h2>Welcome to your Dashboard, {firstName}</h2> {/* Updated title */}

              {/* Portfolio Section */}
              <div className="admin-section"> {/* Use admin-section class */}
                  <h3>Your Portfolio</h3>
                  {portfolio.length > 0 ? (
                      <table>
                          <thead>
                              <tr>
                                  <th>Stock</th>
                                  <th>Shares Owned</th>
                                  {/* Add more columns as needed */}
                              </tr>
                          </thead>
                          <tbody>
                              {portfolio.map(item => (
                                  <tr key={item.id}>
                                      <td>{item.stock}</td>
                                      <td>{item.shares}</td>
                                      {/* Add more cells as needed */}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p>You currently own no stocks.</p>
                  )}
                  <button className="admin-dashboard-button" onClick={() => navigate('/portfolio')}> {/* Updated button */}
                      Manage Portfolio
                  </button>
              </div>

              {/* Transaction History Section */}
              <div className="admin-section"> {/* Use admin-section class */}
                  <h3>Transaction History</h3>
                  {transactions.length > 0 ? (
                      <table>
                          <thead>
                              <tr>
                                  <th>Date</th>
                                  <th>Type</th>
                                  <th>Stock</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  {/* Add more columns as needed */}
                              </tr>
                          </thead>
                          <tbody>
                              {transactions.map(transaction => (
                                  <tr key={transaction.id}>
                                      <td>{transaction.date}</td>
                                      <td>{transaction.type}</td>
                                      <td>{transaction.stock}</td>
                                      <td>{transaction.quantity}</td>
                                      <td>{transaction.price}</td>
                                      {/* Add more cells as needed */}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p>You have no transaction history yet.</p>
                  )}
                  <button className="admin-dashboard-button" onClick={() => navigate('/transaction-history')}> {/* Updated button */}
                      Transaction History
                  </button>
              </div>
          </div>
      );
  }

  export default UserDashboard;