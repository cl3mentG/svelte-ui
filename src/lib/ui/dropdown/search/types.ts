import type { Snippet } from "svelte";
import type { CommonDropdownProps } from "../types";
import type { Option } from "../types";
import type { HTMLInputAttributes } from "svelte/elements";
import type { CommonControlProps } from "$lib/ui/types";

export type SearchTriggerProps = {
    input: Snippet<[Partial<HTMLInputAttributes> & {class?: string}]>;
    selectedOption: Option | undefined;
    isOpen: boolean;
    error: boolean;
    resetOption: () => void;
    focusInput: () => void;
}

export type SearchProps = CommonControlProps & CommonDropdownProps & {
    value?: string;
    noResultSnippet: Snippet;
    onSelect?: (val: string | undefined) => void;
    triggerSnippet: Snippet<[SearchTriggerProps]>
}