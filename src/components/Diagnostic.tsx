import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { streamDiagnosticMessage } from '../api';

const INITIAL_MESSAGE =
  "Hi. Before we design anything, I'd like to understand what's going on for you right now. What brought you here — is there something specific you're looking to learn, or more of a feeling that something needs to shift?";

interface DiagnosticProps {
  onComplete: (messages: Message[]) => void;
}

export default function Diagnostic({ onComplete }: DiagnosticProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [finalMessages, setFinalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isComplete]);

  useEffect(() => {
    if (!isStreaming && !isComplete && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming, isComplete]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || isComplete) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    try {
      const fullResponse = await streamDiagnosticMessage(
        updatedMessages,
        (text) => setStreamingText(text)
      );

      // Check for completion marker
      const complete = fullResponse.includes('[DIAGNOSTIC_COMPLETE]');
      const cleanedResponse = fullResponse
        .replace('[DIAGNOSTIC_COMPLETE]', '')
        .trim();

      const allMessages: Message[] = [
        ...updatedMessages,
        { role: 'assistant', content: cleanedResponse },
      ];

      setMessages(allMessages);
      setStreamingText('');
      setIsStreaming(false);

      if (complete) {
        setIsComplete(true);
        setFinalMessages(allMessages);
      }
    } catch (error) {
      console.error('Diagnostic error:', error);
      setStreamingText('');
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, something went wrong on my end. Could you try saying that again?",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="diagnostic">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="message-label">Coach</div>
            )}
            {msg.role === 'user' && <div className="message-label">You</div>}
            <div className="message-text">{msg.content}</div>
          </div>
        ))}

        {isStreaming && streamingText && (
          <div className="message message-assistant">
            <div className="message-label">Coach</div>
            <div className="message-text">{streamingText}</div>
          </div>
        )}

        {isStreaming && !streamingText && (
          <div className="message message-assistant">
            <div className="message-label">Coach</div>
            <div className="message-text thinking">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="diagnostic-continue fade-in">
            <button
              className="btn-primary"
              onClick={() => onComplete(finalMessages)}
            >
              Continue
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!isComplete && (
        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            rows={1}
            disabled={isStreaming}
          />
          <button
            className="btn-send"
            onClick={handleSubmit}
            disabled={isStreaming || !input.trim()}
            aria-label="Send"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
