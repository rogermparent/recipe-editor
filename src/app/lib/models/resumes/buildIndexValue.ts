import { Resume, ResumeEntryValue } from "./types";

export default function buildResumeIndexValue(resume: Resume): ResumeEntryValue {
  const { title, summary, image } = resume;
  return { title, summary, image };
}
