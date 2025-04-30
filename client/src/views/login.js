import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/login.css';

function Login() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Logging in...');

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setMsg(`Welcome, ${data.user.username}!`);
        navigate('/products');
      } else {
        setMsg(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1><span className="highlight">Login</span> to your account.</h1>
        <p>Access all your services in one place. Simple and secure.</p>
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit}>
          <label>Email or mobile number</label>
          <input
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="row-between">
            <a href="/forgot-password" className="link">Forgot password?</a>
            <Link to="/admin-login" className="link">Login as Admin</Link>
          </div>

          <button type="submit" className="login-button">Continue</button>
          <div className="divider" />
          <div className="loginsignup-container">
            <p className="signup-text">
              Don’t have an account yet? <Link to="/signup" className="create-link">Create one.</Link>
            </p>
          </div>
          <p className="login-message">{msg}</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
