import { IMessage } from "@sharedTypes";
import OpenAI from "openai";

const messageSerializer = ({
  id, content, role, thread_id, assistant_id, created_at,
}: OpenAI.Beta.Threads.ThreadMessage): IMessage => {
  type Text = OpenAI.Beta.Threads.MessageContentText;
  const textContents = content.filter((content): content is Text => content.type === 'text');

  const text = textContents.map(content => content.text.value).join(' ');

  return { id, text, role, thread_id, assistant_id, created_at };
};

export default messageSerializer;
