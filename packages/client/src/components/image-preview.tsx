import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ImageInfo, getLatestImage } from "@/api/images";
import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/lib/query";

const getStatusColor = (status: string) => {
  switch (status) {
    case "processed":
      return "text-green-500";
    case "processing":
      return "text-amber-500";
    default:
      return "text-blue-500";
  }
};

export function ImagePreview() {
  const {
    data: image,
    isLoading,
    isError,
  } = useQuery<ImageInfo, Error>({
    queryKey: QUERIES.images.latest(),
    queryFn: getLatestImage,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error loading image info</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!image) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">No images uploaded yet</CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{image.originalName}</span>
          <span className={cn("text-sm font-normal", getStatusColor(image.status))}>{image.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {image.status === "processed" ? (
          <div className="aspect-video relative bg-muted">
            <img
              src={`api/images/${image.id}/optimized`}
              alt={image.originalName}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Image is {image.status}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Uploaded {new Date(image.uploadDate).toLocaleString()}
      </CardFooter>
    </Card>
  );
}
