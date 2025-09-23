<script
    lang="ts"
    generics="Option extends {label: string, value: string | number}"
>
    import { twMerge } from "tailwind-merge";
    import { common, focusable, inputDefault, searchDefault } from "../styles";
    import { cn } from "../utils";
    import type { Snippet } from "svelte";
    import { Search, X } from "@lucide/svelte";

    type SearchSelectProps = {
        class?: string;
        noSearchIcon?: boolean;
        id?: string;
        name?: string;
        value?: string | number | null;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        options: Option[];
        optionSnippet?: Snippet<[Option, boolean]>;
    };

    let {
        class: cls = "",
        noSearchIcon = false,
        value = null,
        disabled = false,
        readonly = false,
        placeholder,
        options = [],
        optionSnippet,
        ...restProps
    }: SearchSelectProps = $props();

    let isOpen = $state(false);
    let search = $state("");
    let selectElement: HTMLDivElement;

    let filteredOptions = $derived(
        search
            ? options.filter((o) =>
                  o.label.toLowerCase().includes(search.toLowerCase()),
              )
            : options,
    );

    function selectOption(option: Option) {
        value = option.value;
        search = option.label;
        isOpen = false;
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

    function resetValue(e: MouseEvent)
    {
        search = "";
        value = null;
    }

    $effect(() => {
        const selected = options.find((o) => o.value === value);
        if (selected && !isOpen) {
            search = selected.label;
        }
    });

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
                (noSearchIcon && value === null) && "pl-4"
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

    {#if isOpen && filteredOptions.length > 0}
        <div
            class="absolute left-0 top-full w-full max-h-60 rounded-md shadow-sm z-10 bg-white border-2 border-gray-300 overflow-hidden"
        >
            <ul role="listbox" class="max-h-60 overflow-auto rounded-md">
                {#each filteredOptions as option}
                    <li role="option" aria-selected={value === option.value}>
                        <button
                            type="button"
                            class={cn(
                                "block w-full text-left px-3 py-1 hover:bg-gray-100 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer",
                                value === option.value &&
                                    optionSnippet == null &&
                                    "bg-gray-50 font-medium",
                            )}
                            onclick={() => selectOption(option)}
                        >
                            {#if optionSnippet == null}
                                {option.label}
                            {:else}
                                {@render optionSnippet(
                                    option,
                                    value === option.value,
                                )}
                            {/if}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
