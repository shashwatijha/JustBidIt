import { useEffect, useState } from 'react';
import '../styles/createCustRep.css';

export default function ResetRequests() {
    const [requests, setRequests] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch('/admin/reset-requests')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setRequests(data.requests);
                }
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch(`/admin/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: selectedUser, password: newPassword }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            setStatus('success');
            setMessage('Password reset successfully.');
            setNewPassword('');
            setRequests(prev => prev.filter(r => r.username !== selectedUser));
            setSelectedUser('');
        } else {
            setStatus('error');
            setMessage(data.message || 'Reset failed.');
        }

    };

    return (
        <div className="reset-container">
            <aside className="reset-sidebar">
                <h3>Pending Forgot Passwords</h3>
                <ul>
                    {requests.map(req => (
                        <li key={req.id} onClick={() => setSelectedUser(req.username)}>
                            {req.username}
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="form-wrapper">
                {requests.length === 0 ? (
                    <div className="no-requests">
                        <h2>No pending password reset requests</h2>
                    </div>
                ) : selectedUser ? (
                    <>
                        <h2>Reset Password for {selectedUser}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <label>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Reset Password</button>
                            {message && (
                                <p className={`form-message ${status === 'success' ? 'success' : 'error'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </>
                ) : (
                    <h2>Select a user from the left</h2>
                )}
            </div>
        </div>
    );
}
