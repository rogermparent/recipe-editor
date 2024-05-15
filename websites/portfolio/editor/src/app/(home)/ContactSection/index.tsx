import { join } from "path";
import { HomepageContent } from "@/app/(editor)/homepage/types";
import Link from "next/link";
import { readFile } from "fs/promises";
import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import { ContactLink } from "../../(editor)/homepage/types";

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

export default async function ContactSection({
  contactSectionTitle,
  contactLinks,
}: HomepageContent) {
  return (
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
  );
}
