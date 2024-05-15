import { getHomepageContent } from "../(editor)/homepage/actions";

import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import Link from "next/link";

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
      <AboutSection about={about} />
      <ProjectsSection projects={projects} />
      <ContactSection
        contactSectionTitle={contactSectionTitle}
        contactLinks={contactLinks}
      />
      <footer className="w-full bg-slate-800 print:hidden border-t border-slate-700">
        <nav className="flex flex-row flex-wrap justify-center">
          <Link href="/homepage" className="p-2">
            Edit Homepage
          </Link>
        </nav>
      </footer>
    </div>
  );
}
