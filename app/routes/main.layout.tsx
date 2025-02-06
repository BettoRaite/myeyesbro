import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/config";
import type { Route } from "./+types/profile.page";
import { FiInfo } from "react-icons/fi";
export default function Profile({
  params: { profileId },
}: Route.ComponentProps) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </div>
  );
}
