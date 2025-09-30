import type { Snippet } from "svelte";
import type { SvelteDate } from "svelte/reactivity";
import type { CommonDateProps } from "../types";


export type DateRange = { start: Date | null; end: Date | null };
export type DayRangeStatus = {
    isStart: boolean;
    isEnd: boolean;
    isInRange: boolean;
    isSelectable: boolean;
    isInMonth: boolean;
};

export type DaterangepickerProps = CommonDateProps & {
    value?: SvelteDate;
    triggerSnippet: Snippet<[string, DateRange]>;
    dayCellSnippet: Snippet<[DayRangeStatus, Date]>;
};