// components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";
import { HomepageProjectItem } from "../(editor)/homepage/types"; // Assuming you have types defined

interface ProjectCardProps {
  project: HomepageProjectItem;
  imageProps: any;
}

export default function ProjectCard({ project, imageProps }: ProjectCardProps) {
  return (
    <li className="rounded-lg overflow-hidden shadow-md">
      <div className="relative overflow-hidden">
        {imageProps && (
          <Image
            {...imageProps.props}
            alt={`Image for ${project.name}`}
            unoptimized={true}
            className="w-full h-64 object-cover transition duration-300 hover:scale-110"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-primary-light dark:text-primary-dark">
          {project.name}
        </h3>
        {project.links &&
          project.links.map(({ link, label }, i) => (
            <Link
              href={link}
              key={i}
              className="font-bold p-1 underline text-secondary-light dark:text-secondary-dark"
            >
              {label}
            </Link>
          ))}
        <p className="mt-2">{project.description}</p>
      </div>
    </li>
  );
}
