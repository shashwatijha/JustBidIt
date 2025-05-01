import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustFaq() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setQuestions(data.faqs);
        }
      });
  }, []);

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

  return (
    <div className="container py-4">
      <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
        <h4 className="m-0 fw-bold">🟦 IKEA | Customer FAQs</h4>
        <span className="badge bg-warning text-dark">Support</span>
      </div>

      <div className="mt-4">
        <h5 className="fw-bold text-dark mb-3">💬 Help / Q&A Section</h5>

        <form onSubmit={handleSubmit} className="row g-2 align-items-center mb-4">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Ask your question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-warning btn-sm px-3 fw-semibold">Submit</button>
          </div>
        </form>

        {questions.length === 0 && (
          <div className="alert alert-info">No questions have been asked yet.</div>
        )}

        <div className="d-flex flex-column gap-3">
          {questions.map((q, idx) => (
            <div key={idx} className="card shadow-sm">
              <div className="card-body">
                <p className="fw-semibold mb-1"><strong>Q:</strong> {q.question}</p>
                <p className="mb-0"><strong>A:</strong> {q.answer || '⏳ Awaiting response'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustFaq;
