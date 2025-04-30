import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forgotRepPassword.css'; 

export default function ForgotRepPassword() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/request-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();
            setMessage(data.message);
            if (data.status === 'success') {
                setTimeout(() => navigate('/admin-login'), 2000);
            }
        } catch (err) {
            setMessage('Server error. Please try again.');
        }
    };

    return (
        <div className="forgot-wrapper">
            <div className="forgot-card">
                <h2>Request Password Reset</h2>
                <p>Customer Representatives only</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Customer Rep Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit">Send Request</button>
                </form>
                {message && <p className="forgot-message">{message}</p>}
            </div>
        </div>
    );
}
