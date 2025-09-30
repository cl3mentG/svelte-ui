import type { Snippet } from "svelte";
import type { SvelteDate } from "svelte/reactivity";
import type { CommonDateProps } from "../types";

export type DayStatus = {
    isSelectable: boolean;
    isInMonth: boolean;
    isSelected: boolean
}

export type DatepickerProps = CommonDateProps & {
    value?: SvelteDate;
    triggerSnippet: Snippet<[string, SvelteDate | undefined]>;
    dayCellSnippet: Snippet<[DayStatus, Date]>;
};