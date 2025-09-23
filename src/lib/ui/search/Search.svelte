<script
    lang="ts"
    generics="T extends { label: string; group?: string }, Options extends Record<string, T>"
>
    import { common, focusable, searchDefault } from "../styles";
    import { cn } from "../utils";
    import type { Snippet } from "svelte";
    import { Search, X } from "@lucide/svelte";

    type GroupedOptions = Record<
        string,
        {
            options: Record<string, T>;
            groupProps?: T;
        }
    >;

    type SearchSelectProps = {
        class?: string;
        noSearchIcon?: boolean;
        id?: string;
        name?: string;
        value?: string | number | null;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        noResultLabel?: string;
        options: Options;
        optionSnippet?: Snippet<[T, boolean]>;
        groupSnippet?: Snippet<[T]>;
        onSelect?: (value: string) => void;
        groups?: Options;
    };

    let {
        class: cls = "",
        noSearchIcon = false,
        value = null,
        disabled = false,
        readonly = false,
        placeholder = "Search",
        noResultLabel = "No results found.",
        options = {} as Options,
        optionSnippet,
        groupSnippet,
        groups,
        onSelect,
        ...restProps
    }: SearchSelectProps = $props();

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

    function selectOption(optionKey: string, optionData: T) {
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
        value = null;
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
            {...restProps}
        />
        {#if !noSearchIcon && value === null}
            <Search
                class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
        {:else if value !== null}
            <button
                class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onclick={resetValue}
            >
                <X class="w-full h-full" />
            </button>
        {/if}
    </div>

    {#if isOpen}
        {@const data = Object.entries(groupedOptions)}
        <div
            class="absolute left-0 top-full w-full max-h-60 rounded-md shadow-sm z-10 bg-white border-2 border-gray-300 overflow-hidden"
        >
            <ul role="listbox" class="max-h-60 overflow-auto rounded-md">
                {#if data.length == 0}
                    <li
                        class="px-3 py-1 text-gray-500 bg-white italic cursor-not-allowed"
                    >
                        {noResultLabel}
                    </li>
                {/if}
                {#each data as [groupKey, groupData] (groupKey)}
                    {#if groupKey !== "_ungrouped_" && groups != undefined}
                        {#if groupSnippet && groupData.groupProps}
                            <li
                                class="px-3 py-1 bg-white sticky top-0 cursor-not-allowed"
                            >
                                {@render groupSnippet(groupData.groupProps)}
                            </li>
                        {:else}
                            <li
                                class="px-3 py-1 text-gray-500 font-semibold bg-white text-xs italic sticky top-0 cursor-not-allowed"
                            >
                                {groupData.groupProps?.label}
                            </li>
                        {/if}
                    {/if}

                    {#each Object.entries(groupData.options) as [optionValue, optionData] (optionValue)}
                        {@const isSelected = value === optionValue}
                        <li role="option" aria-selected={isSelected}>
                            <button
                                type="button"
                                class={cn(
                                    "block w-full text-left px-6 py-1 hover:bg-gray-100 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer",
                                    isSelected &&
                                        optionSnippet == null &&
                                        "bg-gray-50 font-medium",
                                )}
                                onclick={() =>
                                    selectOption(optionValue, optionData)}
                            >
                                {#if optionSnippet == null}
                                    {optionData.label}
                                {:else}
                                    {@render optionSnippet(
                                        optionData,
                                        isSelected,
                                    )}
                                {/if}
                            </button>
                        </li>
                    {/each}
                {/each}
            </ul>
        </div>
    {/if}
</div>
