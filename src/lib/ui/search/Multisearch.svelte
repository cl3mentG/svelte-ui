<script
    lang="ts"
    generics="Option extends {label: string, value: string | number}"
>
    import { twMerge } from "tailwind-merge";
    import { cn } from "../utils";
    import type { Snippet } from "svelte";
    import { Search, X } from "@lucide/svelte";
    import { common, focusable, multisearchFocused } from "../styles";

    type SearchSelectProps = {
        class?: string;
        noSearchIcon?: boolean;
        id?: string;
        name?: string;
        value?: (string | number)[];
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        options: Option[];
        optionSnippet?: Snippet<[Option, boolean]>;
    };

    let {
        class: cls = "",
        noSearchIcon = false,
        value = $bindable([] as (string | number)[]),
        disabled = false,
        readonly = false,
        placeholder,
        options = [],
        optionSnippet,
        ...restProps
    }: SearchSelectProps = $props();

    let isFocused = $state(false);
    let isOpen = $state(false);
    let search = $state("");
    let parentElement: HTMLDivElement;
    let childElement: HTMLDivElement;
    let inputElement: HTMLInputElement;
    let listboxId = "multisearch-listbox";

    let filteredOptions = $derived(
        search
            ? options.filter(
                  (o) =>
                      o.label.toLowerCase().includes(search.toLowerCase()) &&
                      !value.includes(o.value),
              )
            : options.filter((o) => !value.includes(o.value)),
    );

    function selectOption(option: Option) {
        if (!value.includes(option.value)) {
            value = [...value, option.value];
        }
        search = "";
        isOpen = false;
        inputElement.focus(); // keep input active for typing
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

    let mergedClasses = twMerge(common, cls);
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
            {#if options.find((o) => o.value === v)}
                {@const opt = options.find((o) => o.value === v)!}
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
            {/if}
        {/each}

        <div class="flex items-center gap-2 flex-1 min-w-[80px] shrink">
            <input
                bind:this={inputElement}
                type="text"
                class="flex-1 min-w-0 focus:outline-none"
                {placeholder}
                bind:value={search}
                onfocus={() => {isOpen = true; isFocused = true;}}
                onkeydown={handleKeydown}
                disabled={disabled || readonly}
                {...restProps}
            />
        </div>
    </div>

    {#if isOpen && filteredOptions.length > 0}
        <div
            id={listboxId}
            class="absolute left-0 top-full w-full max-h-60 rounded-md shadow-sm z-10 bg-white border-2 border-gray-300 overflow-hidden"
        >
            <ul role="listbox" class="max-h-60 overflow-auto rounded-md">
                {#each filteredOptions as option}
                    <li
                        role="option"
                        aria-selected={value.includes(option.value)}
                    >
                        <button
                            type="button"
                            class={cn(
                                "block w-full text-left px-3 py-1 hover:bg-gray-100 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer",
                                value.includes(option.value) &&
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
                                    value.includes(option.value),
                                )}
                            {/if}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
