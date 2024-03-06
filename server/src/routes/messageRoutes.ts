import { Router } from 'express';
import OpenAI from 'openai';
import { API } from '@sharedTypes';
import { openaiApiKey } from '../config';

const router = Router();
const openai = new OpenAI({ apiKey: openaiApiKey });

router.post(`/threads/:threadId/messages`, async (req, res, next) => {
  try {
    const threadId = req.params.threadId;
    const { message }: API.Threads.Messages.Create.Payload = req.body;

    const openaiMessage = await openai.beta.threads.messages.create(
      threadId,
      { role: "user", content: message.text },
    )

    if (!openaiMessage.id) {
      throw new Error(`Error creating a new message in openai: ${JSON.stringify(openaiMessage)}`);
    }

    const response: API.Threads.Messages.Create.Response = { success: true };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
