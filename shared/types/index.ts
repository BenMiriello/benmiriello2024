export interface ThreadContent {
  text: {
    value: string
  }
}

export interface ThreadMessage {
  id: string,
  content: ThreadContent[],
  role: string,
  thread_id: string,
  assistant_id: string,
  created_at: number,
};

export interface UnsentMessage { content: ThreadContent[], id:string, role: string };

export interface MessageResponse { threadId: string, messages: ThreadMessage[] };
