import { DefaultControls, FormatButton, MarkdownInputProps } from "../common";
import clsx from "clsx";
import { MouseEventHandler, useState } from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../../..";
import StyledMarkdown from "component-library/components/Markdown";

const DummyMultiplyable = ({ baseNumber }: { baseNumber: string }) => (
  <span>{baseNumber}</span>
);

export function InlineMarkdownInput({
  name,
  id = name,
  defaultValue,
  label,
  errors,
  Controls = DefaultControls,
  components = {},
}: MarkdownInputProps) {
  const [preview, setPreview] = useState<boolean>(false);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const togglePreview: MouseEventHandler<HTMLButtonElement> = () => {
    setPreview(!preview);
  };

  const allComponents = {
    Multiplyable: DummyMultiplyable,
    ...components,
  };

  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <div className="flex flex-col border rounded">
        <div>
          <div className="flex gap-2 border-b p-2">
            <Controls textArea={input} />
            <FormatButton
              aria-label={preview ? "Edit" : "Preview"}
              onClick={togglePreview}
            >
              {preview ? <span>&#9998;</span> : <span>👁️</span>}
            </FormatButton>
          </div>
          <input
            name={name}
            id={id}
            ref={(el) => {
              setInput(el);
            }}
            className={clsx(
              baseInputStyle,
              "px-1 grow w-full h-8",
              preview ? "hidden" : "block",
            )}
            defaultValue={defaultValue}
          />
          {preview ? (
            <div className="p-1 markdown-body h-8">
              <StyledMarkdown components={allComponents}>
                {input?.value || ""}
              </StyledMarkdown>
            </div>
          ) : null}
        </div>
      </div>
    </FieldWrapper>
  );
}
