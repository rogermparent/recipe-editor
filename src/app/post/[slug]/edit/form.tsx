"use client";

import { PostFields } from "@/components/PostForm";
import { useFormState } from "react-dom";
import { State, updatePost } from "@/app/lib/actions";
import { Button } from "@/components/Button";
import { Post } from "@/app/lib/data";

export default function EditPostForm({
  post,
  slug,
}: {
  slug: string;
  post: Post;
}) {
  const { date } = post;
  const initialState = { message: "", errors: {} } as State;
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
