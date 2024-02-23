import { useEffect, useState } from "react";
import Image from "next/image";
import { FileInput } from "component-library/components/Form/inputs/File";
import { CheckboxInput } from "component-library/components/Form/inputs/Checkbox";
import { RecipeImageDisplay } from "../../RecipeImage/Display";
import { StaticImageProps } from "../../RecipeImage";

export function ImageInput({
  defaultImage,
  errors,
}: {
  defaultImage?: StaticImageProps;
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
          defaultImage && <RecipeImageDisplay image={defaultImage} />
        )}
      </div>
      {defaultImage ? (
        <CheckboxInput name="clearImage" label="Remove Image" />
      ) : null}
    </div>
  );
}
