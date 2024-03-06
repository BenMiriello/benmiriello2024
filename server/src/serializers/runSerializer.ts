import { IRun } from "@sharedTypes";
import OpenAI from "openai";

const runSerializer = (run: OpenAI.Beta.Threads.Run): IRun => {
  const { id, status, thread_id, assistant_id, created_at, started_at, expires_at } = run;

  return { id, status, thread_id, assistant_id, created_at, started_at, expires_at };
};

export default runSerializer;
