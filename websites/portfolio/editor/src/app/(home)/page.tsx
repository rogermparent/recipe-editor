import { join } from "path";
import { getHomepageContent } from "../(editor)/homepage/actions";

import Link from "next/link";
import { readFile } from "fs/promises";
import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import { ContactLink } from "../(editor)/homepage/types";
import Markdown from "markdown-to-jsx";
import ProjectCard from "../components/ProjectCard";
import StyledMarkdown from "component-library/components/Markdown";

const baseLinkLabelStyle = "w-6 h-6 mr-2";

async function ContactLinkLabel({
  item: { icon, iconType },
}: {
  item: ContactLink;
}) {
  switch (iconType) {
    case "text":
      return (
        <span className={`${baseLinkLabelStyle} text-3xl font-bold leading-6`}>
          {icon}
        </span>
      );
    default:
      const svgCode = String(
        await readFile(join(getContentDirectory(), "icons", icon)),
      );
      return (
        <span
          className={baseLinkLabelStyle}
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      );
  }
}

async function ContactLinkComponent({ item }: { item: ContactLink }) {
  return (
    <Link
      href={item.link}
      className="flex flex-row flex-nowrap items-center w-auto block py-2 my-2 leading-5"
    >
      <ContactLinkLabel item={item} />{" "}
      <span className="underline">{item.label}</span>
    </Link>
  );
}

export async function generateMetadata() {
  const homepageContent = await getHomepageContent();
  const { title } = homepageContent || {};
  return {
    title,
  };
}

export default async function HomePage() {
  const homepageContent = await getHomepageContent();
  const { projects, contactLinks, contactSectionTitle, about } =
    homepageContent || {};

  return (
    <div className="flex-1 w-full bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark">
      {about && (
        <section className="flex flex-col flex-nowrap py-12 px-3 bg-backgroundAlt-light dark:bg-backgroundAlt-dark w-full min-h-96 h-screen items-center justify-center relative">
          <div className="max-w-prose mx-auto">
            <StyledMarkdown forceWrapper={true} className="bg-inherit">
              {about}
            </StyledMarkdown>
          </div>
          <a
            href="#projects"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-500 hover:text-gray-700 animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </a>
        </section>
      )}

      <section className="w-full container mx-auto px-4 py-12" id="projects">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects
            ? projects.map(async (project, i) => {
                return <ProjectCard key={i} project={project} />;
              })
            : null}
        </ul>
      </section>
      <section className="py-6 bg-backgroundAlt-light dark:bg-backgroundAlt-dark">
        <div className="max-w-prose mx-auto">
          {contactSectionTitle && (
            <h2 className="text-3xl font-bold my-4 text-center text-primary-light dark:text-primary-dark">
              {contactSectionTitle}
            </h2>
          )}
          <ul className="text-center flex flex-col flex-nowrap justify-center w-auto mx-auto text-2xl px-2 my-10">
            {contactLinks?.map((contactLink, i) => {
              return <ContactLinkComponent key={i} item={contactLink} />;
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
