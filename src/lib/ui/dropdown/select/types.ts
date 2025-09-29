import type { Snippet } from "svelte";
import type { CommonControlProps, CommonDropdownProps, Option } from "../types";

export type SelectProps = CommonControlProps & CommonDropdownProps & {
    value?: string;
    onSelect?: (val: string) => void;
    triggerSnippet: Snippet<[Option | undefined, boolean]>
}