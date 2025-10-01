import type { Snippet } from "svelte";
import type { CommonInputProps } from "../types";

export type NumberInputFunctions = {
    startIncrement: (e: MouseEvent) => void;
    stopIncrement: (e: MouseEvent) => void;
    startDecrement: (e: MouseEvent) => void;
    stopDecrement: (e: MouseEvent) => void;
}

export type NumberInputButtonsProps = {
    functions: NumberInputFunctions;
    disabled?: boolean;
    readonly?: boolean;
}

export type NumberInputProps = CommonInputProps & {
    decimalSeparator: "," | ".";
    step?: number;
    max?: number;
    min?: number;
    buttonsSnippet?: Snippet<[NumberInputButtonsProps]>
}