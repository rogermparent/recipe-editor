import { Resume, ResumeEntryValue } from "./types";

export default function buildResumeIndexValue(
  resume: Resume,
): ResumeEntryValue {
  const { job, company } = resume;
  return { job, company };
}
