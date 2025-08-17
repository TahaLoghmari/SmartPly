import { request } from "@/index";
import type { UserRequestDto } from "#/settings";

export const deleteCurrentUser = () => {
  return request<void>(`/me`, {
    method: "DELETE",
  });
};

export const updateCurrentUser = (credentials: UserRequestDto) => {
  return request<void>(`/me`, {
    method: "PUT",
    body: JSON.stringify(credentials),
  });
};
