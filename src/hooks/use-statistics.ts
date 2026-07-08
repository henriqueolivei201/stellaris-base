import { useAsyncResource } from "@/hooks/use-async-resource";
import { mockAsync } from "@/lib/async";
import { MOCK_LATENCY_MS } from "@/lib/constants";
import { mockStatistics } from "@/mocks/data";
import type { AsyncResource, Statistics } from "@/types";

export function useStatistics(): AsyncResource<Statistics> {
  return useAsyncResource<Statistics>(
    () => mockAsync(mockStatistics, MOCK_LATENCY_MS),
    [],
  );
}