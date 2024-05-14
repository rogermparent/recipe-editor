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
    <div className="flex-1 w-full max-w-prose mx-auto">
      {about && (
        <section>
          <Markdown options={{ forceWrapper: true }}>{about}</Markdown>
        </section>
      )}
      <section>
        <ul>
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
                    <li key={i} className="w-full">
                      <div className="border border-slate-300 m-2">
                        {imageProps && (
                          <Image
                            {...imageProps.props}
                            alt="Project Image"
                            unoptimized={true}
                            className="w-full object-cover"
                          />
                        )}
                        <div className="m-2">
                          <h3 className="font-bold text-xl my-1">{name}</h3>
                          {links &&
                            links.map(({ link, label }, i) => (
                              <Link
                                href={link}
                                key={i}
                                className="font-bold p-1 underline"
                              >
                                {label}
                              </Link>
                            ))}
                          <p>{description}</p>
                        </div>
                      </div>
                    </li>
                  );
                }),
              )
            : null}
        </ul>
      </section>
      <section className="py-6">
        {contactSectionTitle && (
          <h2 className="text-3xl font-bold my-4 text-center">
            {contactSectionTitle}
          </h2>
        )}
        <ul className="text-center flex flex-col flex-nowrap justify-center w-auto mx-auto text-2xl px-2 my-10">
          {contactLinks?.map((contactLink, i) => {
            return <ContactLinkComponent key={i} item={contactLink} />;
          })}
        </ul>
      </section>
    </div>
  );
}
