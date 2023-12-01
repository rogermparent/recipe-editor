"use client";

import { ChangeEventHandler, ReactNode, useEffect, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { Post } from "@/app/lib/data";
import clsx from "clsx";

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

function TextInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  placeholder,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  return (
    <FieldWrapper label={label} id={id}>
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
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <FieldWrapper label={label} id={id}>
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
}: {
  name: string;
  id: string;
  label: string;
  date?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  currentTimezone?: string;
}) {
  const [currentDate, setCurrentDate] = useState(
    date ? new Date(date) : undefined,
  );
  return (
    <FieldWrapper label={label} id={id}>
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
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  return (
    <FieldWrapper label={label} id={id}>
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

export function PostFields({ post, slug }: { post?: Post; slug?: string }) {
  const { title, body, date } = post || {};
  const [defaultSlug, setDefaultSlug] = useState(title ? slugify(title) : "");
  const [currentTimezone, setCurrentTimezone] = useState<string>();
  useEffect(() => {
    const fetchedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(fetchedTimezone);
  }, []);
  return (
    <>
      <TextInput
        label="Title"
        name="title"
        id="post-form-title"
        defaultValue={title}
        onChange={(e) => setDefaultSlug(slugify(e.target.value))}
      />
      <FileInput label="Image" name="image" id="post-form-image" />
      <TextAreaInput
        label="Body"
        name="body"
        id="post-form-body"
        defaultValue={body}
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
          />
          <DateTimeInput
            label="Date (UTC)"
            name="date"
            id="post-form-date"
            date={date}
            currentTimezone={currentTimezone}
          />
        </div>
      </details>
    </>
  );
}
