import { TextInput } from "component-library/components/Form/inputs/Text";
import { TextAreaInput } from "component-library/components/Form/inputs/TextArea";
import HomepageProjectsInput from "./HomepageProjectsInput";
import { getHomepageContent, writeHomepageContent } from "./actions";
import { Button } from "component-library/components/Button";
import HomepageContactLinksInput from "./HomepageContactLinksInput";
import { getStaticImageProps } from "next-static-image/src";
import { resolve } from "path";
import { transformedImageOutputDirectory, uploadsDirectory } from "./paths";
import { HomepageProjectItem } from "./types";

export default async function HomepageEditor() {
  const homepageContent = await getHomepageContent();
  const { projects, title, about, contactLinks, contactSectionTitle } =
    homepageContent || {};
  const projectsWithImagesPromise = projects?.map<Promise<HomepageProjectItem>>(
    async (project) => {
      const existingImage = project.image
        ? await getStaticImageProps(
            {
              srcPath: resolve(uploadsDirectory, project.image),
              localOutputDirectory: transformedImageOutputDirectory,
            },
            {
              src: `/uploads/${project.image}`,
              width: 400,
              height: 400,
              alt: "Existing image",
            },
          )
        : undefined;
      return { ...project, existingImage };
    },
  );

  const projectsWithImages =
    projectsWithImagesPromise && (await Promise.all(projectsWithImagesPromise));
  return (
    <div className="flex-1 flex flex-col flex-nowrap container p-2">
      <form action={writeHomepageContent}>
        <TextInput name="title" label="Title" defaultValue={title || ""} />
        <TextAreaInput name="about" label="About" defaultValue={about || ""} />
        <HomepageProjectsInput defaultValue={projectsWithImages} />
        <TextInput
          name="contactSectionTitle"
          label="Contact Section Intro"
          defaultValue={contactSectionTitle || ""}
        />
        <HomepageContactLinksInput defaultValue={contactLinks} />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
