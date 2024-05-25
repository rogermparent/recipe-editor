import { Dispatch } from "react";
import { KeyListAction, ListInputButton } from "component-library/components/Form/inputs/List";
import { InputListControls } from "component-library/components/Form/inputs/List/index";

export function InstructionControls({
    dispatch,
    index,
    toggleIsGroup
}: {
    dispatch: Dispatch<KeyListAction>;
    index: number;
    toggleIsGroup: () => void
}) {
    return (
        <>
            <InputListControls dispatch={dispatch} index={index} />
            <ListInputButton onClick={toggleIsGroup}>
                {isGroup ? <>&#8213;</> : <>&#9776;</>}
            </ListInputButton>
        </>
    );
}
