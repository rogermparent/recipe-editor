import {
  DefaultControls,
  FormatButton,
  MarkdownControlsProps,
  wrapSelection,
} from "component-library/components/Form/inputs/Markdown/common";

export function MultiplyableControl({ textArea }: MarkdownControlsProps) {
  const handleMultiplyableClick = () => {
    wrapSelection({
      prefix: `<Multiplyable baseNumber="`,
      suffix: `" />`,
      textArea,
    });
  };

  return (
    <FormatButton onClick={handleMultiplyableClick}>
      <span>&times;</span>
    </FormatButton>
  );
}

export function RecipeCustomControls({ textArea }: MarkdownControlsProps) {
  return (
    <>
      <MultiplyableControl textArea={textArea} />
      <DefaultControls textArea={textArea} />
    </>
  );
}

export function DummyMultiplyable({
  baseNumber,
}: {
  baseNumber: string | number;
}) {
  return <>{baseNumber}</>;
}
