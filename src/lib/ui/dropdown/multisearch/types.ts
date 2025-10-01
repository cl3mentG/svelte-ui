import type { Snippet } from "svelte";
import type { CommonDropdownProps } from "../types";
import type { Option } from "../types";
import type { HTMLInputAttributes } from "svelte/elements";
import type { CommonControlProps } from "$lib/ui/types";

export type MultisearchTriggerProps = {
    selectedOptionsSnippet: Snippet;
    input: Snippet<[Partial<HTMLInputAttributes> & { class?: string }]>;
    isOpen: boolean;
    error: boolean;
    resetOptions: () => void;
    focusInput: () => void;
}
export type MultisearchProps = CommonControlProps & CommonDropdownProps & {
    value?: string[];
    minCount?: number;
    maxCount?: number;
    noResultSnippet: Snippet;
    onSelect?: (val: string) => void;
    selectedOptionSnippet: Snippet<[Option, () => void]>;
    triggerSnippet: Snippet<[MultisearchTriggerProps]>;
}