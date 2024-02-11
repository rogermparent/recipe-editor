import { useEffect, useState } from "react";
import Image from "next/image";
import { FileInput } from "../File";
import { CheckboxInput } from "../Checkbox";

export function ImageInput({
  image,
  slug,
  errors,
}: {
  image?: string;
  slug: string | undefined;
  errors: string[] | undefined;
}) {
  const [imagesToUpload, setImagesToUpload] = useState<FileList>();
  const [imagePreviewURL, setImagePreviewURL] = useState<string>();

  useEffect(() => {
    if (imagesToUpload) {
      const previewImage = imagesToUpload[0];
      if (previewImage) {
        const url = URL.createObjectURL(previewImage);
        setImagePreviewURL(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }
  }, [imagesToUpload]);

  return (
    <div>
      <FileInput
        label="Image"
        name="image"
        id="recipe-form-image"
        errors={errors}
        onChange={(e) => setImagesToUpload(e.target?.files || undefined)}
      />
      <div className="w-full">
        {imagePreviewURL ? (
          <Image
            src={imagePreviewURL}
            alt="Image to upload"
            className="w-full"
            width={850}
            height={475}
          />
        ) : (
          slug &&
          image && (
            <Image
              src={`/recipe/${slug}/uploads/${image}/page`}
              alt="Heading image"
              width={850}
              height={475}
            />
          )
        )}
      </div>
      {image ? <CheckboxInput name="clearImage" label="Remove Image" /> : null}
    </div>
  );
}
