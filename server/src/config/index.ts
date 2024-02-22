import dotenv from 'dotenv'
dotenv.config();

export const port = process.env.PORT || 8000;
const environment = process.env.NODE_ENV || 'production';
export const apiUrl = environment === 'development' ?
  `http://localhost:${port}/api/v1` :
  'https://productiondomain.com/api/v1';

export const openaiApiKey = process.env.OPENAI_API_KEY;
export const model = process.env.GPT_MODEL || 'gpt-3.5-turbo';
export const defaultAssistantId = process.env.ASSISTANT_ID || 'asst_pDZFbJLj6PWCi2U2qkk2v8Qf';

export const rateLimit = {
  dailyRequestsHardMax: process.env.DAILY_REQUESTS_HARD_MAX || 300,
  dailyRequestsSoftMax: process.env.DAILY_REQUESTS_SOFT_MAX || 200,
};

export const featureFlags = {
  textingEnabled: process.env.FEATURE_TEXTING_ENABLED === 'true',
  emailEnabled: process.env.FEATURE_EMAIL_ENABLED === 'true',
};
