import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { pollWithDelay, assistantTimeoutMessage } from '../utils';
import { defaultAssistantId, openaiApiKey } from '../config';

const router = Router();

const openai = new OpenAI();

/* We'll include all the logic in here just to get it working.
  This will make it easier to test and easier to make the client.
  Once it's working we'll separate out these endpoints. */

router.post(`/api/v1/chat`, async (req: Request, res: Response) => {
  try {
    let { threadId, message, retry } = req.body;
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id
    }

    if (message) {
      await openai.beta.threads.messages.create(
        threadId,
        { role: "user", content: message, }
      );
    }

    const run = await openai.beta.threads.runs.create(
      threadId,
      { assistant_id: defaultAssistantId },
    );

    if (run.status !== 'completed') {
      const errorHandler = async () => {
        const response = await getLatestMessageThread(threadId);
        res.status(504).json({
          messages: [
            ...response.messages,
            assistantTimeoutMessage(),
          ],
        });
      };

      await pollWithDelay({
        asyncOperation: async () => openai.beta.threads.runs.retrieve(threadId, run.id),
        successCheck: (result) => result.status === 'completed',
        errorHandler,
        // Todo: Make it so the client can retry after failure.
      });
    }

    const getLatestMessageThread = async (threadId: string) => {
      const threadMessages = await openai.beta.threads.messages.list(threadId);
      const messages = threadMessages.data.sort(msg => msg.created_at);
      return { messages, threadId: messages[0].thread_id };
    }
    const response = await getLatestMessageThread(threadId);

    // console.log('Responding with ', response);
    res.json(response);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
