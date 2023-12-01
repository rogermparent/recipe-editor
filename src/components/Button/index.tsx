import { ReactNode } from "react";

export function Button({ children }: { children: ReactNode }) {
  return (
    <button className="rounded-md px-2 py-1 bg-slate-700 hover:bg-slate-500">
      {children}
    </button>
  );
}
