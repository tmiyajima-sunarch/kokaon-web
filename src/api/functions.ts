import AsyncRetry from 'async-retry';
import { ClientError, ResponseBodyError, TransportError } from './errors';

export async function callApi(
  action: () => Promise<void>,
  opts?: AsyncRetry.Options
): Promise<void> {
  await AsyncRetry(async (bail) => {
    try {
      await action();
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

      console.error(e);
    }
  }, opts);
}
