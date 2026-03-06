import { useState } from 'react';
import { Modality } from '../types';
import { themes, ThemeConfig } from '../themes';

interface ModalityChoiceProps {
  suggestedModality?: string;
  suggestedStyle?: string;
  onSelect: (modality: Modality) => void;
  onStyleChange: (styleId: string) => void;
}

const MODALITIES: { id: Modality; title: string; description: string }[] = [
  {
    id: 'scenario',
    title: 'Work through a realistic scenario',
    description:
      'Step into a situation drawn from your context and make decisions as you go. See what happens.',
  },
  {
    id: 'challenge',
    title: 'Solve a challenge',
    description:
      "Tackle a concrete problem head-on. Think it through, try your approach, and get feedback on how you're thinking.",
  },
  {
    id: 'reflection',
    title: 'Guided reflection',
    description:
      'Work through a series of structured questions that help you think differently about this. Quiet, focused, and deep.',
  },
];

export default function ModalityChoice({
  suggestedModality,
  suggestedStyle,
  onSelect,
  onStyleChange,
}: ModalityChoiceProps) {
  const [selected, setSelected] = useState<Modality | null>(null);
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [activeStyle, setActiveStyle] = useState(suggestedStyle || 'calm-focused');

  const currentTheme = themes.find((t) => t.id === activeStyle) || themes[3];

  const handleStyleSelect = (theme: ThemeConfig) => {
    setActiveStyle(theme.id);
    onStyleChange(theme.id);
    setShowStyleOptions(false);
  };

  return (
    <div className="modality-choice">
      <h2>How would you like to learn this?</h2>
      <p className="modality-subtitle">
        Pick the approach that feels right for you right now.
      </p>

      {/* Style selector */}
      <div className="style-section">
        <div className="style-label">Visual style</div>
        <div className="style-recommended">
          <div className="style-recommended-info">
            <span className="style-name">{currentTheme.name}</span>
            <span className="style-vibe">{currentTheme.vibe}</span>
          </div>
          <button
            className="style-change-btn"
            onClick={() => setShowStyleOptions(!showStyleOptions)}
          >
            {showStyleOptions ? 'Close' : 'Change'}
          </button>
        </div>

        {showStyleOptions && (
          <div className="style-options fade-in">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`style-option ${activeStyle === theme.id ? 'active' : ''}`}
                onClick={() => handleStyleSelect(theme)}
              >
                <span className="style-option-name">{theme.name}</span>
                <span className="style-option-vibe">{theme.vibe}</span>
                <div className="style-option-swatch">
                  <span
                    className="style-swatch-dot"
                    style={{ background: theme.colors.bg }}
                  />
                  <span
                    className="style-swatch-dot"
                    style={{ background: theme.colors.accent }}
                  />
                  <span
                    className="style-swatch-dot"
                    style={{ background: theme.colors.text }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <hr className="modality-divider" />

      <div className="modality-cards">
        {MODALITIES.map((m) => (
          <button
            key={m.id}
            className={`modality-card ${selected === m.id ? 'selected' : ''} ${
              suggestedModality === m.id ? 'suggested' : ''
            }`}
            onClick={() => setSelected(m.id)}
          >
            <div className="modality-card-title">{m.title}</div>
            <div className="modality-card-desc">{m.description}</div>
            {suggestedModality === m.id && (
              <div className="modality-suggested">Might suit you</div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="modality-confirm fade-in">
          <button className="btn-primary" onClick={() => onSelect(selected)}>
            Let's go with this
          </button>
        </div>
      )}
    </div>
  );
}
