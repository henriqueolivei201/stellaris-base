import { useAsyncResource } from "@/hooks/use-async-resource";
import { mockAsync } from "@/lib/async";
import { MOCK_LATENCY_MS } from "@/lib/constants";
import { mockRanking, mockScore } from "@/mocks/data";
import type { AsyncResource, RankingEntry, Score } from "@/types";

export function useScore(): AsyncResource<Score> {
  return useAsyncResource<Score>(() => mockAsync(mockScore, MOCK_LATENCY_MS), []);
}

export function useRanking(): AsyncResource<RankingEntry[]> {
  return useAsyncResource<RankingEntry[]>(
    () => mockAsync(mockRanking, MOCK_LATENCY_MS),
    [],
  );
}