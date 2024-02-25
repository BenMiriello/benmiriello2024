import { UnsentMessage } from '../../../../shared/types';

export const geAssistantIcebreaker = () => {
  const placeholders = [
    "Ask me anything",
    "Ask me your burning questions",
  ];

  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

export const formatAssistantIcebreaker = () => ({
  content: [{
    text: {
      value: geAssistantIcebreaker(),
    }
  }],
  role: 'assistant',
  id: 'assistant-icebreaker',
  created_at: new Date(Date.now() - 86400000).getTime(),
});

export const formatUnsentUserMessage = (message: string): UnsentMessage => ({
  content: [{
    text: {
      value: message
    }
  }],
  role: 'user',
  id: 'unsent-user',
});
