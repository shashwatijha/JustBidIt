import React, { useState } from 'react';
import '../styles/login.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("Sending reset link...");

        try {
            const res = await fetch('/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setMsg(data.message);
        } catch (err) {
            console.error(err);
            setMsg("Server error");
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <h1><span className="highlight">Reset</span> your password</h1>
                <p>Access your account securely. We’ll send you a reset link.</p>
            </div>

            <div className="login-right">
                <form onSubmit={handleSubmit}>
                    <h2 style={{ marginBottom: '1rem' }}>Forgot Password</h2>

                    <label>Email Address</label>
                    <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button type="submit" className="login-button">Request Password Reset</button>

                    {msg && <p style={{ marginTop: '1rem', fontWeight: '500', color: '#333' }}>{msg}</p>}

                    <div className="divider" />
                    <div className="loginsignup-container">
                        <p className="signup-text">
                            <a href="/login" className="create-link">Back to Sign In</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
