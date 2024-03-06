import { IUnsentMessage } from '@sharedTypes';

const oneDay = 86400000; // 1000 * 60 * 60 * 24

const assistantPrompts = [
  "ask me anything",
  "ask me your burning questions",
];

export const getAssistantPrompt = (): IUnsentMessage => ({
  text: `Hi I'm Ben Miriello! I made this site so you can ${assistantPrompts[Math.floor(Math.random() * assistantPrompts.length)]}`,
  role: 'assistant',
  id: 'assistant-prompt',
  created_at: new Date(Date.now() - oneDay).getTime(),
});

export const formatUnsentUserMessage = (message: string): IUnsentMessage => ({
  text: message,
  role: 'user',
  id: 'user-unsent',
  created_at: new Date(Date.now() + oneDay).getTime(),
});

export const getFailedToReloadMessage = (): IUnsentMessage => ({
  text: "Sorry, I was unable to load your previous conversation. Let's give this a fresh start. What would you like to ask me about?",
  role: 'assistant',
  id: 'assistant-prompt-failed-to-reload',
  created_at: new Date(Date.now() + oneDay).getTime(),
});

export const getFailedToLoad = (): IUnsentMessage => ({
  text: "Sorry, I was unable to load your previous conversation. Let's give this a fresh start. What would you like to ask me about?",
  role: 'assistant',
  id: 'assistant-prompt-failed-to-reload',
  created_at: new Date(Date.now() + oneDay).getTime(),
});

export const assistantReloadPrompts = (handleClick: React.MouseEventHandler<HTMLElement>): IUnsentMessage[] => ([
  {
    text: 'Welcome back!',
    role: 'assistant',
    id: 'assistant-reload-prompt-1',
    created_at: new Date(Date.now() + oneDay).getTime() - 1,
  },
  {
    text: 'You can start a new chat below or:',
    role: 'assistant',
    id: 'assistant-reload-prompt-2',
    created_at: new Date(Date.now() + oneDay).getTime() - 1,
  },
  {
    text: "Contine your last conversation",
    role: 'assistant',
    id: 'assistant-reload-button',
    created_at: new Date(Date.now() + oneDay).getTime(),
    handleClick,
  }
]);


