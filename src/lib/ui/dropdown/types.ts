import type { Snippet } from "svelte";

export type Option =  Record<string, any> & { group?: string };
export type Group = Record<string, any>;

export type GroupedOptions = Record<
    string,
    {
        options: Record<string, Option>;
        groupProps?: Group;
    }
>;

export type CommonDropdownProps = {
    contentClass?: string
    menuClass?: string

    options: Record<string, Option>;
    groups?: Record<string, Group>;

    optionSnippet: Snippet<[Option, boolean]>;
    groupSnippet?: Snippet<[Group]>;

    sortOptions?: (a: Option, b: Option) => number;
    sortGroups?: (a: Group, b: Group) => number;
}