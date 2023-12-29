"use client";

import { useEffect, useMemo, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { TextInput, DateTimeInput, TextListInput } from "@/components/Form";
import { DocPage } from "@/app/lib/models/docPages/types";
import { DocPageFormState } from "@/app/lib/models/docPages/formState";
import createDefaultSlug from "@/app/lib/models/docPages/createSlug";
import { ProjectsListInput } from "@/components/DocPage/Form/Projects";
import { EducationListInput } from "@/components/DocPage/Form/Education";
import { ExperienceListInput } from "@/components/DocPage/Form/Experience";

export default function CreateDocPageFields({
  docPage,
  slug,
  state,
}: {
  docPage?: Partial<DocPage>;
  slug?: string;
  state: DocPageFormState;
}) {
  const {
    company,
    job,
    date,
    skills,
    projects,
    education,
    experience,
    address,
    email,
    github,
    linkedin,
    name,
    phone,
    website,
  } = docPage || {};
  const [currentCompany, setCurrentCompany] = useState(company);
  const [currentJob, setCurrentJob] = useState(job);
  const defaultSlug = useMemo(
    () => createDefaultSlug({ company: currentCompany, job: currentJob }),
    [currentCompany, currentJob],
  );
  const [currentTimezone, setCurrentTimezone] = useState<string>();
  useEffect(() => {
    const fetchedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(fetchedTimezone);
  }, []);
  return (
    <>
      <details className="py-1 my-1" open>
        <summary className="text-sm font-semibold">Applicant</summary>
        <div className="flex flex-col flex-nowrap">
          <TextInput
            label="Name"
            name="name"
            id="docPage-form-name"
            defaultValue={name}
            errors={state.errors?.name}
          />
          <TextInput
            label="Email"
            name="email"
            id="docPage-form-email"
            defaultValue={email}
            errors={state.errors?.email}
          />
          <TextInput
            label="Address"
            name="address"
            id="docPage-form-address"
            defaultValue={address}
            errors={state.errors?.address}
          />
          <TextInput
            label="Github"
            name="github"
            id="docPage-form-github"
            defaultValue={github}
            errors={state.errors?.github}
          />
          <TextInput
            label="LinkedIn"
            name="linkedin"
            id="docPage-form-linkedin"
            defaultValue={linkedin}
            errors={state.errors?.linkedin}
          />
          <TextInput
            label="Phone"
            name="phone"
            id="docPage-form-phone"
            defaultValue={phone}
            errors={state.errors?.phone}
          />
          <TextInput
            label="Website"
            name="website"
            id="docPage-form-website"
            defaultValue={website}
            errors={state.errors?.website}
          />
        </div>
      </details>
      <h2 className="text-lg font-semibold my-3">DocPage content</h2>
      <TextInput
        label="Company"
        name="company"
        id="docPage-form-company"
        defaultValue={company}
        onChange={(e) => setCurrentCompany(slugify(e.target.value))}
        errors={state.errors?.company}
      />
      <TextInput
        label="Job"
        name="job"
        id="docPage-form-job"
        defaultValue={job}
        onChange={(e) => setCurrentJob(slugify(e.target.value))}
        errors={state.errors?.job}
      />
      <TextListInput
        label="Skills"
        name="skills"
        id="docPage-form-skills"
        appendLabel="Append Skill"
        defaultValue={skills}
        errors={state.errors}
      />
      <ProjectsListInput
        label="Projects"
        name="projects"
        id="docPage-form-projects"
        defaultValue={projects}
      />
      <EducationListInput
        label="Education"
        name="education"
        id="docPage-form-education"
        defaultValue={education}
      />
      <ExperienceListInput
        label="Experience"
        name="experience"
        id="docPage-form-experience"
        defaultValue={experience}
      />
      <details className="py-1 my-1" open>
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
