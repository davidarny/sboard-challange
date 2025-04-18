import { httpClient } from "@/lib/net";

export interface ImageInfo {
  id: string;
  originalName: string;
  path: string;
  status: string;
  uploadedAt: string;
}

export function getLatestImage() {
  return httpClient.get("images/latest").json<ImageInfo>();
}

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return httpClient.post("images/upload", { body: formData }).json<ImageInfo>();
}
