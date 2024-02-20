import dotenv from 'dotenv'
dotenv.config();

export const port = process.env.PORT || 8000;
export const openaiApiKey = process.env.OPENAI_API_KEY;
export const model = 'gpt-3.5-turbo';
// const environment = process.env.NODE_ENV || 'production';
// export const defaultAssistantId = 'asst_D7tibdXiwYIL7HTXMYscLHMZ';
export const defaultAssistantId = 'asst_pDZFbJLj6PWCi2U2qkk2v8Qf';

// const environmentConfigs = {
//   development: {
//     apiUrl: `http://localhost:${port}/api/v1`,
//   },
//   // production: {
//   //   apiUrl: 'https://productiondomain.com/api/v1',
//   // },
// };
// export const apiUrl =...environmentConfigs[environment];

export const apiUrl = `http://localhost:${port}/api/v1`;

export const featureFlags = {
  textingEnabled: process.env.FEATURE_TEXTING_ENABLED === 'true',
  emailEnabled: process.env.FEATURE_EMAIL_ENABLED === 'true',
}

export const rateLimit = {
  dailyRequestsHardMax: process.env.DAILY_REQUESTS_HARD_MAX || 20,
  dailyRequestsSoftMax: process.env.DAILY_REQUESTS_SOFT_MAX || 10,
};
