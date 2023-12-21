"use client";

import { PostFields } from "@/components/PostForm";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { PostFormState } from "@/app/lib/models/posts/formState";
import  createPost  from "@/app/lib/models/posts/actions/create";

export default function NewPostForm() {
  const initialState = { message: "", errors: {} } as PostFormState;
  const [state, dispatch] = useFormState(createPost, initialState);
  return (
    <form className="m-2 w-full" action={dispatch}>
      <h2 className="font-bold text-2xl mb-2">New Post</h2>
      <div className="flex flex-col flex-nowrap">
        <PostFields state={state} />
        <div id="missing-fields-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
        <div className="my-1">
          <Button>
            <span>Post</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
