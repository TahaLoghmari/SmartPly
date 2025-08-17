import { request } from "@/index";

export const deleteCurrentUser = () => {
  return request<void>(`/me`, {
    method: "DELETE",
  });
};
