import { HomepageContent } from "../../../homepage-controller/types";
import ProjectCard from "../ProjectCard";

export default function ProjectsSection({ projects }: HomepageContent) {
  return (
    <section className="w-full container mx-auto px-4 py-12" id="projects">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects
          ? projects.map(async (project, i) => {
              return <ProjectCard key={i} project={project} />;
            })
          : null}
      </ul>
    </section>
  );
}
