import { ImageUpload } from "@/components/image-upload";
import { ImagePreview } from "@/components/image-preview";

export function HomePage() {
  return (
    <div className="flex h-full items-center">
      <div className="max-w-2xl mx-auto space-y-8 w-full">
        <ImageUpload />
        <ImagePreview />
      </div>
    </div>
  );
}
