import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/adminLogin.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.status === 'success') {
                if (data.role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (data.role === 'customer_rep') {
                    navigate('/customer-rep-dashboard');
                } else {
                    setError('Unknown role');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="ikea-login-wrapper">
            <div className="ikea-login-card">
                <h2 className="ikea-login-title">Staff Login</h2>
                <p className="ikea-login-subtitle">Admins & Customer Reps Only</p>
                <form onSubmit={handleLogin} className="ikea-login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Link to="/forgot-rep-password" className="forgot-link">
                        Forgot your Customer Rep password?
                    </Link>

                    <button type="submit">Login</button>

                    {error && <p className="ikea-login-error">{error}</p>}

                    <div className="extra-links">
                        <Link to="/" className="back-link">← Back to User Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
