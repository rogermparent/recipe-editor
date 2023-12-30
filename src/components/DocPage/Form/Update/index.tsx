"use client";

import { useEffect, useMemo, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { TextInput, DateTimeInput, TextAreaInput } from "@/components/Form";
import { DocPage } from "@/app/lib/models/docPages/types";
import { DocPageFormState } from "@/app/lib/models/docPages/formState";
import createDefaultSlug from "@/app/lib/models/docPages/createSlug";

export default function UpdateDocPageFields({
  docPage,
  slug,
  state,
}: {
  docPage?: Partial<DocPage>;
  slug?: string;
  state: DocPageFormState;
}) {
  const { name, date, body } = docPage || {};
  const [currentName, setCurrentName] = useState(name);
  const defaultSlug = useMemo(
    () => slugify(createDefaultSlug({ name: currentName || "" })),
    [currentName],
  );
  const [currentTimezone, setCurrentTimezone] = useState<string>();
  useEffect(() => {
    const fetchedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(fetchedTimezone);
  }, []);
  return (
    <>
      <TextInput
        label="Name"
        name="name"
        id="docPage-form-name"
        defaultValue={name}
        onChange={(e) => setCurrentName(e.target.value)}
        errors={state.errors?.name}
      />
      <TextAreaInput
        label="Body"
        name="body"
        id="docPage-form-body"
        defaultValue={body}
        errors={state.errors?.body}
      />
      <details className="py-1 my-1">
        <summary className="text-sm font-semibold">Advanced</summary>
        <div className="flex flex-col flex-nowrap">
          <TextInput
            label="Slug"
            name="slug"
            id="docPage-form-slug"
            defaultValue={slug}
            placeholder={defaultSlug}
            errors={state.errors?.slug}
          />
          <DateTimeInput
            label="Date (UTC)"
            name="date"
            id="docPage-form-date"
            date={date}
            currentTimezone={currentTimezone}
            errors={state.errors?.date}
          />
        </div>
      </details>
    </>
  );
}
