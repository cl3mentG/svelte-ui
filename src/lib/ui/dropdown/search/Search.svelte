<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { cn } from "../../utils";
    import Menu from "../shared/Menu.svelte";
    import type { GroupedOptions, Option } from "../types";
    import type { SearchProps } from "./types";

    let {
        value = $bindable(undefined),

        name,
        id,
        disabled,
        readonly,
        required,

        options,
        groups,

        menuClass,
        contentClass,

        onSelect,
        noResultSnippet,

        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
        triggerSnippet,
    }: SearchProps = $props();

    let isOpen = $state(false);
    let error = $state(false);
    let search = $state("");
    let parentElement: HTMLDivElement;
    let inputElement: HTMLInputElement;

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

    function selectOption(optionKey: string, optionData: Option) {
        value = optionKey;
        search = optionData.label;
        isOpen = false;
        error = false;
        if (onSelect) {
            onSelect(optionKey);
        }
    }

    function handleBlur(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !parentElement.contains(next)) {
            if (value === undefined && required) {
                error = true;
            } else if (error) {
                error = false;
            }
            isOpen = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Escape") {
            isOpen = false;
        }
    }

    function resetValue() {
        search = "";
        value = undefined;
        if (onSelect) {
            onSelect(value);
        }

        if (required) {
            error = true;
        }
    }

    function handleInput(
        event: Event & { currentTarget: EventTarget & HTMLInputElement },
    ) {
        if (value !== undefined) {
            value = undefined;
            if (onSelect) {
                onSelect(value);
            }
        }
    }

    function handleClick(
        event: MouseEvent & { currentTarget: EventTarget & Document },
    ) {
        if (!parentElement.contains(event.target as Node) && isOpen) {
            if (value === undefined && required) {
                error = true;
            } else if (error) {
                error = false;
            }
            isOpen = false;
        }
    }
</script>

{#snippet triggerChildren({
    class: cls,
    ...restProps
}: Partial<HTMLInputAttributes> & { class?: string })}
    <input
        bind:this={inputElement}
        class={cn("focus:outline-none w-full", cls)}
        bind:value={search}
        onfocus={() => (isOpen = true)}
        onkeydown={handleKeydown}
        onfocusout={handleBlur}
        data-error={error || undefined}
        oninput={handleInput}
        disabled={disabled || readonly}
        {...restProps}
    />
{/snippet}

<svelte:document onclick={handleClick} />
<div
    bind:this={parentElement}
    class="relative inline-flex flex-col"
    onfocusout={handleBlur}
>
    {@render triggerSnippet({
        selectedOption: value === undefined ? undefined : options[value],
        input: triggerChildren,
        isOpen: isOpen,
        error: error,
        resetOption: resetValue,
        focusInput: () => inputElement.focus(),
    })}

    <input hidden {value} {name} />

    <Menu
        {menuClass}
        {contentClass}
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        {noResultSnippet}
        isSelected={(val: string) => value === val}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
