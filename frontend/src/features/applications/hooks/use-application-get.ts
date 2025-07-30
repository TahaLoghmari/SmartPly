import { useQuery } from "@tanstack/react-query";
import {
  type ApplicationResponseDto,
  getUserApplication,
  type ApplicationGetRequestDto,
} from "#/applications";

export function useGetUserApplication(credentials: ApplicationGetRequestDto) {
  return useQuery<ApplicationResponseDto>({
    queryKey: ["application", credentials.id],
    queryFn: () => getUserApplication(credentials),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
}
