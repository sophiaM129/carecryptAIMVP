import React, { useState, useRef, useEffect, useMemo } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { useAuth } from '../context/AuthContext';
import { useMedicalData } from '../context/MedicalDataContext';
import './PulseAI.css';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  isError?: boolean;
}

const MODEL = 'claude-sonnet-5';

const buildSystemPrompt = (name: string, hasData: boolean, summary: string): string => `You are Pulse AI, a compassionate and knowledgeable health assistant built into CareCrypt AI — India's first interoperable health record platform. You help patients understand their prescriptions, medical history, symptoms, and general health questions.

The person you're speaking with is named ${name || 'the user'}.
${hasData ? `Here is a summary of their saved medical profile, which you can refer to naturally when relevant:\n${summary}` : 'They have not filled in their Medical History yet, so you have no saved health data about them — you can gently suggest they fill it in if it would help answer their question.'}

Key behaviours:
- Be warm, clear, and concise. Never use jargon without explaining it.
- When a user describes a prescription, extract the medicines, dosages, and instructions clearly in a structured way.
- Always remind users that you provide informational support only and they should consult a qualified doctor for medical decisions.
- Keep responses focused and scannable — use short paragraphs or bullet points when listing medicine details.
- Address the user as "you" and speak in second person.`;

const PulseAIPage: React.FC = () => {
  const { userName } = useAuth();
  const { medicalData, hasSavedData } = useMedicalData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const client = useMemo(() => {
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    if (!apiKey) return null;
    return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  }, []);

  const dataSummary = useMemo(() => {
    if (!hasSavedData) return '';
    const parts: string[] = [];
    if (medicalData.bloodGroup) parts.push(`Blood group: ${medicalData.bloodGroup}`);
    if (medicalData.allergens.length) parts.push(`Allergies: ${medicalData.allergens.join(', ')}`);
    if (medicalData.medicalConditions.length) parts.push(`Conditions: ${medicalData.medicalConditions.join(', ')}`);
    if (medicalData.medications.length) {
      parts.push(`Current medications: ${medicalData.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}`);
    }
    if (medicalData.immunizations.length) parts.push(`Immunizations on file: ${medicalData.immunizations.join(', ')}`);
    return parts.join('\n');
  }, [medicalData, hasSavedData]);

  const quickPrompts = useMemo(() => {
    if (hasSavedData) {
      return [
        { label: 'Summarize my health profile', icon: '📋' },
        { label: 'What should I know about my current medications?', icon: '💊' },
        { label: 'Any precautions for my allergies?', icon: '⚠️' },
      ];
    }
    return [
      { label: 'Please upload your prescription', icon: '📋' },
      { label: 'Type out my prescription', icon: '✍️' },
      { label: 'How may I help you?', icon: '💬' },
    ];
  }, [hasSavedData]);

  const UPLOAD_PLACEHOLDER_REPLY =
    "File uploads aren't supported in this chat yet — there's no way for me to actually receive an image or PDF here. " +
    "If you type or paste the prescription details instead (medicine names, dosages, instructions), I can go through them with you right away.";

  const GENERIC_PLACEHOLDER_REPLY =
    "Thanks for sharing that. Pulse AI is running in preview mode right now, so this is a placeholder response rather than a live, personalized one. " +
    "In the full version, I'd go through your actual saved medical records and give you a detailed, specific answer here.";

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end' });
    }
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput('');
    setShowQuick(false);
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);

    // No real file-upload input exists anywhere in this chat, so rather than
    // spend a real API call pretending to process a file that was never sent,
    // this one quick prompt always gets an honest, immediate placeholder reply.
    if (userText === 'Please upload your prescription') {
      setMessages(m => [...m, { role: 'ai', text: UPLOAD_PLACEHOLDER_REPLY }]);
      return;
    }

    // Runs fully without any configuration. If a real Anthropic key is present
    // (REACT_APP_ANTHROPIC_API_KEY), it's used for a real reply; otherwise the
    // chat still works end-to-end with an honest placeholder response.
    if (!client) {
      setMessages(m => [...m, { role: 'ai', text: GENERIC_PLACEHOLDER_REPLY }]);
      return;
    }
    setLoading(true);

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(userName, hasSavedData, dataSummary),
        messages: newMessages.map(m => ({
          role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
          content: m.text,
        })),
      });
      const textBlock = response.content.find(b => b.type === 'text');
      const replyText = textBlock && 'text' in textBlock ? textBlock.text : "Sorry, I didn't get a response. Please try again.";
      setMessages(m => [...m, { role: 'ai', text: replyText }]);
    } catch (err: any) {
      const message = err?.message || 'Something went wrong reaching Pulse AI. Please try again in a moment.';
      setMessages(m => [...m, { role: 'ai', text: message, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pulse-page">
      <div className="pulse-header">
        <div className="pulse-title-row">
          <span className="pulse-title">Pulse AI</span>
          <span className="pulse-badge">● Live</span>
        </div>
        <div className="pulse-sub">Your AI-powered health assistant — ask about prescriptions, symptoms, or your records</div>
      </div>

      <div className="pulse-chat-wrap">
        <div className="pulse-chat-area">
          {showQuick && messages.length === 0 && (
            <div className="pulse-empty-state">
              <div className="pulse-orb">💊</div>
              <div className="pulse-empty-title">Hello{userName ? `, ${userName.split(' ')[0]}` : ''}. I'm Pulse AI</div>
              <div className="pulse-empty-desc">
                Your personal health assistant. I can help you understand prescriptions, answer health questions,
                and guide you through your medical records.
              </div>
              <div className="pulse-quick-row">
                {quickPrompts.map(q => (
                  <button key={q.label} className="pulse-quick-btn" onClick={() => sendMessage(q.label)}>
                    <span>{q.icon}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => m.role === 'ai' ? (
            <div key={i} className="pulse-row">
              <div className="pulse-avatar">P</div>
              <div className={`pulse-bubble-ai${m.isError ? ' pulse-bubble-error' : ''}`}>{m.text}</div>
            </div>
          ) : (
            <div key={i} className="pulse-row-user">
              <div className="pulse-bubble-user">{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className="pulse-row">
              <div className="pulse-avatar">P</div>
              <div className="pulse-bubble-ai">
                <div className="pulse-typing-dots">
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>

        <div className="pulse-input-bar">
          <input
            className="pulse-chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your question, or paste a prescription…"
            disabled={loading}
          />
          <button className="pulse-send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? '…' : 'Send'}
          </button>
        </div>
      </div>
      <div className="pulse-disclaimer">Pulse AI provides informational support only — always consult a qualified doctor for medical decisions.</div>
    </div>
  );
};

export default PulseAIPage;
