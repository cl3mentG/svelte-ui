import type { Snippet } from "svelte";
import type { SvelteDate } from "svelte/reactivity";
import type { CommonDateProps } from "../types";
import type { CommonControlProps } from "$lib/ui/types";

export type DateRange = { start: Date | null; end: Date | null };
export type DayRangeStatus = {
    isStart: boolean;
    isEnd: boolean;
    isInRange: boolean;
    isSelectable: boolean;
    isInMonth: boolean;
};

export type DaterangePickerTriggerProps = {
    locale: string;
    value: DateRange;
    isOpen: boolean;
    error: boolean
}

export type DaterangePickerProps = CommonDateProps & CommonControlProps & {
    triggerSnippet: Snippet<[DaterangePickerTriggerProps]>;
    dayCellSnippet: Snippet<[Date, DayRangeStatus]>;
};