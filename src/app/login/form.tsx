"use client";

import { Errors, PasswordInput, TextInput } from "@/components/Form";
import { useFormState } from "react-dom";
import { authenticate } from "./controller";
import { Button } from "@/components/Button";

export default function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  return (
    <div className="mx-1 my-3">
      <Errors errors={state ? [state] : undefined} />
      <form action={dispatch}>
        <TextInput name="email" label="Email" id="email" />
        <PasswordInput name="password" label="Password" id="password" />
        <Button>Login</Button>
      </form>
    </div>
  );
}
