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
import { Resume } from "@/app/lib/models/resumes/types";
import { ResumeFormState } from "@/app/lib/models/resumes/formState";

export default function ResumeFields({
  resume,
  slug,
  state,
}: {
  resume?: Resume;
  slug?: string;
  state: ResumeFormState;
}) {
  const { title, body, date, image, summary } = resume || {};
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
        id="resume-form-title"
        defaultValue={title}
        onChange={(e) => setDefaultSlug(slugify(e.target.value))}
        errors={state.errors?.title}
      />
      <FileInput
        label="Image"
        name="image"
        id="resume-form-image"
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
              src={`/resume/${slug}/uploads/${image}`}
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
        id="resume-form-summary"
        defaultValue={summary}
        errors={state.errors?.summary}
      />
      <TextAreaInput
        label="Body"
        name="body"
        id="resume-form-body"
        defaultValue={body}
        errors={state.errors?.body}
      />
      <details className="py-1 my-1">
        <summary className="text-sm font-semibold">Advanced</summary>
        <div className="flex flex-col flex-nowrap">
          <TextInput
            label="Slug"
            name="slug"
            id="resume-form-slug"
            defaultValue={slug}
            placeholder={defaultSlug}
            errors={state.errors?.slug}
          />
          <DateTimeInput
            label="Date (UTC)"
            name="date"
            id="resume-form-date"
            date={date}
            currentTimezone={currentTimezone}
            errors={state.errors?.date}
          />
        </div>
      </details>
    </>
  );
}
