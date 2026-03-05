import { useState, useRef } from 'react';
import { ExperienceBlock, ExperienceResponse } from '../types';

interface ExperienceProps {
  blocks: ExperienceBlock[];
  onComplete: (responses: ExperienceResponse[]) => void;
}

export default function Experience({ blocks, onComplete }: ExperienceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const responsesRef = useRef<ExperienceResponse[]>([]);

  const block = blocks[currentIndex];
  const isLast = currentIndex === blocks.length - 1;
  const isInteractive =
    block?.type === 'question' ||
    block?.type === 'reflection' ||
    block?.type === 'challenge' ||
    block?.type === 'multiplechoice';

  const advance = () => {
    if (isLast) {
      onComplete(responsesRef.current);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setUserInput('');
    setSelectedOption(null);
    setShowFeedback(false);
    setSubmitted(false);
  };

  const handleTextSubmit = () => {
    if (userInput.trim()) {
      responsesRef.current.push({
        blockIndex: currentIndex,
        blockTitle: block.title,
        blockType: block.type,
        userResponse: userInput.trim(),
      });
      setSubmitted(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    responsesRef.current.push({
      blockIndex: currentIndex,
      blockTitle: block.title,
      blockType: block.type,
      userResponse: option,
    });
    setSelectedOption(option);
    setShowFeedback(true);
  };

  if (!block) return null;

  const canContinue =
    !isInteractive ||
    submitted ||
    (block.type === 'multiplechoice' && showFeedback);

  return (
    <div className="experience">
      <div className="experience-progress">
        <div className="experience-progress-text">
          {currentIndex + 1} of {blocks.length}
        </div>
      </div>

      <div className="experience-block fade-in" key={currentIndex}>
        {block.title && <h3 className="block-title">{block.title}</h3>}

        <div className="block-content">
          {block.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Multiple choice */}
        {block.type === 'multiplechoice' && block.options && (
          <div className="block-options">
            {block.options.map((option) => (
              <button
                key={option}
                className={`option-btn ${
                  selectedOption === option ? 'selected' : ''
                } ${showFeedback && selectedOption !== option ? 'dimmed' : ''}`}
                onClick={() => !showFeedback && handleOptionSelect(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
            {showFeedback && selectedOption && block.feedback && (
              <div className="option-feedback fade-in">
                {block.feedback[selectedOption] ||
                  "That's an interesting choice. Let's see how it plays out."}
              </div>
            )}
          </div>
        )}

        {/* Text input for question, reflection, challenge */}
        {(block.type === 'question' ||
          block.type === 'reflection' ||
          block.type === 'challenge') && (
          <div className="block-input-area">
            {!submitted ? (
              <>
                <textarea
                  className="block-textarea"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={block.placeholder || 'Take a moment to think, then write your response...'}
                  rows={4}
                  autoFocus
                />
                <button
                  className="btn-secondary"
                  onClick={handleTextSubmit}
                  disabled={!userInput.trim()}
                >
                  Done
                </button>
              </>
            ) : (
              <div className="block-user-response fade-in">
                <div className="response-label">Your response</div>
                <p>{userInput}</p>
              </div>
            )}
          </div>
        )}

        {canContinue && (
          <button className="btn-continue fade-in" onClick={advance}>
            {isLast ? 'Finish' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
}
