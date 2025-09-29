<script lang="ts">
    import { cn } from "../../utils";
    import Menu from "../shared/Menu.svelte";
    import type { GroupedOptions, Option } from "../types";
    import type { Snippet } from "svelte";
    import type { SearchProps } from "./types";

    let {
        value = $bindable(undefined),

        name,
        id,
        placeholder,
        disabled,
        readonly,

        options,
        groups,

        inputClass,
        menuClass,
        contentClass,

        onSelect,
        noResultSnippet,

        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
        triggerSnippet,
    }: SearchProps = $props();

    let isOpen = $state(false);
    let search = $state("");
    let selectElement: HTMLDivElement;

    let groupedOptions = $derived(
        Object.entries(options).reduce<GroupedOptions>(
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
            class={cn("focus:outline-none w-full", inputClass)}
            bind:value={search}
            onfocus={() => (isOpen = true)}
            onkeydown={handleKeydown}
            disabled={disabled || readonly}
            {placeholder}
        />

        {@render triggerSnippet(
            value === undefined ? undefined : options[value],
            resetValue,
        )}
    </div>

    <Menu
        {menuClass}
        {contentClass}
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        {noResultSnippet}
        isSelected={(val: string) => value === val}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
