export interface ThemeConfig {
  id: string;
  name: string;
  vibe: string;
  colors: {
    bg: string;
    surface: string;
    accent: string;
    accentSoft: string;
    accentHover: string;
    text: string;
    textMuted: string;
    textLight: string;
    border: string;
    white: string;
    error: string;
    errorBg: string;
    success: string;
    successSoft: string;
  };
  fontDisplay: string;
  fontBody: string;
  fontUrl: string;
  radius: string;
  radiusLg: string;
  microCopy: {
    correct: string;
    incorrect: string;
    sectionComplete: string;
    allComplete: string;
    betweenSections?: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'warm-inviting',
    name: 'Warm & Inviting',
    vibe: 'Friendly, encouraging, supportive',
    colors: {
      bg: '#faf7f2',
      surface: '#ffffff',
      accent: '#e8734a',
      accentSoft: '#fde8e0',
      accentHover: '#d4623c',
      text: '#2d2a26',
      textMuted: '#6b6560',
      textLight: '#9a948e',
      border: '#e8e2da',
      white: '#ffffff',
      error: '#d94f4f',
      errorBg: '#fef2f2',
      success: '#4ead6b',
      successSoft: 'rgba(78, 173, 107, 0.12)',
    },
    fontDisplay: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontUrl:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap',
    radius: '12px',
    radiusLg: '16px',
    microCopy: {
      correct: "Spot on! That's exactly right.",
      incorrect: "Not quite — here's what to consider...",
      sectionComplete: "Great progress — you're doing well.",
      allComplete: "You've done it! Here's what you explored.",
    },
  },
  {
    id: 'clean-professional',
    name: 'Clean & Professional',
    vibe: 'Polished, efficient, trustworthy',
    colors: {
      bg: '#f8f9fa',
      surface: '#ffffff',
      accent: '#2563eb',
      accentSoft: '#dbeafe',
      accentHover: '#1d4ed8',
      text: '#1a1a2e',
      textMuted: '#6c6c80',
      textLight: '#9a9ab0',
      border: '#e2e8f0',
      white: '#ffffff',
      error: '#dc2626',
      errorBg: '#fef2f2',
      success: '#16a34a',
      successSoft: 'rgba(22, 163, 74, 0.08)',
    },
    fontDisplay: "'Manrope', sans-serif",
    fontBody: "'Manrope', sans-serif",
    fontUrl:
      'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap',
    radius: '6px',
    radiusLg: '8px',
    microCopy: {
      correct: 'Correct.',
      incorrect: 'Incorrect. The correct answer is...',
      sectionComplete: 'Section complete.',
      allComplete: 'Assessment complete.',
    },
  },
  {
    id: 'bold-energetic',
    name: 'Bold & Energetic',
    vibe: 'High-energy, gamified, rewarding',
    colors: {
      bg: '#0f0f1a',
      surface: '#1a1a2e',
      accent: '#f59e0b',
      accentSoft: 'rgba(245, 158, 11, 0.15)',
      accentHover: '#d97706',
      text: '#f0f0f0',
      textMuted: '#a0a0b8',
      textLight: '#6a6a80',
      border: '#2a2a3e',
      white: '#f0f0f0',
      error: '#ef4444',
      errorBg: 'rgba(239, 68, 68, 0.12)',
      success: '#22c55e',
      successSoft: 'rgba(34, 197, 94, 0.15)',
    },
    fontDisplay: "'Syne', sans-serif",
    fontBody: "'Space Grotesk', sans-serif",
    fontUrl:
      'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600&display=swap',
    radius: '8px',
    radiusLg: '12px',
    microCopy: {
      correct: 'Nailed it.',
      incorrect: "Not this time. Here's the deal:",
      sectionComplete: 'Section cleared.',
      allComplete: 'Finished. Final score:',
    },
  },
  {
    id: 'calm-focused',
    name: 'Calm & Focused',
    vibe: 'Minimal, reflective, intellectual',
    colors: {
      bg: '#f5f5f0',
      surface: '#fafaf7',
      accent: '#5a7c6a',
      accentSoft: '#e8f0ec',
      accentHover: '#4a6a58',
      text: '#2c2c2c',
      textMuted: '#7a7a72',
      textLight: '#a0a098',
      border: '#ddddd5',
      white: '#fafaf7',
      error: '#b85450',
      errorBg: 'rgba(184, 84, 80, 0.08)',
      success: '#5a7c6a',
      successSoft: 'rgba(90, 124, 106, 0.1)',
    },
    fontDisplay: "'Cormorant Garamond', serif",
    fontBody: "'IBM Plex Sans', sans-serif",
    fontUrl:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap',
    radius: '4px',
    radiusLg: '6px',
    microCopy: {
      correct: "Yes, that's right.",
      incorrect: 'Consider this perspective instead:',
      sectionComplete: 'Take a moment before continuing.',
      allComplete: 'Thank you for your thoughtful engagement.',
      betweenSections: 'Pause. What are you noticing?',
    },
  },
];

export function getThemeById(id: string): ThemeConfig {
  return themes.find((t) => t.id === id) || themes[3]; // default to calm-focused
}

export function getMicroCopyGuide(theme: ThemeConfig): string {
  return `
MICRO-COPY TONE GUIDE (match this style in all feedback and transition text):
- When learner is correct: "${theme.microCopy.correct}"
- When learner is incorrect: "${theme.microCopy.incorrect}"
- When a section is complete: "${theme.microCopy.sectionComplete}"
- When the experience is complete: "${theme.microCopy.allComplete}"
${theme.microCopy.betweenSections ? `- Between sections: "${theme.microCopy.betweenSections}"` : ''}
The overall tone should feel: ${theme.vibe}. Match this in all narrative text, feedback, and transitions.`.trim();
}
