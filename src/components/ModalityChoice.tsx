import { useState } from 'react';
import { Modality } from '../types';

interface ModalityChoiceProps {
  suggestedModality?: string;
  onSelect: (modality: Modality) => void;
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
    id: 'build',
    title: 'Build something to share',
    description:
      'Create something short and practical you could actually use with your team. Learn by making.',
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
  onSelect,
}: ModalityChoiceProps) {
  const [selected, setSelected] = useState<Modality | null>(null);

  return (
    <div className="modality-choice">
      <h2>How would you like to learn this?</h2>
      <p className="modality-subtitle">
        Pick the approach that feels right for you right now.
      </p>

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
