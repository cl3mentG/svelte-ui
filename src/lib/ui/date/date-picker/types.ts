import type { Snippet } from "svelte";
import type { SvelteDate } from "svelte/reactivity";
import type { CommonDateProps } from "../types";
import type { CommonControlProps } from "$lib/ui/types";

export type DayStatus = {
    isSelectable: boolean;
    isInMonth: boolean;
    isSelected: boolean
}

export type DatePickerTriggerProps = {
    locale: string;
    value: Date | undefined;
    isOpen: boolean;
    error: boolean
}

export type DatepickerProps = CommonDateProps & CommonControlProps & {
    value?: SvelteDate;
    triggerSnippet: Snippet<[DatePickerTriggerProps]>;
    dayCellSnippet: Snippet<[DayStatus, Date]>;
};