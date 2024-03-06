import { useState, SetStateAction, Dispatch } from 'react';
import { get } from 'lodash';
import api from '../services/api';
import { API, IMessage, IUnsentMessage, IAnyMessage, IRun } from '@sharedTypes';
import { getAssistantPrompt, poll } from '../utils';

interface UseThreadsReturn {
  createThread: () => Promise<string | null>;
  sendMessage: (message: string, threadId?: string) => Promise<boolean>;
  createRun: (newThreadId?: string) => Promise<IRun | undefined>;
  pollRun: (runId: string, newThreadId?: string) => Promise<boolean>;
  reload: (threadId?: string) => Promise<boolean>;
  threadId: string | null;
  setThreadId: Dispatch<SetStateAction<string | null>>;
  // setLocalStorageThreadId: (threadId: string) => void;
  retrieveLocalStorageThreadId: () => string | null;
  messages: IAnyMessage[];
  setMessages: Dispatch<SetStateAction<IAnyMessage[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const assistantPrompt = getAssistantPrompt();

/** Returns a `thread` object which serves as an interface to manage the thread lifecycle. */

const useThreads = (): UseThreadsReturn => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<(IMessage | IUnsentMessage)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const setLocalStorageThreadId = (threadId: string): void => {
    localStorage.setItem('BGMthreadId', threadId);
  }
  
  const retrieveLocalStorageThreadId = (): string | null => {
    return localStorage.getItem('BGMthreadId');
  }
  
  const createThread = async () => {
    setLoading(true);
    try {
      const response = await api.threads.post();
      setLoading(false);
      const threadId = get(response, ['thread', 'id'], null);
      if (!threadId) {
        // do something
        return null;
      } else {
        setThreadId(threadId);
        setLocalStorageThreadId(threadId);
        return threadId;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      // handle error
      return null;
    }
  };

  const sendMessage = async (text: string, newThreadId?: string) => {
    if (!threadId && !newThreadId) return false;
    setLoading(true);
    try {
      const payload = { message: { text } };
      const { success } = await api.threads.messages.post({
        threadId: newThreadId || threadId as string,
        payload,
      });
      return !!success;
    } catch (error) {
      console.error(error);
      setLoading(false);

      return false;
      // handle error
    }
  };

  const createRun = async (newThreadId?: string) => {
    try {
      if (!threadId && !newThreadId) throw new Error('Must set threadId before creating a run');
      setLoading(true);
      const response = await api.threads.runs.post({ threadId: newThreadId || threadId as string });

      return response.run;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const pollRun = async (runId: string, newThreadId?: string) => {
    try {
      if (!threadId && !newThreadId) throw new Error('Must set or provide threadId before polling a run');
      if (!runId) throw new Error('Must create a run and provide runId before polling a run');
  
      const queryLatestRun = () => api.threads.runs.get({ runId, threadId: threadId || newThreadId as string });
      const successCheck = (result: API.Threads.Runs.Get.Response) => result.run?.status === 'completed';
      const errorHandler = (error: unknown) => { console.error(error); return false; };

      const result: boolean = await poll(queryLatestRun, successCheck, { errorHandler });
      setLoading(false);

      return result;
    } catch (error) {
      console.error(error);
      setLoading(false);
      return false;
    }
  };

  const reload = async (reloadThreadId?: string) => {
    try {
      if (!threadId && !reloadThreadId) {
        throw new Error('Must set a threadId or provide a reloadThreadId when reloading a thread');
      }
      setLoading(true);
      if (reloadThreadId) setThreadId(reloadThreadId);
      const response = await api.threads.get({ threadId: reloadThreadId || threadId as string });
      const threadMessages = get(response, ['thread', 'messages'], null);
      if (!threadMessages) {
        // do something
      }
      const latestMessages = (threadMessages || [])
        .filter(message => message.text)
        .sort(message => message.created_at);
      setMessages([assistantPrompt, ...latestMessages]);
      // add back the default message here
      setLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      setLoading(false);
      return false;
    }
  };

  return {
    createThread,
    sendMessage,
    createRun,
    pollRun,
    reload,
    threadId,
    setThreadId,
    retrieveLocalStorageThreadId,
    messages,
    setMessages,
    loading,
    setLoading
  };
};

export default useThreads;
