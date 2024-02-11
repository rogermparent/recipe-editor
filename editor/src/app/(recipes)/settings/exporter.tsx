"use client";

import { Button } from "@/components/Button";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const decoder = new TextDecoder();

function OutputWindow({ children }: { children: ReactNode }) {
  return (
    <div className="my-1 text-sm rounded-lg bg-slate-700 overflow-auto h-96 w-full">
      <pre className="p-3 inline-block min-w-full">{children}</pre>
    </div>
  );
}

function useStreamText(): [
  string,
  Dispatch<SetStateAction<Response | undefined>>,
] {
  const [streamResponse, setStreamResponse] = useState<Response>();
  const [streamText, setStreamText] = useState("");
  useEffect(() => {
    if (streamResponse) {
      if (streamResponse.body) {
        setStreamText("");
        const reader = streamResponse.body.getReader();
        (async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              return;
            }
            setStreamText((cur) => cur + decoder.decode(value));
          }
        })();
      }
    }
  }, [streamResponse, setStreamText]);
  return [streamText, setStreamResponse];
}

export function Exporter() {
  const [buildLog, setBuildResponse] = useStreamText();
  const [deployLog, setDeployResponse] = useStreamText();
  return (
    <div className="p-2 w-full">
      <form
        action="/build"
        className="p-1 block"
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/build").then((res) => {
            setBuildResponse(res);
          });
        }}
      >
        <Button type="submit">Build</Button>
        <OutputWindow>{buildLog}</OutputWindow>
      </form>
      <form
        action="/deploy"
        className="p-1 block"
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/deploy").then((res) => {
            setDeployResponse(res);
          });
        }}
      >
        <Button type="submit">Deploy</Button>
        <OutputWindow>{deployLog}</OutputWindow>
      </form>
    </div>
  );
}
