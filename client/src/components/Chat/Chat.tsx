import React, { useEffect, useRef, useState } from 'react';
import LoadingEllipsis from '../LoadingEllipsis/LoadingEllipsis';
import Message from './Message/Message';
import { useThreads } from '../../hooks';
import { getAssistantPrompt, assistantReloadPrompts } from '../../utils/formatMessages';
import './Chat.css';

const Chat = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const thread = useThreads();

  useEffect(() => {
    const previousThreadId = thread.retrieveLocalStorageThreadId();
    if (previousThreadId) {
      thread.setLoading(false);
      const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
        e.preventDefault();
        thread.reload(previousThreadId);
      }
      thread.setMessages(assistantReloadPrompts(handleClick));
    } else {
      const assistantPrompt = getAssistantPrompt();
      thread.createThread();
      setTimeout(() => {
        thread.setMessages([assistantPrompt]);
        thread.setLoading(false);
      }, 1500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    thread.setLoading(true);
    e.preventDefault();

    if (thread.loading || !inputValue.trim()) return;

    let { threadId } = thread;
    if (!threadId) threadId = await thread.createThread();
    if (!threadId) return;

    const messageSuccess = await thread.sendMessage(inputValue, threadId);

    if (messageSuccess) setInputValue('');
    else return;

    const run = await thread.createRun(threadId);
    if (!run?.id) return;

    const result = await thread.pollRun(run.id, threadId);
    if (result) await thread.reload(threadId);
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
        { thread.messages.map((message) => <Message key={message.id} message={message} />) }
        { thread.loading && <LoadingEllipsis />}
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
