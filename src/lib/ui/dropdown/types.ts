import type { Snippet } from "svelte";

export type BaseOption = { label: string; group?: string };
export type BaseGroup = { label: string };

export type Options<Option extends BaseOption> = Record<string, Option>;
export type Groups<Group extends BaseGroup> = Record<string, Group>;

export type GroupedOptions<Option extends BaseOption, Group extends BaseGroup> = Record<
    string,
    {
        options: Record<string, Option>;
        groupProps?: Group;
    }
>;

export type CommonDropdownProps<
    Option extends BaseOption,
    Group extends BaseGroup
> = {
    placeholder?: string;
    noResultLabel?: string;

    options: Options<Option>;
    groups?: Groups<Group>;

    onSelect?: (value: string) => void;

    optionSnippet?: Snippet<[Option, boolean]>;
    groupSnippet?: Snippet<[Group]>;

    sortOptions?: (a: Option, b: Option) => number;
    sortGroups?: (a: Group, b: Group) => number;
}