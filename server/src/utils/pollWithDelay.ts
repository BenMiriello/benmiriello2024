interface PollWithDelayProps {
  asyncOperation: () => Promise<any>,
  successCheck: (result: any) => boolean,
  errorHandler?: null | (() => Promise<any>),
  initialInterval?: number,
  maxInterval?: number,
  maxDuration?: number,
}

export async function pollWithDelay({
  asyncOperation,
  successCheck,
  errorHandler = null,
  initialInterval = 333,
  maxInterval = 333 * 4,
  maxDuration = 20000,
}: PollWithDelayProps) {
  let interval = initialInterval;
  let tries = 0;
  let totalElapsedTime = 0;

  const overallStartTime = Date.now();

  const defaultErrorHandler = async () => {
    throw new Error(`Failed polling for async operation after ${tries} tries within ${totalElapsedTime} ms`);
  };

  while (totalElapsedTime < maxDuration) {
    const startTime = Date.now();
    tries++;

    const result = await asyncOperation();

    if (successCheck(result)) {
      const successTime = Date.now() - overallStartTime;
      console.log(`Success polling for async operation after ${tries} tries in ${successTime} ms`);
      return result;
    }

    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    totalElapsedTime = endTime - overallStartTime;

    if (timeTaken < interval) {
      const waitTime = Math.min(interval - timeTaken, maxDuration - totalElapsedTime);
      if (waitTime <= 0) break;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    interval = Math.min(interval + initialInterval, maxInterval, maxDuration - totalElapsedTime);

    if (totalElapsedTime >= maxDuration && !successCheck(result)) {
      await (errorHandler || defaultErrorHandler)();
    }
  }

  await (errorHandler || defaultErrorHandler)();
}
