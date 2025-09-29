import type { Snippet } from "svelte";
import type { CommonControlProps, CommonDropdownProps } from "../types";
import type { Option } from "../types";

export type SearchProps = CommonControlProps & CommonDropdownProps & {
    value?: string;
    placeholder?: string;
    inputClass?: string;
    noResultSnippet: Snippet;
    onSelect?: (val: string) => void;
    onDeselect?: () => void;

    triggerSnippet: Snippet<[Option | undefined, () => void]>
}