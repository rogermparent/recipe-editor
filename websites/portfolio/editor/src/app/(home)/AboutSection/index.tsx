import { HomepageContent } from "@/app/(editor)/homepage/types";
import Markdown from "component-library/components/Markdown";

export default function AboutSection({ about }: HomepageContent) {
  return (
    about && (
      <section className="flex flex-col flex-nowrap py-12 px-3 bg-backgroundAlt-light dark:bg-backgroundAlt-dark w-full min-h-96 h-screen items-center justify-center relative">
        <div className="max-w-prose mx-auto">
          <Markdown forceWrapper={true} className="bg-inherit">
            {about}
          </Markdown>
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
    )
  );
}
