"use client";

import {
  ChangeEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import slugify from "@sindresorhus/slugify";
import { Post } from "@/app/lib/data";
import clsx from "clsx";
import { State } from "@/app/lib/actions";
import Image from "next/image";

const baseInputStyle =
  "text-black bg-slate-100 border border-slate-600 rounded-md";

function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="font-semibold text-sm py-1">
      {children}
    </label>
  );
}

function FieldWrapper({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-nowrap mb-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function Errors({ state, name }: { state: State; name: string }) {
  return (
    <div id="customer-error" aria-live="polite" aria-atomic="true">
      {state.errors?.[name] &&
        state.errors[name].map((error: string) => (
          <p className="mt-2 text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}
    </div>
  );
}

function TextInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  placeholder,
  state,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  state: State;
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors state={state} name={name} />
      <input
        type="text"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-2 py-1")}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
}

function TextAreaInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  state,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  state: State;
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors state={state} name={name} />
      <textarea
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-1 h-40 grow")}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </FieldWrapper>
  );
}

function DateTimeInput({
  name,
  id,
  date,
  label,
  currentTimezone,
  state,
}: {
  name: string;
  id: string;
  label: string;
  date?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  currentTimezone?: string;
  state: State;
}) {
  const [currentDate, setCurrentDate] = useState(
    date ? new Date(date) : undefined,
  );
  return (
    <FieldWrapper label={label} id={id}>
      <Errors state={state} name={name} />
      <input
        type="datetime-local"
        step="any"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "p-1")}
        defaultValue={
          currentDate ? currentDate.toISOString().slice(0, -1) : undefined
        }
        onChange={(e) => setCurrentDate(new Date(e.target.value + "Z"))}
      />
      <div className="text-sm font-semibold italic h-4 my-0.5">
        {currentTimezone && currentDate && (
          <>
            {currentDate.toLocaleString()} ({currentTimezone})
          </>
        )}
      </div>
    </FieldWrapper>
  );
}

function FileInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  placeholder,
  state,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  state: State;
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors state={state} name={name} />
      <div className={clsx(baseInputStyle, "p-1")}>
        <input
          type="file"
          name={name}
          id={id}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </FieldWrapper>
  );
}

export function PostFields({
  post,
  slug,
  state,
}: {
  post?: Post;
  slug?: string;
  state: State;
}) {
  const { title, body, date, image } = post || {};
  const [defaultSlug, setDefaultSlug] = useState(title ? slugify(title) : "");
  const [currentTimezone, setCurrentTimezone] = useState<string>();
  const [imagesToUpload, setImagesToUpload] = useState<FileList>();
  const [imagePreviewURL, setImagePreviewURL] = useState<string>();
  console.log({ selectedImage: imagesToUpload });
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
        state={state}
      />
      <FileInput
        label="Image"
        name="image"
        id="post-form-image"
        state={state}
        onChange={(e) => setImagesToUpload(e.target?.files || undefined)}
      />
      <div className="w-full">
        {imagePreviewURL ? (
          <img src={imagePreviewURL} alt="Image to upload" className="w-full" />
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
      <TextAreaInput
        label="Body"
        name="body"
        id="post-form-body"
        defaultValue={body}
        state={state}
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
            state={state}
          />
          <DateTimeInput
            label="Date (UTC)"
            name="date"
            id="post-form-date"
            date={date}
            currentTimezone={currentTimezone}
            state={state}
          />
        </div>
      </details>
    </>
  );
}
