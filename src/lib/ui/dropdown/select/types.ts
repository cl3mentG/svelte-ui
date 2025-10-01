import type { Snippet } from "svelte";
import type { CommonDropdownProps, Option } from "../types";
import type { CommonControlProps } from "$lib/ui/types";

export type SelectTriggerProps = {
    selectedOption: Option | undefined;
    isOpen: boolean;
    error: boolean;
}

export type SelectProps = CommonControlProps & CommonDropdownProps & {
    value?: string;
    onSelect?: (val: string) => void;
    triggerSnippet: Snippet<[SelectTriggerProps]>
}