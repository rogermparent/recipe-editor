import { getPostDirectory, getPostUploadsDirectory } from "@/app/lib/data";
import { ReadStream } from "fs";
import { open } from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";

export async function GET(
  _request: NextRequest,
  {
    params: { slug, filename },
  }: { params: { slug: string; filename: string } },
) {
  try {
    const uploadFilePath = resolve(
      getPostUploadsDirectory(getPostDirectory(slug)),
      filename,
    );
    const handle = await open(uploadFilePath);
    const stream = ReadStream.toWeb(
      handle.createReadStream(),
    ) as ReadableStream;
    return new NextResponse(stream);
  } catch (e) {
    notFound();
  }
}
