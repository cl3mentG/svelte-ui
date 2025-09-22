import { clsx } from "clsx";
import { twMerge, type ClassNameValue } from "tailwind-merge";

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs));
}

export function extractAndRemoveDimensionClasses(twString: string) {
    const dimensionRegex = /\b(w-|min-w-|max-w-)\S*/g;
    const matches = twString.match(dimensionRegex) || [];
    const rest = twString.replace(dimensionRegex, "").replace(/\s+/g, " ").trim();
    return { dimensionClasses: matches.join(" "), otherClasses: rest };
}