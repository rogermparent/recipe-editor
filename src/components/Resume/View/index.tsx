import React, { ReactNode } from "react";
import GithubIconSVG from "../../../images/github-mark.inline.svg";
import LinkedinIconSVG from "../../../images/linkedin.inline.svg";
import Image from "next/image";
import {
  Education,
  Experience,
  Project,
  Resume,
} from "@/app/lib/models/resumes/types";
import Markdown from "@/components/Markdown";
import Link from "next/link";

function GithubIcon() {
  return (
    <Image src={GithubIconSVG} alt="" className="inline-block w-4 h-4 mr-1" />
  );
}

function LinkedinIcon() {
  return (
    <Image src={LinkedinIconSVG} alt="" className="inline-block w-4 mr-1" />
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold my-1 py-1 border-b border-black">
      {children}
    </h2>
  );
}

const ContactInfo = ({
  address,
  email,
  phone,
  github,
  linkedin,
  website,
}: {
  address?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}) => {
  return (
    <div>
      {address && (
        <div className="mt-2">
          <span>&#8962;</span> <span>{address}</span>
        </div>
      )}
      {email && (
        <div className="mt-2">
          <Link target="_blank" href={`mailto://${email}`}>
            <span className="inline-block w-4 h-4 mr-1 text-center align-top">
              &#9993;
            </span>
            <span className="underline">{email}</span>
          </Link>
        </div>
      )}
      {phone && (
        <div className="mt-2">
          <Link target="_blank" href={`tel://${phone}`}>
            <span className="inline-block w-4 h-4 mr-1 text-center align-top">
              &#128379;
            </span>
            <span className="underline">{phone}</span>
          </Link>
        </div>
      )}
      {website && (
        <div className="mt-2">
          <Link href={`https://${website}`} target="_blank">
            <span className="inline-block w-4 h-4 mr-1 text-center align-top">
              &#128463;
            </span>
            <span className="underline">{website}</span>
          </Link>
        </div>
      )}
      {github && (
        <div className="mt-2">
          <Link target="_blank" href={`https://github.com/${github}`}>
            <GithubIcon />
            <span className="underline">github.com/{github}</span>
          </Link>
        </div>
      )}
      {linkedin && (
        <div className="mt-2">
          <Link target="_blank" href={`https://linkedin.com/in/${linkedin}`}>
            <LinkedinIcon />
            <span className="underline">linkedin.com/in/{linkedin}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

const DateSpan = ({
  startDate,
  endDate,
}: {
  startDate?: string | null;
  endDate?: string | null;
}) =>
  startDate ? (
    <>
      {" "}
      <span>
        {<span>{startDate}</span>}
        {endDate && (
          <>
            {" - "}
            <span>{endDate}</span>
          </>
        )}
      </span>
    </>
  ) : null;

const EducationList = ({ education }: { education?: Education[] }) => {
  return education && education.length > 0 ? (
    <div className="mt-6">
      <SectionHeading>Education</SectionHeading>
      <ul>
        {education.map(({ achievement, school, startDate, endDate }, i) => (
          <li key={i}>
            {achievement && <h3 className="font-semibold">{achievement}</h3>}
            {school && (
              <div>
                {school}
                {startDate && (
                  <div>
                    <DateSpan startDate={startDate} endDate={endDate} />
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

const ExperienceList = ({
  experience,
}: {
  readonly experience?: Experience[];
}) => {
  return experience && experience.length > 0 ? (
    <div className="mt-2">
      <SectionHeading>Experience</SectionHeading>
      <ul>
        {experience.map(
          ({ startDate, endDate, description, title, company }, i) => (
            <li key={i} className="mt-2 text-sm ml-1">
              <div className="my-1">
                <div className="text-lg font-semibold">{title}</div>
                <div className="text-base">{company}</div>
                {startDate && (
                  <div>
                    <DateSpan startDate={startDate} endDate={endDate} />
                  </div>
                )}
              </div>
              {description && <Markdown>{description}</Markdown>}
            </li>
          ),
        )}
      </ul>
    </div>
  ) : null;
};

const ProjectLink = ({ url }: { url: string }) => {
  const githubResult = /^https:\/\/github.com\/(.*)/.exec(url);
  if (githubResult) {
    const repoName = githubResult[1];
    return (
      <>
        <Link href={url} target="_blank" className="underline">
          <GithubIcon />
          {repoName}
        </Link>{" "}
      </>
    );
  }
  return (
    <Link href={url} target="_blank">
      {url}
    </Link>
  );
};

const ProjectsList = ({ projects }: { readonly projects?: Project[] }) => {
  return projects && projects.length > 0 ? (
    <div>
      <SectionHeading>Projects</SectionHeading>
      <ul className="pl-1">
        {projects.map(({ description, url, name, startDate, endDate }, i) => (
          <li key={i}>
            <div className="my-2">
              <div className="font-semibold text-lg">{name}</div>
              {startDate && (
                <div>
                  <DateSpan startDate={startDate} endDate={endDate} />
                </div>
              )}
              {url && (
                <div className="text-sm">
                  {url.map((itemUrl, i) => (
                    <ProjectLink url={itemUrl as string} key={i} />
                  ))}
                </div>
              )}
            </div>
            {description && <Markdown>{description}</Markdown>}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

const SkillsList = ({ skills }: { skills?: string[] }) => {
  return (
    <div className="mt-6">
      <SectionHeading>Skills</SectionHeading>
      <ul className="pl-1 font-semibold text-lg">
        {skills?.map((skill) => (
          <li key={skill} className="my-1">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ResumeView = ({ resume }: { readonly resume?: Resume }) => {
  const {
    job,
    company,
    education,
    experience,
    projects,
    skills,
    github,
    address,
    email,
    name,
    phone,
    linkedin,
    website,
  } = resume || {};
  return (
    <div className="bg-white text-black w-full h-full flex flex-row flex-nowrap p-2 print:p-0 justify-center">
      <div className="shrink-0 pr-4">
        <div>
          <div>
            {name && <h1 className="text-3xl font-semibold">{name}</h1>}
            <ContactInfo
              phone={phone}
              email={email}
              address={address}
              github={github}
              linkedin={linkedin}
              website={website}
            />
          </div>
          <SkillsList skills={skills} />
          <EducationList education={education} />
        </div>
      </div>
      <div className="grow max-w-prose print:max-w-full">
        <div className="text-center grow">
          {company && <div className="text-3xl font-bold">{job}</div>}

          {job && <div className="text-xl">{company}</div>}
        </div>
        <ExperienceList experience={experience} />
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
};
