import AsyncRetry from 'async-retry';
import { ClientError, ResponseBodyError, TransportError } from './errors';

export async function callApi<T>(
  action: () => Promise<T>,
  opts?: AsyncRetry.Options
): Promise<T> {
  let value: T | undefined = undefined;

  await AsyncRetry(async (bail) => {
    try {
      value = await action();
    } catch (e) {
      if (e instanceof ClientError || e instanceof ResponseBodyError) {
        bail(e);
        return;
      }
      if (e instanceof TransportError) {
        throw e;
      }
      if (e instanceof Error) {
        bail(e);
        return;
      }
    }
  }, opts);

  return value!;
}
