"use client";

import { PostFields } from "@/components/PostForm";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { Post } from "@/app/lib/models/posts/types";
import { PostFormState } from "@/app/lib/models/posts/formState";
import  updatePost  from "@/app/lib/models/posts/actions/update";

export default function EditPostForm({
  post,
  slug,
}: {
  slug: string;
  post: Post;
}) {
  const { date } = post;
  const initialState = { message: "", errors: {} } as PostFormState;
  const updateThisPost = updatePost.bind(null, date, slug);
  const [state, dispatch] = useFormState(updateThisPost, initialState);
  return (
    <form className="w-full h-full flex flex-col grow" action={dispatch}>
      <PostFields post={post} slug={slug} state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button>Submit</Button>
      </div>
    </form>
  );
}
