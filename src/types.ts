export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type Stage =
  | 'welcome'
  | 'diagnostic'
  | 'reflection'
  | 'modality'
  | 'experience'
  | 'completion';

export type Modality = 'scenario' | 'challenge' | 'reflection';

export interface DiagnosticData {
  learningFocus: string;
  realContext: string;
  keyGap: string;
  suggestedModality: string;
  suggestedVisualStyle: string;
  tonePace: string;
  motivationHook: string;
}

export interface ExperienceBlock {
  type:
    | 'narrative'
    | 'scenario'
    | 'question'
    | 'multiplechoice'
    | 'reflection'
    | 'insight'
    | 'challenge';
  title?: string;
  content: string;
  options?: string[];
  feedback?: Record<string, string>;
  placeholder?: string;
}

export interface ExperienceResponse {
  blockIndex: number;
  blockTitle?: string;
  blockType: string;
  userResponse: string;
}
