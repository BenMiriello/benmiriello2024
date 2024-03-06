import { Request, Response, NextFunction } from 'express';

const info = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, params, query, body } = req;
  const start = Date.now();

  console.log(`\nRequest: ${method} ${url}`);
  console.log(`Params: ${JSON.stringify(params)}`);
  console.log(`Query: ${JSON.stringify(query)}`);
  console.log(`Body: ${JSON.stringify(body)}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Responded with status ${res.statusCode} in ${duration}ms`);
  });

  next();
};

export default info;
