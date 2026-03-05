import { useState, useEffect } from 'react';
import {
  Message,
  DiagnosticData,
  ExperienceBlock,
  ExperienceResponse,
} from '../types';
import {
  generatePersonalisedClosing,
  PersonalisedClosing,
} from '../api';

interface CompletionProps {
  messages: Message[];
  diagnosticData: DiagnosticData | null;
  experienceBlocks: ExperienceBlock[];
  experienceResponses: ExperienceResponse[];
  onRestart: () => void;
}

export default function Completion({
  messages,
  diagnosticData,
  experienceBlocks,
  experienceResponses,
  onRestart,
}: CompletionProps) {
  const [closing, setClosing] = useState<PersonalisedClosing | null>(null);
  const [loading, setLoading] = useState(true);
  const [commitmentInput, setCommitmentInput] = useState('');
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    if (!diagnosticData || experienceResponses.length === 0) {
      // If somehow we don't have enough data, show a simpler close
      setClosing({
        observations:
          "You worked through this with genuine engagement — that already sets you apart from most people who encounter learning content.",
        takeaways:
          "The fact that you chose to reflect on this topic and work through a structured experience means something. Hold onto the moments that made you pause.",
        nudge:
          "The next time this comes up in your real work, you'll notice yourself thinking differently. That's the shift.",
      });
      setLoading(false);
      return;
    }

    generatePersonalisedClosing(
      messages,
      diagnosticData,
      experienceBlocks,
      experienceResponses
    )
      .then((result) => {
        setClosing(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error generating closing:', err);
        setClosing({
          observations:
            "You worked through this with genuine engagement — that already sets you apart from most people who encounter learning content.",
          takeaways:
            "The fact that you chose to reflect on this topic and work through a structured experience means something. Hold onto the moments that made you pause.",
          nudge:
            "The next time this comes up in your real work, you'll notice yourself thinking differently. That's the shift.",
        });
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="loading-state">
        <p className="loading-text">
          Taking a moment to reflect on how you worked through this...
        </p>
      </div>
    );
  }

  if (!closing) return null;

  return (
    <div className="completion">
      {!committed ? (
        <>
          <div className="closing-section fade-in">
            <h2>Here's what I noticed.</h2>
            <p className="closing-observations">{closing.observations}</p>
          </div>

          <div className="closing-section fade-in" style={{ animationDelay: '0.2s' }}>
            <h3>Worth holding onto</h3>
            <p className="closing-takeaways">{closing.takeaways}</p>
          </div>

          <div className="closing-section fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="closing-nudge">{closing.nudge}</p>
          </div>

          <div className="closing-commitment fade-in" style={{ animationDelay: '0.6s' }}>
            <h3>One last thing.</h3>
            <p className="completion-prompt">
              What's one thing you'll do differently now?
            </p>
            <p className="completion-subtext">
              Not what you learned. What you'll actually <em>do</em>.
            </p>
            <textarea
              className="completion-input"
              value={commitmentInput}
              onChange={(e) => setCommitmentInput(e.target.value)}
              placeholder="Be specific — the more concrete, the more likely it'll stick."
              rows={4}
              autoFocus
            />
            <button
              className="btn-primary"
              onClick={() => setCommitted(true)}
              disabled={!commitmentInput.trim()}
            >
              I'm done
            </button>
          </div>
        </>
      ) : (
        <div className="completion-done fade-in">
          <h2>That's it.</h2>
          <p>
            You had a real conversation, worked through something designed around
            what matters to you, and took the time to think about what comes next.
            That's more than most learning ever asks.
          </p>
          <p className="completion-note">
            Hold onto what you just wrote down. The learning that sticks is the
            learning you act on.
          </p>
          <button className="btn-secondary" onClick={onRestart}>
            Start a new conversation
          </button>
        </div>
      )}
    </div>
  );
}
