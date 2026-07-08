export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockAsync<T>(value: T, delayMs: number): Promise<T> {
  await sleep(delayMs);
  return value;
}