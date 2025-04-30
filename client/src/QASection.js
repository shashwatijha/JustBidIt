import React, { useState } from 'react';
import './QASection.css';

function QASection() {
  const [questions, setQuestions] = useState([
    { id: 1, question: 'How do I place a bid?', answer: 'Click the "Bid Now" button.' },
    { id: 2, question: 'Can I cancel a bid?', answer: 'Contact customer support.' },
  ]);

  const [newQuestion, setNewQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newEntry = {
      id: questions.length + 1,
      question: newQuestion,
      answer: 'Awaiting response...',
    };

    setQuestions([...questions, newEntry]);
    setNewQuestion('');
  };

  return (
    <div className="qa-container">
      <h2>❓ Help / Q&A Section</h2>
      <form onSubmit={handleSubmit} className="qa-form">
        <input
          type="text"
          placeholder="Ask your question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div className="qa-list">
        {questions.map((q) => (
          <div key={q.id} className="qa-item">
            <p><strong>Q:</strong> {q.question}</p>
            <p><strong>A:</strong> {q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QASection;
