import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import robotAvatar from'./assets/robot.png';
import cardImage from './assets/cardImage.png';
import LoadingEllipsis from './components/LoadingEllipsis';

interface ThreadContent {
  text: {
    value: string
  }
}

interface ThreadMessage {
  id: string,
  content: ThreadContent[],
  role: string,
  thread_id: string,
  assistant_id: string,
  created_at: number,
};

interface UnsentMessage { content: ThreadContent[], id:string, role: string };

type AnyMessage = (ThreadMessage|UnsentMessage)

interface MessageResponse { threadId: string, messages: ThreadMessage[] };

const geAssistantPrompt = () => {
  const placeholders = [
    "Ask me anything",
    "Ask me your burning questions",
  ];

  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

const defaultAssistantMessage = {
  content: [{
    text: {
      value: geAssistantPrompt(),
    }
  }],
  role: 'assistant',
  id: 'assistant-prompt',
  created_at: new Date().getTime(),
};

const App = () => {
  const [messages, setMessages] = useState<AnyMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [threadId, setThreadId] = useState<(string|null)>(null);
  const [waiting, setWaiting] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setWaiting(false);
      setMessages([defaultAssistantMessage]);
    }, 1250)
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText: string, threadId: string | null) => {
    console.log(process.env, process.env.API_URL)
    const apiUrl = process.env.API_URL || '';
    const response = await fetch(apiUrl + '/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: messageText, threadId }),
    });
    const { threadId:newThreadId, messages }:MessageResponse = await response.json();
    if (threadId !== newThreadId) {
      setThreadId(newThreadId);
    }
    return messages;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setWaiting(true);
    if (!inputValue.trim()) return;
    const userMessage:UnsentMessage = {
      content: [{
        text: {
          value: inputValue
        }
      }],
      role: 'user',
      id: 'unsent-user',
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    const serverMessages = await sendMessage(inputValue, threadId);
    setWaiting(false);
    if (serverMessages.length > 0) {
      setMessages(serverMessages.sort(msg => msg.created_at));
    }
  };

  const adjustTextareaHeight = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight -32}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className="app">
      <div className='main-content-container'>
        <div className='header' style={{ backgroundImage: `url(${cardImage})` }}></div>
        <div className='introduction'>
          Hi, I'm Ben Miriello! I made this site so you can:
        </div>
        <div className="chat-window">
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg.id} id={msg.id} className={`message ${msg.role}`}>
                { msg.role !== 'assistant' ? null :
                  <img src={robotAvatar} alt='face of a friendly robot assistant' className='assistant-avatar' />
                }
                {msg.content[0].text.value}
              </div>
            ))}
            { waiting && <LoadingEllipsis />}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="message-form">
            <textarea
              className="message-input"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); adjustTextareaHeight(e); }}
              onKeyDown={handleKeyDown}
              placeholder={'Message Miriello GPT...'}
              rows={1}
            ></textarea>
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
