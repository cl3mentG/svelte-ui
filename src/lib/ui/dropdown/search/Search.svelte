<script lang="ts" generics="Option extends BaseOption, Group extends BaseGroup">
    import { cn } from "../../utils";
    import Menu from "../shared/Menu.svelte";
    import type {
        BaseOption,
        BaseGroup,
        GroupedOptions,
        CommonDropdownProps,
    } from "../types";
    import type { CommonControlProps } from "../../types";
    import type { Snippet } from "svelte";

    type SearchSelectProps = CommonControlProps &
        CommonDropdownProps<Option, Group> & {
            value?: string;
            noSearchIcon?: boolean;
            menuClass?: string;
            contentClass?: string;
            class?: string;
            triggerSnippet: Snippet<[string | undefined, () => void]>,
            placeholder?: string;
        };

    let {
        value = $bindable(undefined),

        name,
        id,
        placeholder,
        disabled,
        readonly,

        options,
        groups,

        class: cls,
        menuClass,
        contentClass,


        noResultLabel = "No results found.",
        onSelect,

        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
        triggerSnippet,
    }: SearchSelectProps = $props();

    let isOpen = $state(false);
    let search = $state("");
    let selectElement: HTMLDivElement;

    let groupedOptions = $derived(
        Object.entries(options).reduce<GroupedOptions<Option, Group>>(
            (acc, [optionKey, opt]) => {
                const groupKey = opt.group ?? "_ungrouped_";

                // if no search or search query not included
                if (
                    !opt.label
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase())
                ) {
                    return acc;
                }

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

    function selectOption(optionKey: string, optionData: Option) {
        value = optionKey;
        search = optionData.label;
        isOpen = false;

        if (onSelect) {
            onSelect(optionKey);
        }
    }

    function handleBlur(e: FocusEvent) {
        if (!selectElement.contains(e.relatedTarget as Node)) {
            isOpen = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Escape") {
            isOpen = false;
        }
    }

    function resetValue() {
        search = "";
        value = undefined;
    }

</script>

<div
    bind:this={selectElement}
    class="relative inline-flex flex-col"
    onfocusout={handleBlur}
>
    <div class="relative inline-block">
        <input
            class={cn("focus:outline-none w-full", cls)}
            bind:value={search}
            onfocus={() => (isOpen = true)}
            onkeydown={handleKeydown}
            disabled={disabled || readonly}
            {placeholder}
        />
        
        {@render triggerSnippet(value, resetValue)}
    </div>

    <Menu
        {menuClass}
        {contentClass}
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        {noResultLabel}
        isSelected={(val: string) => value === val}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
