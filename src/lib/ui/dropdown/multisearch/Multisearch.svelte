<script lang="ts">
    import { cn } from "../../utils";
    import type { GroupedOptions } from "../types";
    import Menu from "../shared/Menu.svelte";
    import type { MultisearchProps } from "./types";
    import type { HTMLInputAttributes } from "svelte/elements";

    let {
        value = $bindable([]),

        minCount = 0,
        maxCount,

        contentClass,
        menuClass,
        name,
        id,
        disabled,
        readonly,

        options,
        groups,

        onSelect,
        noResultSnippet,
        triggerSnippet,
        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
        selectedOptionSnippet,
    }: MultisearchProps = $props();

    let isFocused = $state(false);
    let isOpen = $state(false);
    let search = $state("");
    let parentElement: HTMLDivElement;
    let childElement: HTMLDivElement;
    let inputElement: HTMLInputElement;
    let listboxId = "multisearch-listbox";

    let error = $state(false);

    let groupedOptions = $derived(
        Object.entries(options).reduce<GroupedOptions>(
            (acc, [optionKey, opt]) => {
                const groupKey = opt.group ?? "_ungrouped_";

                // 1. Skip options already selected
                if (value.includes(optionKey)) {
                    return acc;
                }

                // 2. Skip if it doesn’t match the search
                if (
                    !opt.label
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase())
                ) {
                    return acc;
                }

                // 3. Create group if missing
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
            inputElement.focus();
        }
    }

    function removeOption(val: string, e?: MouseEvent) {
        e?.stopPropagation();
        value = value.filter((v) => v !== val);
        validateCount();
        inputElement.focus();
    }

    function validateCount() {
        if (
            (minCount !== undefined && value.length < minCount) ||
            (maxCount !== undefined && value.length > maxCount)
        ) {
            error = true;
        } else {
            error = false;
        }
    }

    function handleBlur(e: FocusEvent) {
        if (!parentElement.contains(e.relatedTarget as Node)) {
            validateCount();
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
</script>

{#snippet selectedOptionsSnippet()}
    {#each value as v, index (v)}
        {@const opt = options[v]}
        {@render selectedOptionSnippet(options[v], () => removeOption(v))}

        {#if name !== undefined}
            <input hidden name={`${name}_${index}`} value={v} />
        {/if}
    {/each}
{/snippet}

{#snippet input({
    class: cls,
    ...restProps
}: Partial<HTMLInputAttributes> & { class?: string })}
    <input
        bind:this={inputElement}
        type="text"
        bind:value={search}
        onfocus={() => {
            isOpen = true;
            isFocused = true;
        }}
        onkeydown={handleKeydown}
        disabled={disabled || readonly}
        {...restProps}
        class={cn("outline-none", cls)}
    />
{/snippet}
<div
    bind:this={parentElement}
    class="relative inline-flex flex-col"
    onfocusout={handleBlur}
>
    <div
        bind:this={childElement}
        data-error={error || undefined}
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
        {@render triggerSnippet({
            selectedOptionsSnippet: selectedOptionsSnippet,
            isOpen: isOpen,
            error: error,
            input: input,
            focusInput: () => {
                isOpen = true;
                inputElement.focus();
            },
            resetOptions: () => (value = []),
        })}
    </div>

    <Menu
        {menuClass}
        {contentClass}
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        {noResultSnippet}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
        isSelected={(val: string) => value.includes(val)}
    />
</div>
