import {
  ChangeEventHandler,
  MouseEventHandler,
  useState,
  useRef,
  useEffect,
  ReactNode,
  RefObject,
} from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../..";
import clsx from "clsx";
import StyledMarkdown from "component-library/components/Markdown";
import { Button } from "component-library/components/Button";

export interface MarkdownControlsProps {
  textArea: HTMLTextAreaElement | null;
  setValue: (value: string) => void;
  setSelectionRange: (range: SelectionRange) => void;
}

export interface SelectionRange {
  selectionStart: number;
  selectionEnd: number;
}

export interface MarkdownInputProps {
  name?: string;
  id?: string;
  label?: string;
  defaultValue?: string;
  errors?: string[];
  Controls?: (props: MarkdownControlsProps) => ReactNode;
}

export function FormatButton({
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

export const wrapSelection = ({
  prefix,
  suffix,
  textArea,
  setValue,
  reselect = true,
  setSelectionRange,
}: {
  prefix: string;
  suffix: string;
  reselect?: boolean;
  textArea: HTMLTextAreaElement | null;
  setValue: (value: string) => void;
  setSelectionRange: (range: SelectionRange) => void;
}) => {
  if (textArea) {
    const value = textArea.value;
    const { selectionStart, selectionEnd } = textArea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const newValue =
      value.substring(0, selectionStart) +
      prefix +
      selectedText +
      suffix +
      value.substring(selectionEnd);
    setValue(newValue);
    if (reselect) {
      setSelectionRange({
        selectionStart: selectionStart + prefix.length,
        selectionEnd: selectionEnd + prefix.length,
      });
    }
  }
};

function BoldControl({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleBoldClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection({
      prefix: "**",
      suffix: "**",
      textArea,
      setValue,
      setSelectionRange,
    });
  };

  return (
    <FormatButton onClick={handleBoldClick}>
      <span className="font-bold">B</span>
    </FormatButton>
  );
}

function ItalicControl({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleItalicClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection({
      prefix: "*",
      suffix: "*",
      textArea,
      setValue,
      setSelectionRange,
    });
  };

  return (
    <FormatButton onClick={handleItalicClick}>
      <span className="italic">I</span>
    </FormatButton>
  );
}

function LinkControl({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleLinkClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (textArea) {
      const value = textArea.value;
      const { selectionStart, selectionEnd } = textArea;
      const selectedText = value.substring(selectionStart, selectionEnd);

      let newSelectionStart = selectionStart + 1; // After the opening bracket
      let newSelectionEnd;

      if (selectedText.length > 0) {
        // Text is selected, start selection after selected text and "]("
        newSelectionStart += selectedText.length + 2;
        // End selection after "url"
        newSelectionEnd = newSelectionStart + 3;
      } else {
        // No text is selected, place cursor in the label area for typing
        newSelectionEnd = newSelectionStart;
      }

      wrapSelection({
        prefix: "[",
        suffix: "](url)",
        textArea,
        setValue,
        setSelectionRange,
        reselect: false,
      });
      setSelectionRange({
        selectionStart: newSelectionStart,
        selectionEnd: newSelectionEnd,
      });
    }
  };

  return (
    <FormatButton onClick={handleLinkClick}>
      <span className="text-xs">🔗</span>
    </FormatButton>
  );
}

function getBlockquoteSelection({
  value,
  selectionStart,
  selectionEnd,
}: {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}) {
  if (selectionStart === selectionEnd && selectionEnd !== value.length) {
    const closestNewlineBefore = value.lastIndexOf(
      "\n",
      value[selectionStart] === "\n" ? selectionStart - 1 : selectionStart,
    );
    const closestNewlineAfter = value.indexOf("\n", selectionEnd);
    const lineStart =
      closestNewlineBefore === -1 ? 0 : closestNewlineBefore + 1;
    const lineEnd =
      closestNewlineAfter === -1 ? value.length : closestNewlineAfter;
    return { selectionStart: lineStart, selectionEnd: lineEnd };
  } else {
    return { selectionStart, selectionEnd };
  }
}

function BlockquoteControl({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleBlockquoteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (textArea) {
      const value = textArea.value;
      const { selectionStart, selectionEnd } = getBlockquoteSelection({
        selectionStart: textArea.selectionStart,
        selectionEnd: textArea.selectionEnd,
        value,
      });

      const selectedText = value.substring(selectionStart, selectionEnd);

      const selectedLines = selectedText.split("\n");

      const quotedSelectionContent = selectedLines
        .map((line) => `> ${line}`)
        .join("\n");

      const characterBeforeSelection = value[selectionStart - 1];
      const characterTwoBeforeSelection = value[selectionStart - 2];
      const characterAfterSelection = value[selectionEnd];
      const characterTwoAfterSelection = value[selectionEnd + 1];

      const quotedSelection = [
        characterBeforeSelection === "\n" ? "" : "\n",
        characterTwoBeforeSelection === "\n" ? "" : "\n",
        quotedSelectionContent,
        characterAfterSelection === "\n" ? "" : "\n",
        characterTwoAfterSelection === "\n" ? "" : "\n",
      ].join("");

      const newValue =
        value.substring(0, selectionStart) +
        quotedSelection +
        value.substring(selectionEnd);

      setValue(newValue);

      if (selectionStart === selectionEnd) {
        const blockquoteContentIndex =
          selectionStart + quotedSelection.indexOf("> ") + 2;
        setSelectionRange({
          selectionStart: blockquoteContentIndex,
          selectionEnd: blockquoteContentIndex,
        });
      } else {
        setSelectionRange({
          selectionStart,
          selectionEnd: selectionStart + quotedSelection.length,
        });
      }
    }
  };

  return (
    <FormatButton onClick={handleBlockquoteClick}>
      <span className="text-xs font-bold">&ldquo;</span>
    </FormatButton>
  );
}

function CodeControl({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleCodeClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (textArea) {
      const value = textArea.value;
      const { selectionStart, selectionEnd } = textArea;
      const selectedText = value.substring(selectionStart, selectionEnd);

      if (selectedText.includes("\n")) {
        // Multiline code block
        wrapSelection({
          prefix: "\n```\n",
          suffix: "\n```\n",
          textArea,
          setValue,
          setSelectionRange,
        });
      } else {
        // Inline code
        wrapSelection({
          prefix: "`",
          suffix: "`",
          textArea,
          setValue,
          setSelectionRange,
        });
      }
    }
  };

  return (
    <FormatButton onClick={handleCodeClick}>
      <span className="font-mono text-xs">{"</>"}</span>
    </FormatButton>
  );
}

export function DefaultControls({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  return (
    <>
      <BoldControl
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
      <ItalicControl
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
      <CodeControl
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
      <LinkControl
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
      <BlockquoteControl
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
    </>
  );
}

export function MarkdownInput({
  name,
  id = name,
  defaultValue,
  label,
  errors,
  Controls = DefaultControls,
}: MarkdownInputProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [value, setValue] = useState(defaultValue || "");
  const [selectionRange, setSelectionRange] = useState<
    SelectionRange | undefined
  >();
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textArea && selectionRange) {
      const { selectionStart, selectionEnd } = selectionRange;
      textArea.focus();
      textArea.setSelectionRange(selectionStart, selectionEnd);
    }
  }, [selectionRange]);

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
            <Controls
              textArea={textArea}
              setValue={setValue}
              setSelectionRange={setSelectionRange}
            />
          </div>
          <textarea
            name={name}
            id={id}
            ref={(el) => {
              setTextArea(el);
            }}
            className={clsx(baseInputStyle, "px-1 h-40 grow w-full")}
            value={value}
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
