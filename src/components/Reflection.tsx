import { useState } from 'react';

interface ReflectionProps {
  reflection: string;
  onConfirm: (feedback: string) => void;
}

export default function Reflection({ reflection, onConfirm }: ReflectionProps) {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="reflection">
      <h2>Here's what I'm hearing.</h2>
      <p className="reflection-text">{reflection}</p>

      {!showFeedback ? (
        <div className="reflection-actions">
          <button
            className="btn-primary"
            onClick={() => onConfirm(feedback)}
          >
            This feels right — let's continue
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowFeedback(true)}
          >
            Not quite — let me clarify
          </button>
        </div>
      ) : (
        <div className="reflection-feedback">
          <textarea
            className="feedback-input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What would you adjust or add?"
            rows={3}
            autoFocus
          />
          <button
            className="btn-primary"
            onClick={() => onConfirm(feedback)}
            disabled={!feedback.trim()}
          >
            Continue with this in mind
          </button>
        </div>
      )}
    </div>
  );
}
