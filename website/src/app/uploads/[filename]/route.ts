import { getContentDirectory } from "recipes-collection/controller/filesystemDirectories";
import { ReadStream } from "fs";
import { open, readdir } from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";

export async function GET(
  _request: NextRequest,
  { params: { filename } }: { params: { filename: string } },
) {
  try {
    const uploadFilePath = resolve(getContentDirectory(), "uploads", filename);
    const handle = await open(uploadFilePath);
    const stream = ReadStream.toWeb(
      handle.createReadStream(),
    ) as ReadableStream;
    return new NextResponse(stream);
  } catch (e) {
    notFound();
  }
}

export async function generateStaticParams() {
  const filenames = await readdir(resolve(getContentDirectory(), "uploads"));
  return filenames.map((filename) => ({ filename }));
}
