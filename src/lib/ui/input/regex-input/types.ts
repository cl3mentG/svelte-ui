import type { CommonInputProps } from "../types";

export type RegexInputProps = CommonInputProps & {
    validRegex: RegExp;
    completionRegex?: RegExp;
    value?: string;
}