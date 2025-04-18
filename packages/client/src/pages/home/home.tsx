import { ImageUpload } from "@/components/image-upload";
import { ImagePreview } from "@/components/image-preview";

export function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto space-y-8 w-full">
        <ImageUpload />
        <ImagePreview />
      </div>
    </div>
  );
}
