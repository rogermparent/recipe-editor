import { ChangeEventHandler, useState } from "react";
import clsx from "clsx";
import { Errors, FieldWrapper, baseInputStyle } from "..";

export function DateTimeInput({
  name,
  id = name,
  date,
  label,
  currentTimezone,
  errors,
}: {
  name: string;
  id?: string;
  label: string;
  date?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  currentTimezone?: string;
  errors?: string[];
}) {
  const [currentDate, setCurrentDate] = useState(date);
  const dateObject =
    currentDate === undefined ? undefined : new Date(currentDate);
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <input
        step="any"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "p-1")}
        type="datetime-local"
        defaultValue={dateObject?.toISOString().slice(0, -1) || undefined}
        onChange={(e) => {
          const value = e.target?.value;
          if (value) {
            const parsedDate = Date.parse(value + "Z");
            if (!Number.isNaN(parsedDate)) {
              setCurrentDate(parsedDate);
              return undefined;
            }
          }
          setCurrentDate(undefined);
        }}
      />
      <div className="text-sm font-semibold italic h-4 my-0.5">
        {currentTimezone && currentDate && (
          <>
            {dateObject?.toLocaleString()} ({currentTimezone})
          </>
        )}
      </div>
    </FieldWrapper>
  );
}
