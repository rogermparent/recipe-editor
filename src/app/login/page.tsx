import Link from "next/link";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <main className="w-full h-full flex flex-col flex-nowrap justify-center items-center grow">
      <div>
        <LoginForm />
        <Link href="/" className="p-1">
          Go back home
        </Link>
      </div>
    </main>
  );
}
