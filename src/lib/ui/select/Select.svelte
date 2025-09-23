<script
    lang="ts"
    generics="Option extends {label: string, value: string | number}"
>
    import { twMerge } from "tailwind-merge";
    import { common, focusable, inputDefault, selectDefault } from "../styles";
    import { ChevronDown, ChevronUp } from "@lucide/svelte";
    import { cn } from "../utils";
    import type { Snippet } from "svelte";

    type SelectProps = {
        class?: string;
        id?: string;
        name?: string;
        value?: string | number;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        options: Option[];
        optionSnippet?: Snippet<[Option, boolean]>;
    };

    let {
        class: cls = "",
        value = $bindable(""),
        disabled = false,
        readonly = false,
        placeholder,
        options = [],
        optionSnippet,
        ...restProps
    }: SelectProps = $props();

    let isOpen = $state(false);
    let error = $state(false);

    let mergedClasses = $derived(cn(common, focusable, selectDefault, cls));
    let selectElement: HTMLDivElement;

    function toggleOpen() {
        if (disabled || readonly) return;
        isOpen = !isOpen;
    }

    function selectOption(option: Option) {
        value = option.value;
        isOpen = false;
        error = false;
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
            {value === ""
                ? placeholder
                : options.find((o) => o.value === value)?.label}
        </span>
        <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
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
            <!-- Inner scrollable container -->
            <div class="max-h-60 overflow-auto">
                <ul id="select-options" role="listbox" class="rounded-md">
                    {#each options as option}
                        <li
                            id={`option-${option.value}`}
                            role="option"
                            aria-selected={value === option.value}
                        >
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
        </div>
    {/if}
</div>
