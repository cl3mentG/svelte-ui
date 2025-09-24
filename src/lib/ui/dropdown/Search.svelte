<script lang="ts" generics="Option extends BaseOption, Group extends BaseGroup">
    import { common, focusable, searchDefault } from "../styles";
    import { cn } from "../utils";
    import type { Snippet } from "svelte";
    import { Search, X } from "@lucide/svelte";
    import Menu from "./Menu.svelte";
    import type {
        BaseOption,
        BaseGroup,
        GroupedOptions,
        CommonDropdownProps,
    } from "./types";
    import type { CommonControlProps } from "../types";

    type _CheckOption<T extends BaseOption> = T;
    type _CheckGroup<T extends BaseGroup> = T;
        
    type SearchSelectProps = CommonControlProps &
        CommonDropdownProps<Option, Group> & {
            value?: string;
            noSearchIcon?: boolean;
        };
   

    let {
        value = $bindable(undefined),

        class: cls = "",
        name,
        id,
        disabled,
        readonly,

        placeholder = "Search",
        options,
        groups,

        noSearchIcon = false,

        noResultLabel = "No results found.",
        onSelect,

        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
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

    function resetValue(e: MouseEvent) {
        search = "";
        value = undefined;
    }

    let mergedClasses = cn(common, focusable, searchDefault, cls);
</script>

<div
    bind:this={selectElement}
    class={cn("relative inline-flex flex-col w-60", cls)}
    onfocusout={handleBlur}
>
    <div class="relative flex items-center w-full">
        <input
            type="text"
            class={cn(
                mergedClasses,
                "pr-8 pl-9 w-full rounded-md text-left flex items-center cursor-text text-ellipsis",
                noSearchIcon && value === null && "pl-4",
            )}
            {placeholder}
            bind:value={search}
            onfocus={() => (isOpen = true)}
            onkeydown={handleKeydown}
            disabled={disabled || readonly}
        />
        {#if !noSearchIcon && value === undefined}
            <Search
                class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
        {:else if value !== undefined}
            <button
                class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onclick={resetValue}
            >
                <X class="w-full h-full" />
            </button>
        {/if}
    </div>

    <Menu
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        {noResultLabel}
        isSelected={(val: string) => value === val}
        {placeholder}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
