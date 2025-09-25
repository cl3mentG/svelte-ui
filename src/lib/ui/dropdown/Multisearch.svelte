<script lang="ts" generics="Option extends BaseOption, Group extends BaseGroup">
    import { cn } from "../utils";
    import { X } from "@lucide/svelte";
    import { common, focusable, multisearchFocused } from "../styles";
    import type {
        BaseOption,
        BaseGroup,
        GroupedOptions,
        CommonDropdownProps,
    } from "./types";
    import type { CommonControlProps } from "../types";
    import Menu from "./Menu.svelte";

    type _CheckOption<T extends BaseOption> = T;
    type _CheckGroup<T extends BaseGroup> = T;

    type SearchSelectProps = CommonControlProps &
        CommonDropdownProps<Option, Group> & {
            value?: string[];
            noSearchIcon?: boolean;
            minCount?: number;
            maxCount?: number;
        };

    let {
        value = $bindable([]),

        minCount = 0,
        maxCount,

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

    let isFocused = $state(false);
    let isOpen = $state(false);
    let search = $state("");
    let parentElement: HTMLDivElement;
    let childElement: HTMLDivElement;
    let inputElement: HTMLInputElement;
    let listboxId = "multisearch-listbox";

    let error = $state(false);

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

    function selectOption(optionKey: string) {
        if (!value.includes(optionKey)) {
            value = [...value, optionKey];
        }
        search = "";
        isOpen = false;

        if (onSelect) {
            onSelect(optionKey);
        }

        if (maxCount === undefined || value.length < maxCount) {
            inputElement.focus(); // keep input active for typing
        }
    }

    function removeOption(val: string | number, e?: MouseEvent) {
        e?.stopPropagation();
        value = value.filter((v) => v !== val);
        inputElement.focus();
    }

    function handleBlur(e: FocusEvent) {
        if (!parentElement.contains(e.relatedTarget as Node)) {
            console.log(value.length, minCount, maxCount);
            if (value.length < minCount) {
                error = true;
            } else if (error) {
                error = false;
            }
            isOpen = false;
            isFocused = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Escape") {
            isOpen = false;
            isFocused = false;
        }
    }

    let mergedClasses = cn(common, cls);
</script>

<div
    bind:this={parentElement}
    class="relative inline-flex flex-col"
    onfocusout={handleBlur}
>
    <div
        bind:this={childElement}
        class={cn(
            mergedClasses,
            isFocused && multisearchFocused,
            "flex flex-wrap items-center gap-1 rounded-md cursor-text relative py-2 w-60",
            error && "border-red-500",
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        tabindex="0"
        onclick={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            if (!disabled && !readonly) {
                isOpen = true;
                inputElement.focus();
            }
        }}
        onkeydown={(e: KeyboardEvent) => {
            if (
                (e.key === "Enter" || e.key === " ") &&
                !disabled &&
                !readonly
            ) {
                isOpen = true;
                inputElement.focus();
            }
        }}
    >
        {#each value as v, index (v)}
            {@const opt = options[v]}
            <span
                class="flex items-center gap-1 bg-gray-100 text-gray-700 pl-2 pr-1 rounded-md"
            >
                {opt.label}
                <button
                    type="button"
                    class="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onclick={(e) => removeOption(v, e)}
                >
                    <X class="w-5 h-5" />
                </button>
            </span>
            {#if name !== undefined}
                <input hidden name={`${name}_${index}`} value={v} />
            {/if}
        {/each}

        <div class="flex items-center gap-2 flex-1 min-w-[80px] shrink">
            <input
                bind:this={inputElement}
                type="text"
                class="flex-1 min-w-0 focus:outline-none"
                {placeholder}
                bind:value={search}
                onfocus={() => {
                    isOpen = true;
                    isFocused = true;
                }}
                onkeydown={handleKeydown}
                disabled={disabled || readonly}
            />
        </div>
    </div>

    <Menu
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        {noResultLabel}
        {placeholder}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
        isSelected={(val: string) => value.includes(val)}
    />
</div>
