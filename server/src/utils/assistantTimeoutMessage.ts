const timeoutMessages = [
  'Request timed out. Trying carrier pigeons instead.',
  'Request timed out. Attempting dangerous rituals to get it going again',
  'Request timed out. Hiring new server gnomes.',
  'Request timed out. Reopening diplomatic channels with openai.',
  'Request timed out. Retrying new hailing frequencies.',
];

export const assistantTimeoutMessage = () => ({
  role: 'assistant',
  created_at: new Date().getTime(),
  id: `assistant-error-${new Date().getTime()}`,
  content: [{
    type: 'text',
    text: {
      value: timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)],
    }
  }]
});
