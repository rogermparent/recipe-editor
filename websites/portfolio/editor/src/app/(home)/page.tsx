import { join } from "path";
import { getHomepageContent } from "../(editor)/homepage/actions";
import { getStaticImageProps } from "next-static-image/src";
import {
  transformedImageOutputDirectory,
  uploadsDirectory,
} from "../(editor)/homepage/paths";
import Image from "next/image";

import Link from "next/link";
import { readFile } from "fs/promises";
import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import { ContactLink } from "../(editor)/homepage/types";
import Markdown from "markdown-to-jsx";

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
        <section className="flex flex-col flex-nowrap py-12 px-3 bg-backgroundAlt-light dark:bg-backgroundAlt-dark w-full h-screen items-center justify-center">
          <div className="max-w-prose mx-auto">
            <Markdown options={{ forceWrapper: true }}>{about}</Markdown>
          </div>
        </section>
      )}

      <section className="w-full container mx-auto px-4 py-12">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Grid for responsive layout */}
          {projects
            ? await Promise.all(
                projects.map(async ({ name, description, image, links }, i) => {
                  const imageProps = image
                    ? await getStaticImageProps(
                        {
                          srcPath: join(uploadsDirectory, image),
                          localOutputDirectory: transformedImageOutputDirectory,
                        },
                        {
                          src: `/uploads/${image}`,
                          alt: `Image for ${name}`,
                          width: 320,
                          height: 320,
                        },
                      )
                    : undefined;

                  return (
                    <li
                      key={i}
                      className="rounded-lg overflow-hidden shadow-md"
                    >
                      {/* Card styling */}
                      <div className="relative">
                        {/* Container for image and overlay */}
                        {imageProps && (
                          <Image
                            {...imageProps.props}
                            alt="Project Image"
                            unoptimized={true}
                            className="w-full h-64 object-cover transition duration-300 hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        {/* Increased padding */}
                        <h3 className="font-bold text-xl mb-2 text-primary-light dark:text-primary-dark">
                          {name}
                        </h3>
                        {links &&
                          links.map(({ link, label }, i) => (
                            <Link
                              href={link}
                              key={i}
                              className="font-bold p-1 underline text-secondary-light dark:text-secondary-dark"
                            >
                              {label}
                            </Link>
                          ))}
                        <p className="mt-2">{description}</p>
                      </div>
                    </li>
                  );
                }),
              )
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
