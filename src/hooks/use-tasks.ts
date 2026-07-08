import { useAsyncResource } from "@/hooks/use-async-resource";
import { mockAsync } from "@/lib/async";
import { MOCK_LATENCY_MS } from "@/lib/constants";
import { mockTasks } from "@/mocks/data";
import type { AsyncResource, Task } from "@/types";

export function useTasks(): AsyncResource<Task[]> {
  return useAsyncResource<Task[]>(() => mockAsync(mockTasks, MOCK_LATENCY_MS), []);
}