import React from 'react';

export interface IThread {
  id: string;
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  text: string;
  role: string;
  thread_id: string;
  assistant_id: string | null;
  created_at: number;
}

export type IUnsentMessage = {
  id: string;
  text: string;
  role: string;
  created_at?: number;
  handleClick?: React.MouseEventHandler<HTMLElement>;
}

export type IAnyMessage = IMessage | IUnsentMessage

export interface IRun {
  id: string;
  assistant_id: string;
  thread_id: string;
  status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired';
  created_at: number;
  started_at: number | null;
  expires_at: number | null;
}

export namespace API {
  export namespace Threads {
    export namespace Create {
      export interface Response {
        thread: {
          id: string;
        }
      }
    }
    export namespace Get {
      export interface Response {
        thread: {
          id: string;
          messages: IMessage[];
        }
      }
    }
    export namespace Messages {
      export namespace Create {
        export interface Payload {
          message: {
            text: string;
          }
        }
        export interface Response {
          success: boolean;
        }
      }
    }
    export namespace Runs {
      export namespace Create {
        export interface Response {
          run: IRun;
        }
      }
      export namespace Get {
        export interface Response {
          run: IRun;
        }
      }
    }
  }
}
