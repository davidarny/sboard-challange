import { httpClient } from "@/lib/net";
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterData = z.infer<typeof registerSchema>;

interface RegisterResponse {
  access_token: string;
}

export function register(data: RegisterData) {
  return httpClient.post("auth/register", { json: data }).json<RegisterResponse>();
}

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token: string;
}

export function login(data: LoginData) {
  return httpClient.post("auth/login", { json: data }).json<LoginResponse>();
}
