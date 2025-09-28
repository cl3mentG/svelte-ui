<script lang="ts" generics="Option extends BaseOption, Group extends BaseGroup">
    import type {
        BaseOption,
        BaseGroup,
        GroupedOptions,
        CommonDropdownProps,
        Groups,
        Options,
    } from "../types";
    import Menu from "../shared/Menu.svelte";
    import type { Snippet } from "svelte";

    type SelectProps = CommonDropdownProps<Option, Group> & {
        value?: string;
        name?: string;
        id?: string;
        disabled?: boolean;
        readonly?: boolean;
        menuClass?: string;
        contentClass?: string;
        triggerSnippet: Snippet<[Option | undefined, boolean]>;
        noResultLabel?: string;

        options: Options<Option>;
        groups?: Groups<Group>;

        onSelect?: (value: string) => void;

        optionSnippet: Snippet<[Option, boolean]>;
        groupSnippet?: Snippet<[Group]>;

        sortOptions?: (a: Option, b: Option) => number;
        sortGroups?: (a: Group, b: Group) => number;
    };

    let {
        value = $bindable(undefined),

        menuClass,
        contentClass,
        name,
        id,
        disabled,
        readonly,

        options,
        groups,
        onSelect,
        triggerSnippet,
        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
    }: SelectProps = $props();

    let isOpen = $state(false);
    let error = $state(false);

    let parentElement: HTMLDivElement;

    // group options
    let groupedOptions = $derived(
        Object.entries(options).reduce<GroupedOptions<Option, Group>>(
            (acc, [optionKey, opt]) => {
                const groupKey = opt.group ?? "_ungrouped_";

                if (!acc[groupKey]) {
                    acc[groupKey] = {
                        options: {},
                        groupProps: groups?.[groupKey],
                    };
                }

                acc[groupKey].options[optionKey] = opt;
                return acc;
            },
            {},
        ),
    );

    function selectOption(key: string) {
        value = key;
        isOpen = false;
        error = false;
        if (onSelect) {
            onSelect(key);
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            toggleOpen(e);
        } else if (e.key === "Escape") {
            isOpen = false;
        }
    }

    function handleClick(
        event: MouseEvent & { currentTarget: EventTarget & Document },
    ) {
        if (!parentElement.contains(event.target as Node) && isOpen) {
            isOpen = false;
        }
    }

    function toggleOpen(event: Event) {
        event.stopPropagation();
        if (disabled || readonly) return;
        isOpen = !isOpen;
    }
</script>

<svelte:document onclick={handleClick} />
<div
    bind:this={parentElement}
    class="relative inline-flex"
    role="combobox"
    aria-controls="select-options"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-disabled={disabled}
    aria-readonly={readonly}
>
    <button
        type="button"
        onclick={toggleOpen}
        onkeydown={handleKeydown}
        disabled={disabled || readonly}
        aria-controls="select-options"
        aria-expanded={isOpen}
    >
        {@render triggerSnippet(
            value === undefined ? undefined : options[value],
            isOpen,
        )}
    </button>
    <Menu
        {menuClass}
        {contentClass}
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        noResultLabel={"No option"}
        isSelected={(val: string) => value === val}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
