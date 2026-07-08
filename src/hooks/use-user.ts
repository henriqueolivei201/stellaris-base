import { useAsyncResource } from "@/hooks/use-async-resource";
import { mockAsync } from "@/lib/async";
import { MOCK_LATENCY_MS } from "@/lib/constants";
import { mockUser } from "@/mocks/data";
import type { AsyncResource, User } from "@/types";

export function useUser(): AsyncResource<User> {
  return useAsyncResource<User>(() => mockAsync(mockUser, MOCK_LATENCY_MS), []);
}