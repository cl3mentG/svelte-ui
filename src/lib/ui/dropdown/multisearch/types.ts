import type { Snippet } from "svelte";
import type { CommonControlProps, CommonDropdownProps } from "../types";
import type { Option } from "../types";

export type MultisearchProps = CommonControlProps & CommonDropdownProps & {
    value?: string[];
    minCount?: number;
    maxCount?: number;
    placeholder?: string;
    noResultSnippet: Snippet;
    onSelect?: (val: string) => void;

    selectedOptionSnippet: Snippet<[string, Option, (val: string, event: MouseEvent) => void]>;
    triggerClass?: string;
}