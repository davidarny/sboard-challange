import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, UploadHandle } from "@/components/ui/upload";
import { uploadImage, ImageInfo } from "@/api/images";
import { QUERIES } from "@/lib/query";
import { toast } from "sonner";
import { useRef } from "react";

export function ImageUpload() {
  const queryClient = useQueryClient();
  const uploadRef = useRef<UploadHandle>(null);

  const { mutate, isPending } = useMutation<ImageInfo, Error, File>({
    mutationFn: uploadImage,
    onSuccess: () => {
      toast.success("Image uploaded successfully");
      void queryClient.invalidateQueries({ queryKey: QUERIES.images.latest() });
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to upload image";
      uploadRef.current?.setError(errorMessage);
    },
  });

  return <Upload ref={uploadRef} onFileSelect={mutate} isUploading={isPending} />;
}
