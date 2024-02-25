import React, { useEffect, useRef, useState } from 'react';
import LoadingEllipsis from '../LoadingEllipsis/LoadingEllipsis';
import {
  formatAssistantIcebreaker,
  formatUnsentUserMessage,
} from './offThreadMessages';
import { ThreadMessage, UnsentMessage, MessageResponse } from '../../../../shared/types';
import robotAvatar from'../../assets/robot.png';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState<(ThreadMessage|UnsentMessage)[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [threadId, setThreadId] = useState<(string|null)>(null);
  const [waiting, setWaiting] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setWaiting(false);
      setMessages([formatAssistantIcebreaker()]);
    }, 1500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (message: string | null, threadId: string | null) => {
    const apiUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL : '';
    const payload = { message, threadId };

    const response = await fetch(apiUrl + '/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const { threadId: newThreadId, messages: newMessages }:MessageResponse = await response.json();

    if (threadId !== newThreadId) {
      setThreadId(newThreadId);
    }

    return newMessages;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (waiting || !inputValue.trim()) return;

    setWaiting(true);
    const userMessage = formatUnsentUserMessage(inputValue);
    setMessages([...messages, userMessage]);
    setInputValue('');

    const serverMessages = await sendMessage(inputValue, threadId);
    setWaiting(false);

    if (serverMessages.length > 0) {
      setMessages([
        formatAssistantIcebreaker(),
        ...serverMessages.sort(msg => msg.created_at)
      ]);
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
  );
}

export default Chat;
