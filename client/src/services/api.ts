import { API } from '@sharedTypes';

const apiUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL : '';

const api = {
  threads: {
    post: async (): Promise<API.Threads.Create.Response> => {
      const response = await fetch(`${apiUrl}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`A server error occurred while posting to 'threads': ${JSON.stringify(response, null, 2)}`);
      }
    },
    get: async ({ threadId }: { threadId: string }): Promise<API.Threads.Get.Response> => {
      const response = await fetch(`${apiUrl}/threads/${threadId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`A server error occurred getting 'threads': ${JSON.stringify(response, null, 2)}`);
      }
    },
    messages: {
      post: async ({ threadId, payload }: { threadId: string, payload: API.Threads.Messages.Create.Payload }): Promise<API.Threads.Messages.Create.Response> => {
        const response = await fetch(apiUrl + `/threads/${threadId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`A server error occurred posting a message: ${JSON.stringify(response, null, 2)}`);
        }
      },
    },
    runs: {
      post: async ({ threadId }: { threadId: string }): Promise<API.Threads.Runs.Create.Response> => {
        const response = await fetch(apiUrl + `/threads/${threadId}/runs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`A server error occurred starting a run: ${JSON.stringify(response, null, 2)}`);
        }
      },
      get: async ({ threadId, runId }: { threadId: string, runId: string }): Promise<API.Threads.Runs.Get.Response> => {
        const response = await fetch(`${apiUrl}/threads/${threadId}/runs/${runId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`A server error occurred getting 'threads': ${JSON.stringify(response, null, 2)}`);
        }
      },
    }
  },
}

export default api;
