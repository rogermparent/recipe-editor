"use client";

import { useEffect, useState } from "react";
import slugify from "@sindresorhus/slugify";
import Image from "next/image";
import {
  TextInput,
  DateTimeInput,
  FileInput,
  TextAreaInput,
} from "@/components/Form";
import { Post } from "@/app/lib/models/posts/types";
import { PostFormState } from "@/app/lib/models/posts/formState";

export default function PostFields({
  post,
  slug,
  state,
}: {
  post?: Post;
  slug?: string;
  state: PostFormState;
}) {
  const { title, body, date, image, summary } = post || {};
  const [defaultSlug, setDefaultSlug] = useState(title ? slugify(title) : "");
  const [currentTimezone, setCurrentTimezone] = useState<string>();
  const [imagesToUpload, setImagesToUpload] = useState<FileList>();
  const [imagePreviewURL, setImagePreviewURL] = useState<string>();
  useEffect(() => {
    const fetchedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(fetchedTimezone);
  }, []);
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
    <>
      <TextInput
        label="Title"
        name="title"
        id="post-form-title"
        defaultValue={title}
        onChange={(e) => setDefaultSlug(slugify(e.target.value))}
        errors={state.errors?.title}
      />
      <FileInput
        label="Image"
        name="image"
        id="post-form-image"
        errors={state.errors?.image}
        onChange={(e) => setImagesToUpload(e.target?.files || undefined)}
      />
      <div className="w-full">
        {imagePreviewURL ? (
          <Image
            src={imagePreviewURL}
            alt="Image to upload"
            className="w-full"
          />
        ) : (
          image && (
            <Image
              src={`/post/${slug}/uploads/${image}`}
              alt="Heading image"
              width={850}
              height={475}
            />
          )
        )}
      </div>
      <TextInput
        label="Summary"
        name="summary"
        id="post-form-summary"
        defaultValue={summary}
        errors={state.errors?.summary}
      />
      <TextAreaInput
        label="Body"
        name="body"
        id="post-form-body"
        defaultValue={body}
        errors={state.errors?.body}
      />
      <details className="py-1 my-1">
        <summary className="text-sm font-semibold">Advanced</summary>
        <div className="flex flex-col flex-nowrap">
          <TextInput
            label="Slug"
            name="slug"
            id="post-form-slug"
            defaultValue={slug}
            placeholder={defaultSlug}
            errors={state.errors?.slug}
          />
          <DateTimeInput
            label="Date (UTC)"
            name="date"
            id="post-form-date"
            date={date}
            currentTimezone={currentTimezone}
            errors={state.errors?.date}
          />
        </div>
      </details>
    </>
  );
}
