import { NextRequest, NextResponse } from "next/server";
import execa from "execa";
import { getContentDirectory } from "@/collections/recipes/controller/filesystemDirectories";
import { unstable_noStore } from "next/cache";

let currentStream: ReadableStream | undefined;

export async function GET(_request: NextRequest) {
  unstable_noStore();
  if (currentStream) {
    return new NextResponse("A build is already currently running!");
  }
  const newBuild = execa("pnpm", ["run", "-C", "../website", "build"], {
    all: true,
    env: {
      NODE_ENV: "production",
      CONTENT_DIRECTORY: getContentDirectory(),
    },
  });
  newBuild.once("close", () => {
    currentStream = undefined;
  });
  if (!newBuild.all) {
    throw new Error("Run has no all stream");
  }
  // const newStream = ReadStream.toWeb(newBuild.all) as ReadableStream;
  const newStream = new TransformStream();
  const writer = newStream.writable.getWriter();
  newBuild.all.on("data", (chunk) => {
    writer.write(chunk);
  });
  newBuild.all.on("close", () => {
    writer.close();
  });
  currentStream = newStream.readable;
  return new NextResponse(newStream.readable);
}
