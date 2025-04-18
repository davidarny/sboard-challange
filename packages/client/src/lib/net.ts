import { useAuthStore } from "@/store/auth";
import ky from "ky";

export const httpClient = ky.extend({
  prefixUrl: "/api",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().token;

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      (_, __, response) => {
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }
      },
    ],
  },
});
