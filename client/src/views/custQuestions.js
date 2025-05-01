import React, { useEffect, useState } from 'react';
import '../styles/custRepDashboard.css';

export default function Questions() {
  const [unanswered, setUnanswered] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch('/api/faq/unanswered')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setUnanswered(data.faqs);
        }
      });
  }, []);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (id) => {
    const answer = answers[id];
    if (!answer || !answer.trim()) return;

    fetch(`/api/faq/answer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setUnanswered(unanswered.filter(q => q.id !== id));
          const updatedAnswers = { ...answers };
          delete updatedAnswers[id];
          setAnswers(updatedAnswers);
        }
      });
  };

  return (
    <div className="rep-main">
      <div className="questions-wrapper">
        <h2 className="faq-title">Pending Answers <span className="">({unanswered.length})</span></h2>

        {unanswered.length === 0 ? (
          <div className="alert alert-success">All questions have been answered.</div>
        ) : (
          unanswered.map((q) => (
            <div key={q.id} className="question-card mb-4">
              <p className="question-text">Q: {q.question}</p>
              <textarea
                className="form-control ikea-answer-box mb-2"
                placeholder="Type your answer..."
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
              <div className="question-card-footer">
                <span className="asked-by">Asked by: {q.username}</span>
                <button className="ikea-submit-btn" onClick={() => handleSubmit(q.id)}>
                  Submit Answer
                </button>
              </div>
            </div>

          ))
        )}
      </div>
    </div>
  );
}
