// components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";
import { HomepageProjectItem } from "../(editor)/homepage/types"; // Assuming you have types defined
import { getStaticImageProps } from "next-static-image/src";
import { join } from "path";
import {
  transformedImageOutputDirectory,
  uploadsDirectory,
} from "../(editor)/homepage/paths";

interface ProjectCardProps {
  project: HomepageProjectItem;
}

export default async function ProjectCard({ project }: ProjectCardProps) {
  const imageProps = project.image // assuming image is part of the project data
    ? await getStaticImageProps(
        {
          srcPath: join(uploadsDirectory, project.image),
          localOutputDirectory: transformedImageOutputDirectory,
        },
        {
          src: `/uploads/${project.image}`,
          alt: `Image for ${project.name}`,
          width: 320,
          height: 320,
        },
      )
    : undefined;

  return (
    <li className="rounded-lg overflow-hidden shadow-md">
      <div className="relative overflow-hidden">
        {imageProps && (
          <Image
            {...imageProps.props}
            alt={`Image for ${project.name}`}
            unoptimized={true}
            className="w-full h-64 object-cover transition duration-300 hover:scale-105"
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
