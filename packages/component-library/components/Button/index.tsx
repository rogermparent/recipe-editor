import clsx from "clsx";
import { MouseEventHandler, ReactNode } from "react";

export const defaultButtonStyles =
  "rounded-md px-2 py-1 bg-slate-700 hover:bg-slate-500 disabled:bg-gray-900 disabled:text-gray-400 disabled:italic";

export function Button({
  children,
  type = "button",
  onClick,
  className,
  disabled,
  overrideDefaultStyles,
}: {
  children: ReactNode;
  type?: HTMLButtonElement["type"];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  overrideDefaultStyles?: boolean;
}) {
  return (
    <button
      className={clsx(!overrideDefaultStyles && defaultButtonStyles, className)}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function PaddedButton({
  children,
  type = "button",
  onClick,
  className,
  disabled,
}: {
  children: ReactNode;
  type?: HTMLButtonElement["type"];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={clsx(className, "group")}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span className="rounded-md px-2 py-1 bg-slate-700 group-hover:bg-slate-500 disabled:bg-gray-900 disabled:text-gray-400 disabled:italic">
        {children}
      </span>
    </button>
  );
}
