import { useMutation } from "@tanstack/react-query";
import { Upload } from "@/components/ui/upload";
import { uploadImage, ImageInfo } from "@/api/images";
import { ImagePreview } from "@/components/image-preview";

export function HomePage() {
  const { mutate, isPending } = useMutation<ImageInfo, Error, File>({
    mutationFn: uploadImage,
  });

  return (
    <div className="flex h-full items-center">
      <div className="max-w-2xl mx-auto space-y-8 w-full">
        <Upload onFileSelect={mutate} isUploading={isPending} />
        <ImagePreview />
      </div>
    </div>
  );
}
