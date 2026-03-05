import { useState, useCallback } from 'react';
import {
  Stage,
  Message,
  Modality,
  DiagnosticData,
  ExperienceBlock,
  ExperienceResponse,
} from './types';
import {
  extractDiagnosticData,
  generateReflection,
  generateExperience,
} from './api';
import Welcome from './components/Welcome';
import Diagnostic from './components/Diagnostic';
import Reflection from './components/Reflection';
import ModalityChoice from './components/ModalityChoice';
import Experience from './components/Experience';
import Completion from './components/Completion';

export default function App() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [transitioning, setTransitioning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(
    null
  );
  const [reflection, setReflection] = useState('');
  const [experienceBlocks, setExperienceBlocks] = useState<ExperienceBlock[]>(
    []
  );
  const [experienceResponses, setExperienceResponses] = useState<
    ExperienceResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goTo = useCallback((nextStage: Stage) => {
    setTransitioning(true);
    setTimeout(() => {
      setStage(nextStage);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }, []);

  const handleBegin = () => goTo('diagnostic');

  const handleDiagnosticComplete = async (conversationMessages: Message[]) => {
    setMessages(conversationMessages);
    setLoading(true);
    setError(null);
    goTo('reflection');

    // Step 1: Extract structured diagnostic data
    let diagData: DiagnosticData;
    try {
      diagData = await extractDiagnosticData(conversationMessages);
      setDiagnosticData(diagData);
    } catch (err) {
      console.error('Error extracting diagnostic data:', err);
      // Fallback: create minimal diagnostic data so we can continue
      diagData = {
        learningFocus: 'Based on our conversation',
        realContext: 'Professional development',
        keyGap: 'To be explored through the learning experience',
        suggestedModality: 'scenario',
        tonePace: 'Moderate depth and pace',
        motivationHook: 'Personal growth',
      };
      setDiagnosticData(diagData);
    }

    // Step 2: Generate reflection
    try {
      const reflText = await generateReflection(
        conversationMessages,
        diagData
      );
      setReflection(reflText);
      setLoading(false);
    } catch (err) {
      console.error('Error generating reflection:', err);
      // Fallback: use a simple reflection so the flow can continue
      setReflection(
        "I've been listening carefully to what you've shared. There's something worth exploring here — let's design a learning experience around it and see what emerges."
      );
      setLoading(false);
    }
  };

  const handleReflectionConfirm = (feedback: string) => {
    // If feedback was provided, append it to the context
    if (feedback && diagnosticData) {
      setDiagnosticData({
        ...diagnosticData,
        realContext:
          diagnosticData.realContext + ` Learner clarification: ${feedback}`,
      });
    }
    goTo('modality');
  };

  const handleModalitySelect = async (modality: Modality) => {
    setLoading(true);
    setError(null);
    goTo('experience');

    try {
      const blocks = await generateExperience(
        messages,
        diagnosticData!,
        modality
      );
      setExperienceBlocks(blocks);
      setLoading(false);
    } catch (err) {
      console.error('Error generating experience:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(
        `Something went wrong while creating your experience: ${msg}`
      );
      setLoading(false);
    }
  };

  const handleExperienceComplete = (responses: ExperienceResponse[]) => {
    setExperienceResponses(responses);
    goTo('completion');
  };

  const handleRestart = () => {
    setMessages([]);
    setDiagnosticData(null);
    setReflection('');
    setExperienceBlocks([]);
    setExperienceResponses([]);
    setError(null);
    goTo('welcome');
  };

  return (
    <div className="app">
      <div className={`container ${transitioning ? 'stage-exit' : 'stage-enter'}`}>
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {stage === 'welcome' && <Welcome onBegin={handleBegin} />}

        {stage === 'diagnostic' && (
          <Diagnostic onComplete={handleDiagnosticComplete} />
        )}

        {stage === 'reflection' &&
          (loading ? (
            <div className="loading-state">
              <p className="loading-text">Taking a moment to reflect on what you've shared...</p>
            </div>
          ) : (
            reflection && (
              <Reflection
                reflection={reflection}
                onConfirm={handleReflectionConfirm}
              />
            )
          ))}

        {stage === 'modality' && (
          <ModalityChoice
            suggestedModality={diagnosticData?.suggestedModality}
            onSelect={handleModalitySelect}
          />
        )}

        {stage === 'experience' &&
          (loading ? (
            <div className="loading-state">
              <p className="loading-text">Designing your learning experience...</p>
              <p className="loading-subtext">This takes a moment. We're building something just for you.</p>
            </div>
          ) : (
            experienceBlocks.length > 0 && (
              <Experience
                blocks={experienceBlocks}
                onComplete={handleExperienceComplete}
              />
            )
          ))}

        {stage === 'completion' && (
          <Completion
            messages={messages}
            diagnosticData={diagnosticData}
            experienceBlocks={experienceBlocks}
            experienceResponses={experienceResponses}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
