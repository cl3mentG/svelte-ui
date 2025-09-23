<script
    lang="ts"
    generics="T extends { label: string; group?: string }, Options extends Record<string, T>"
>
    import { cn } from "../utils";
    import type { Snippet } from "svelte";
    import { Search, X } from "@lucide/svelte";
    import { common, focusable, multisearchFocused } from "../styles";

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
        value?: string[];
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
        value = $bindable([] as string[]),
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

    let isFocused = $state(false);
    let isOpen = $state(false);
    let search = $state("");
    let parentElement: HTMLDivElement;
    let childElement: HTMLDivElement;
    let inputElement: HTMLInputElement;
    let listboxId = "multisearch-listbox";

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

    function selectOption(optionKey: string) {
        if (!value.includes(optionKey)) {
            value = [...value, optionKey];
        }
        search = "";
        isOpen = false;
        inputElement.focus(); // keep input active for typing

        if (onSelect) {
            onSelect(optionKey);
        }
    }

    function removeOption(val: string | number, e?: MouseEvent) {
        e?.stopPropagation();
        value = value.filter((v) => v !== val);
        inputElement.focus();
    }

    function handleBlur(e: FocusEvent) {
        if (!parentElement.contains(e.relatedTarget as Node)) {
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
        {#each value as v}
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
                {...restProps}
            />
        </div>
    </div>
    <!-- groupedOptions -->
    {#if isOpen}
        {@const data = Object.entries(groupedOptions)}
        <div
            id={listboxId}
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
                        {@const isSelected = value.includes(optionValue)}
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
                                    selectOption(optionValue)}
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
