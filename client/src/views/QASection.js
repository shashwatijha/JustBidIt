import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custRepDashboard.css';

function CustFaq() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setQuestions(data.faqs);
        }
      });
  }, []);

  const handleLogout = () => {
    window.location.href = '/login';
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    fetch('/api/faq/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: newQuestion,
        user_id: 1
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
    <div className="rep-dashboard-container">
      <header className="rep-header">
        <div className="rep-header-title">
          <span className="ikea-logo">🟦 IKEA</span>
          <span className="dashboard-title">Customer FAQs</span>
        </div>
        <button className="ikea-logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="rep-main">
        <div className="questions-wrapper">
          <h2 className="mb-4">💬 Help / Q&A Section</h2>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
            {/* Search Bar */}
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: '1 1 200px', minWidth: '150px' }}
            />

            {/* Ask Question Form */}
            <form
              onSubmit={handleSubmit}
              className="d-flex gap-2 align-items-center"
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
    </div>
  );
}

export default CustFaq;
