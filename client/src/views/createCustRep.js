import { useState } from 'react';
import '../styles/createCustRep.css'; 

export default function CreateCustomerRep() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // success or error

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/admin/create-customer-rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setStatus('success');
        setMessage('Customer Rep created successfully!');
        setUsername('');
        setPassword('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Server error.');
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Create Customer Representative</h2>
      <form onSubmit={handleCreate} className="admin-form">
        <label>
          <input
            type="text"
            placeholder="Rep Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="Rep Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create</button>
        {message && (
          <p className={`form-message ${status === 'success' ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
