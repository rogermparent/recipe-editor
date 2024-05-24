import { MouseEventHandler, ReactNode } from "react";
import { Button } from "component-library/components/Button";

export interface MarkdownControlsProps {
  input: HTMLInputElement | HTMLTextAreaElement | null;
}

export interface SelectionRange {
  selectionStart: number;
  selectionEnd: number;
}

export function FormatButton({
  children,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
}) {
  return (
    <Button
      onClick={onClick}
      overrideDefaultStyles={true}
      className="w-6 h-6 leading-none text-center rounded bg-slate-700 hover:bg-slate-500 disabled:bg-gray-900"
      type="button"
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

export const wrapSelection = ({
  prefix,
  suffix,
  input,
  reselect = true,
}: {
  prefix: string;
  suffix: string;
  reselect?: boolean;
  input: HTMLInputElement | HTMLTextAreaElement | null;
}) => {
  if (input) {
    const value = input.value;
    const { selectionStart, selectionEnd } = input;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const newValue =
      value.substring(0, selectionStart) +
      prefix +
      selectedText +
      suffix +
      value.substring(selectionEnd);
    input.value = newValue;
    if (reselect) {
      input.focus();
      input.setSelectionRange(
        selectionStart + prefix.length,
        selectionEnd + prefix.length,
      );
    }
  }
};
