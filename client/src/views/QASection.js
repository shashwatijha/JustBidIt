import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custRepDashboard.css';
import Layout from './layout';

function CustFaq() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setQuestions(data.faqs);
        }
      });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:8000/api/notifications?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setNotificationCount(data.length);
      })
      .catch(err => console.error("Failed to fetch notifications", err));
  }, [userId]);

  const handleClearNotifications = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/notifications/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (res.ok) {
        setNotifications([]);
        setNotificationCount(0);
        setShowNotifications(false);
      } else {
        console.error('Failed to clear notifications');
      }
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    fetch('/api/faq/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: newQuestion,
        user_id: parseInt(userId)
      })
    }).then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setQuestions([{ question: newQuestion, answer: null }, ...questions]);
          setNewQuestion('');
        }
      });
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      notificationCount={notificationCount}
      onAlertClick={() => setShowNotifications(true)}
    >
      <main className="rep-main">
        <div className="questions-wrapper">
          <h2 className="mb-4">💬 Help / Q&A Section</h2>

          <div className="align-items-center gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: '1 1 200px', minWidth: '150px' }}
            />

            <form
              onSubmit={handleSubmit}
              className=" gap-2 align-items-center"
              style={{ flex: '2 1 400px', minWidth: '250px' }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Ask your question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <button type="submit" className="ikea-submit-btn">Submit</button>
            </form>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="alert alert-info mt-3">No matching questions found.</div>
          ) : (
            <div className="d-flex flex-column gap-3 mt-3">
              {filteredQuestions.map((q, idx) => (
                <div key={idx} className="card shadow-sm">
                  <div className="card-body">
                    <p className="fw-semibold mb-1"><strong>Q:</strong> {q.question}</p>
                    <p className="mb-0"><strong>A:</strong> {q.answer || '⏳ Awaiting response'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showNotifications && (
        <div className="notification-popup">
          <div className="notification-popup-content">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={() => setShowNotifications(false)}>×</button>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((note, idx) => (
                  <li key={idx}>
                    <p>{note.message}</p>
                    <small>{note.created_at}</small>
                  </li>
                ))
              ) : (
                <li>No notifications available.</li>
              )}
            </ul>
          </div>
          <button onClick={handleClearNotifications} className="clear-button">
            Clear All
          </button>
        </div>
      )}
    </Layout>
  );
}

export default CustFaq;
