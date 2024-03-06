import { Router } from 'express';
import OpenAI from 'openai';
import { defaultAssistantId, openaiApiKey } from '../config';
import { runSerializer } from '../serializers';
import { API } from '@sharedTypes';

const router = Router();
const openai = new OpenAI({ apiKey: openaiApiKey });

// add response types to both of these
router.post(`/threads/:threadId/runs`, async (req, res, next) => {
  try {
    const threadId = req.params.threadId;
    const run = await openai.beta.threads.runs.create(
      threadId,
      { assistant_id: defaultAssistantId },
    );

    const response: API.Threads.Runs.Create.Response = { run: runSerializer(run) };
    res.json(response);
  } catch (error) {
    res.json({ error: 'Internal Server Error' });
  }
});

router.get('/threads/:threadId/runs/:runId', async (req, res, next) => {
  try {
    const { threadId, runId } = req.params;
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    const response: API.Threads.Runs.Create.Response = { run: runSerializer(run) };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
