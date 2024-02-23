import { NextRequest, NextResponse } from "next/server";
import execa from "execa";
import { getContentDirectory } from "recipes-collection/controller/filesystemDirectories";
import { unstable_noStore } from "next/cache";
import { auth, signIn } from "@/auth";

let currentStream: ReadableStream | undefined;

async function attachCommandsToStream(inputStream: WritableStream) {
  const contentDirectory = getContentDirectory();
  const writer = inputStream.getWriter();
  const newBuild = execa("./scripts/build.sh", [], {
    all: true,
    env: {
      NODE_ENV: "production",
      CONTENT_DIRECTORY: contentDirectory,
    },
  });
  newBuild.once("close", () => {
    currentStream = undefined;
  });
  if (!newBuild.all) {
    throw new Error("Run has no all stream");
  }
  newBuild.all.on("data", (chunk) => {
    writer.write(chunk);
  });
  try {
    await newBuild;
  } catch (e) {
    console.error(e);
  }
  writer.close();
}

export async function GET(_request: NextRequest) {
  unstable_noStore();
  const user = await auth();
  if (!user) {
    return signIn();
  }
  if (currentStream) {
    return new NextResponse("A build is already currently running!");
  }
  const newStream = new TransformStream();
  attachCommandsToStream(newStream.writable);
  currentStream = newStream.readable;
  return new NextResponse(newStream.readable);
}
