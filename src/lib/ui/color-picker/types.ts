import type { Snippet } from "svelte";
import type { Color } from "./color.svelte";
import type { CommonControlProps } from "../types";

export type ColorPickerTriggerProps = {
    color: Color;
    isOpen: boolean;
    error: boolean;
}

export type ColorPickerProps = CommonControlProps & {
    triggerSnippet: Snippet<[ColorPickerTriggerProps]>;
    menuClass?: string;
    noAlpha?: boolean;
    inputClass?: string;
    sliderTrackClass?: string;
    sliderThumbClass?: string;
    gradientTrackClass?: string;
    gradientThumbClass?: string;
};
