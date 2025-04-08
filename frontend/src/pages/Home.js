import { Link } from 'react-router-dom';
import '../styles/new_styles.css';

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to WWO Tradeworks</h1>
            <div className="home-buttons">
                <Link to="/login"><button className="login-button">User Login</button></Link>
                <p>
                    Users login here to your account to view stocks and make trades.
                </p>
                <br></br>
                <Link to="/admin"><button className="login-button">Admin Login</button></Link>
                <p>
                    Admins login here to manage stocks, users and the market.
                </p>
                <br></br>
                
                <Link to="/register"><button className="login-button">Register</button></Link>
                <p>
                    New to WWO Tradeworks? Create an account to start trading today!
                </p>
                <br></br>
            </div>
        </div>
    );
}

export default Home;