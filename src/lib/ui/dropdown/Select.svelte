<script lang="ts" generics="Option extends BaseOption, Group extends BaseGroup">
    import { common, focusable, selectDefault } from "../styles";
    import { ChevronDown, ChevronUp, Option } from "@lucide/svelte";
    import { cn } from "../utils";
    import type {
        BaseOption,
        BaseGroup,
        GroupedOptions,
        CommonDropdownProps,
    } from "./types";
    import type { CommonControlProps } from "../types";
    import Menu from "./Menu.svelte";

    // Use them as constraints *inside* the file
    type _CheckOption<T extends BaseOption> = T;
    type _CheckGroup<T extends BaseGroup> = T;

    type SelectProps = CommonControlProps &
        CommonDropdownProps<Option, Group> & {
            value?: string;
        };

    let {
        value = $bindable(undefined),

        class: cls,
        name,
        id,
        disabled,
        readonly,

        placeholder = "Select an option",
        options,
        groups,
        onSelect,
        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
    }: SelectProps = $props();

    let isOpen = $state(false);
    let error = $state(false);

    let mergedClasses = $derived(cn(common, focusable, selectDefault, cls));
    let selectElement: HTMLDivElement;

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

    function toggleOpen() {
        if (disabled || readonly) return;
        isOpen = !isOpen;
    }

    function selectOption(key: string) {
        value = key;
        isOpen = false;
        error = false;
        if (onSelect) {
            onSelect(key);
        }
    }

    function handleBlur(e: FocusEvent) {
        if (!selectElement.contains(e.relatedTarget as Node)) {
            isOpen = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            toggleOpen();
        } else if (e.key === "Escape") {
            isOpen = false;
        }
    }
</script>

<div
    bind:this={selectElement}
    class={cn("relative inline-flex items-center w-60 rounded-md", cls)}
    role="combobox"
    aria-controls="select-options"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-disabled={disabled}
    aria-readonly={readonly}
    onfocusout={handleBlur}
>
    <button
        type="button"
        class={cn(
            mergedClasses,
            "pr-8 w-full rounded-md text-left flex items-center cursor-pointer relative",
            error && "border-red-500 focus:ring-red-500",
        )}
        onclick={toggleOpen}
        onkeydown={handleKeydown}
        disabled={disabled || readonly}
        aria-controls="select-options"
        aria-expanded={isOpen}
    >
        <span
            class={cn(
                value === "" ? "text-gray-400" : "",
                "block overflow-hidden text-ellipsis whitespace-nowrap",
            )}
        >
            {value ? options[value].label : placeholder}
        </span>
        <span
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
            {#if isOpen}
                <ChevronUp class="shrink-0" />
            {:else}
                <ChevronDown class="shrink-0" />
            {/if}
        </span>
    </button>
    <Menu
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        noResultLabel={"No option"}
        isSelected={(val: string) => value === val}
        {placeholder}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
