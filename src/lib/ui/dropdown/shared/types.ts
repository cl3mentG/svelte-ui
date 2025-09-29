import type { Snippet } from "svelte";
import type { GroupedOptions, Option, Group } from "../types";

export type MenuProps = {
    isOpen: boolean;
    groupedOptions: GroupedOptions;
    selectOption: (optionValue: string, optionData: Option) => void;
    isSelected: (value: string) => boolean;
    optionSnippet: Snippet<[Option, boolean]>;
    sortOptions?: (a: Option, b: Option) => number;
    sortGroups?: (a: Group, b: Group) => number;

    groupSnippet?: Snippet<[Group]>;
    noResultSnippet?: Snippet;
    contentClass?: string;
    menuClass?: string;
    options: Record<string, Option>;
    groups?: Record<string, Group>;
};