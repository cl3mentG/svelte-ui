<script
    lang="ts"
    generics="T extends { label: string; group?: string }, Options extends Record<string, T>"
>
    import { common, focusable, selectDefault } from "../styles";
    import { ChevronDown, ChevronUp } from "@lucide/svelte";
    import { cn } from "../utils";
    import type { Snippet } from "svelte";

    type GroupedOptions = Record<
        string,
        {
            options: Record<string, T>;
            groupProps?: T;
        }
    >;

    type SelectProps = {
        class?: string;
        id?: string;
        name?: string;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        options: Options;
        optionSnippet?: Snippet<[T, boolean]>;
        groupSnippet?: Snippet<[T]>;
        onSelect?: (value: string) => void;
        groups?: Options;
    };

    let {
        class: cls = "",
        value = $bindable(""),
        disabled = false,
        readonly = false,
        placeholder,
        options = {} as Options,
        optionSnippet,
        groupSnippet,
        groups,
        onSelect,
        ...restProps
    }: SelectProps = $props();

    let isOpen = $state(false);
    let error = $state(false);

    let mergedClasses = $derived(cn(common, focusable, selectDefault, cls));
    let selectElement: HTMLDivElement;

    // group options
    let groupedOptions = $derived(
        Object.entries(options).reduce<GroupedOptions>(
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
            {value === "" ? placeholder : options[value].label}
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

    {#if isOpen}
        <div
            class="absolute left-0 top-full w-full max-h-60 rounded-md shadow-sm z-10 bg-white border-2 border-gray-300 overflow-hidden"
        >
            <div class="max-h-60 overflow-auto">
                <ul id="select-options" role="listbox" class="rounded-md">
                    {#each Object.entries(groupedOptions) as [groupKey, groupData] (groupKey)}
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
                            <li
                                id={`option-${optionValue}`}
                                role="option"
                                aria-selected={value === optionValue}
                            >
                                <button
                                    type="button"
                                    class={cn(
                                        "block w-full text-left px-6 py-1 hover:bg-gray-100 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer",
                                        value === optionValue &&
                                            optionSnippet == null &&
                                            "bg-gray-50 font-medium",
                                    )}
                                    onclick={() => selectOption(optionValue)}
                                >
                                    {#if optionSnippet == null}
                                        {optionData.label}
                                    {:else}
                                        {@render optionSnippet(
                                            optionData,
                                            value === optionValue,
                                        )}
                                    {/if}
                                </button>
                            </li>
                        {/each}
                    {/each}
                </ul>
            </div>
        </div>
    {/if}
</div>
