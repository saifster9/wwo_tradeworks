import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import '../styles/ManageStocks.css';
    
    function ManageStocks() {
        const [stocks, setStocks] = useState([]);
        const [newStock, setNewStock] = useState({
            companyName: '',
            stockTicker: '',
            totalSharesAvailable: 0,
            initialSharePrice: 0,
        });
    
        useEffect(() => {
            fetchStocks();
        }, []);
    
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stocks');
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching stocks:', error);
                alert('Error fetching stocks.');
            }
        };
    
        const handleCreateStock = async (e) => {
            e.preventDefault();
            try {
                await axios.post('http://localhost:5000/api/stocks', newStock);
                alert('Stock created successfully!');
                setNewStock({
                    companyName: '',
                    stockTicker: '',
                    totalSharesAvailable: 0,
                    initialSharePrice: 0,
                });
                fetchStocks();
            } catch (error) {
                console.error('Error creating stock:', error);
                alert('Error creating stock.');
            }
        };
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setNewStock(prevStock => ({
                ...prevStock,
                [name]: value,
            }));
        };
    
        const handleUpdateStock = async (id, updatedStockData) => {
            try {
                await axios.put(`http://localhost:5000/api/stocks/${id}`, updatedStockData);
                alert('Stock updated successfully!');
                fetchStocks();
            } catch (error) {
                console.error('Error updating stock:', error);
                alert('Error updating stock.');
            }
        };
    
        const handleDeleteStock = async (id) => {
            try {
                await axios.delete(`http://localhost:5000/api/stocks/${id}`);
                alert('Stock deleted successfully!');
                fetchStocks();
            } catch (error) {
                console.error('Error deleting stock:', error);
                alert('Error deleting stock.');
            }
        };
    
        return (
            <div className="dashboard-container">
                <h2>Manage Stocks</h2>
    
                {/* Create New Stock Section */}
                <div className="dashboard-style">
                    <h3>Create New Stock</h3>
                    <form onSubmit={handleCreateStock}>
                        <label htmlFor="company-name">Company Name:</label>
                        <input
                            type="text"
                            id="company-name"
                            name="companyName"
                            placeholder="Enter company name"
                            value={newStock.companyName}
                            onChange={handleInputChange}
                            required
                        />
    
                        <label htmlFor="stock-ticker">Stock Ticker:</label>
                        <input
                            type="text"
                            id="stock-ticker"
                            name="stockTicker"
                            placeholder="Enter stock symbol"
                            value={newStock.stockTicker}
                            onChange={handleInputChange}
                            required
                        />
    
                        <label htmlFor="stock-volume">Total Shares Available:</label>
                        <input
                            type="number"
                            id="totalSharesAvailable"
                            name="totalSharesAvailable"
                            placeholder="Enter share volume"
                            value={newStock.totalSharesAvailable}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
    
                        <label htmlFor="initial-price">Initial Share Price ($):</label>
                        <input
                            type="number"
                            step="0.01"
                            id="initialSharePrice"
                            name="initialSharePrice"
                            placeholder="Enter starting price"
                            value={newStock.initialSharePrice}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
    
                        <button type="submit">Create Stock</button>
                    </form>
                </div>
    
                {/* Stock List Section */}
                <div className="dashboard-style">
                    <h3>Existing Stocks</h3>
                    {stocks.length > 0 ? (
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Stock Ticker</th>
                                    <th>Shares Available</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map(stock => (
                                    <tr key={stock.id}>
                                        <td>{stock.companyName}</td>
                                        <td>{stock.stockTicker}</td>
                                        <td>{stock.totalSharesAvailable}</td>
                                        <td>{stock.initialSharePrice}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => handleDeleteStock(stock.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No stocks available.</p>
                    )}
                </div>
            </div>
        );
    }
    
    export default ManageStocks;