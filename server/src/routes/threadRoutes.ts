import { Router } from 'express';
import OpenAI from 'openai';
import { API } from '@sharedTypes';
import { threadSerializer } from '../serializers';
import { logger } from '../middleware';
import { openaiApiKey } from '../config';

const router = Router();
const openai = new OpenAI({ apiKey: openaiApiKey });

router.post('/threads', async (_req, res) => {
  try {
    const thread = await openai.beta.threads.create();

    if (!thread || !thread.id) {
      logger.error(`Error creating a new thread in openai: ${JSON.stringify(thread)}`)
      throw new Error(`Error creating a new thread in openai: ${JSON.stringify(thread)}`);
    }

    const response: API.Threads.Create.Response = { thread: { id: thread.id } };
    res.status(201).json(response);
  } catch (error) {
    res.json({ error: 'Internal Server Error' });
  }
});

router.get('/threads/:id', async (req, res) => {
  try {
    const threadId = req.params.id;
    const openaiMessages = await openai.beta.threads.messages.list(threadId);

    if (!openaiMessages || !openaiMessages.data) {
      logger.error(`Error retrieving thread ${threadId}: ${JSON.stringify(openaiMessages)}`);
      throw new Error(`Error retrieving thread ${threadId}: ${JSON.stringify(openaiMessages)}`);
    }

    const response: API.Threads.Get.Response = { thread: threadSerializer({ threadId, openaiMessages }) };
    res.json(response);
  } catch (error) {
    res.json({ error: 'Internal server error' });
  }
});

export default router;
