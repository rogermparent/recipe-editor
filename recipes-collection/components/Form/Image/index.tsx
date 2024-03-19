import { useEffect, useState } from "react";
import Image from "next/image";
import { FileInput } from "component-library/components/Form/inputs/File";
import { CheckboxInput } from "component-library/components/Form/inputs/Checkbox";
import { StaticImageProps } from "next-static-image/src";
import { StaticImageDisplay } from "next-static-image/src/Display";

export function ImageInput({
  defaultImage,
  errors,
}: {
  defaultImage?: StaticImageProps;
  errors: string[] | undefined;
}) {
  const [imagePreviewURL, setImagePreviewURL] = useState<string>();

  useEffect(() => {
    if (imagePreviewURL) {
      return () => {
        URL.revokeObjectURL(imagePreviewURL);
      };
    }
  }, [imagePreviewURL]);

  return (
    <div>
      <FileInput
        label="Image"
        name="image"
        id="recipe-form-image"
        errors={errors}
        onChange={(e) => {
          console.log("CHANGING FILE");
          const imagesToUpload = e.target?.files;
          console.log({ imagesToUpload });
          if (!imagesToUpload) {
            return;
          }
          const previewImage = imagesToUpload[0];
          console.log({ imagesToUpload, previewImage });
          if (!previewImage) {
            return;
          }
          const previewURL = URL.createObjectURL(previewImage);
          console.log({ imagesToUpload, previewImage, previewURL });
          setImagePreviewURL(previewURL);
        }}
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
          defaultImage && <StaticImageDisplay image={defaultImage} />
        )}
      </div>
      {defaultImage ? (
        <CheckboxInput name="clearImage" label="Remove Image" />
      ) : null}
    </div>
  );
}
