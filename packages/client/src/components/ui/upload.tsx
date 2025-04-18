import { ChangeEvent, DragEvent, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Upload as UploadIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than 5MB`,
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    }),
});

type UploadData = z.infer<typeof uploadSchema>;

interface UploadProps {
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
}

export interface UploadHandle {
  setError: (error: string) => void;
}

export const Upload = forwardRef<UploadHandle, UploadProps>(({ isUploading = false, onFileSelect }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<UploadData>({
    resolver: zodResolver(uploadSchema),
  });

  useImperativeHandle(ref, () => ({
    setError: (error: string) => {
      form.setError("file", { message: error });
    },
  }));

  const onUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("file", file);
      void form.handleSubmit((data) => {
        onFileSelect(data.file);
        e.target.value = "";
      })();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      form.setValue("file", file);
      void form.handleSubmit((data) => {
        onFileSelect(data.file);
      })();
    }
  };

  return (
    <Form {...form}>
      <form className="bg-background">
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormControl>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-colors duration-200 text-center",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    "cursor-pointer hover:border-primary/50",
                    form.formState.errors.file && "border-destructive",
                  )}
                  onClick={onUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
                  <div className="flex flex-col items-center gap-4">
                    <UploadIcon className="w-12 h-12 text-muted-foreground" />
                    <div className="text-xl font-medium">
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <p>Drop your image here</p>
                          <p className="text-sm text-muted-foreground mt-1">or click to select a file</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});
