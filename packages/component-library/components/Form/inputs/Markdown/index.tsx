"use client";

import {
  ChangeEventHandler,
  MouseEventHandler,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../..";
import clsx from "clsx";
import StyledMarkdown from "component-library/components/Markdown";
import { Button } from "component-library/components/Button";

function FormatButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      onClick={onClick}
      overrideDefaultStyles={true}
      className="w-6 h-6 leading-none text-center rounded bg-slate-700 hover:bg-slate-500 disabled:bg-gray-900"
      type="button"
    >
      {children}
    </Button>
  );
}

export function MarkdownInput({
  name,
  id = name,
  defaultValue,
  onChange,
  label,
  errors,
}: {
  name?: string;
  id?: string;
  label?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  errors?: string[];
}) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [value, setValue] = useState(defaultValue || "");
  const [selectionRange, setSelectionRange] = useState<
    { selectionStart: number; selectionEnd: number } | undefined
  >();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    onChange?.(event);
  };

  const wrapSelection = (prefix: string, suffix: string) => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const { selectionStart, selectionEnd } = textArea;
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newValue =
        value.substring(0, selectionStart) +
        prefix +
        selectedText +
        suffix +
        value.substring(selectionEnd);
      setValue(newValue);
      setSelectionRange({
        selectionStart: selectionStart + prefix.length,
        selectionEnd: selectionEnd + prefix.length,
      });
      onChange?.({
        target: { value: newValue },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  };

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea && selectionRange) {
      const { selectionStart, selectionEnd } = selectionRange;
      textArea.focus();
      textArea.setSelectionRange(selectionStart, selectionEnd);
    }
  }, [selectionRange]);

  const handleCodeClick: MouseEventHandler<HTMLButtonElement> = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const { selectionStart, selectionEnd } = textArea;
      const selectedText = value.substring(selectionStart, selectionEnd);

      if (selectedText.includes("\n")) {
        // Multiline code block
        wrapSelection("`\n", "\n`");
      } else {
        // Inline code
        wrapSelection("`", "`");
      }
    }
  };

  const handleBoldClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection("**", "**");
  };

  const handleItalicClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection("*", "*");
  };

  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <div className="flex flex-col border rounded">
        <div className="flex border-b">
          <Button
            overrideDefaultStyles={true}
            className={clsx(
              activeTab === "edit" ? "bg-blue-500 text-white" : "",
              "px-4 py-2 rounded-tl",
            )}
            onClick={() => setActiveTab("edit")}
          >
            Write
          </Button>
          <Button
            overrideDefaultStyles={true}
            className={clsx(
              activeTab === "preview" ? "bg-blue-500 text-white" : "",
              "px-4 py-2 rounded-tr",
            )}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </Button>
        </div>
        <div className={activeTab === "edit" ? "" : "hidden"}>
          <div className="flex gap-2 border-b p-2">
            <FormatButton onClick={handleBoldClick}>
              <span className="font-bold">B</span>
            </FormatButton>
            <FormatButton onClick={handleItalicClick}>
              <span className="italic">I</span>
            </FormatButton>
            <FormatButton onClick={handleCodeClick}>
              <span className="bg-slate-500 text-white font-mono py-0.5 px-1 rounded-sm">
                {"</>"}
              </span>
            </FormatButton>
          </div>
          <textarea
            name={name}
            id={id}
            ref={textAreaRef}
            className={clsx(baseInputStyle, "px-1 h-40 grow w-full")}
            value={value}
            onChange={handleChange}
          />
        </div>
        {activeTab === "preview" ? (
          <div className={"p-2 markdown-body"}>
            <StyledMarkdown>{value}</StyledMarkdown>
          </div>
        ) : null}
      </div>
    </FieldWrapper>
  );
}
