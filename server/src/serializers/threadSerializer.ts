import OpenAI from "openai";
import { IThread, IMessage } from "@sharedTypes";
import messageSerializer from './messageSerializer';

interface ThreadSerializerParams {
  threadId: string,
  openaiMessages: OpenAI.Beta.Threads.ThreadMessagesPage,
}

const threadSerializer = ({
  threadId,
  openaiMessages,
}: ThreadSerializerParams): IThread => {
  const sortedMessages = openaiMessages.data.sort(msg => msg.created_at);
  const messages = sortedMessages.map(messageSerializer).filter((m): m is IMessage => m !== null);

  return { id: threadId, messages };
};

export default threadSerializer;
