"use client";

import { Errors, PasswordInput, TextInput } from "@/components/Form";
import { useFormState } from "react-dom";
import { authenticate } from "./controller";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  return (
    <main className="grow">
      <Errors errors={state ? [state] : undefined} />
      <form action={dispatch}>
        <TextInput name="email" label="Email" id="email" />
        <PasswordInput name="password" label="Password" id="password" />
        <Button>Login</Button>
      </form>
    </main>
  );
}
