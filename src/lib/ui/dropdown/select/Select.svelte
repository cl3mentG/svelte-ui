<script lang="ts">
    import type { GroupedOptions } from "../types";
    import Menu from "../shared/Menu.svelte";
    import type { SelectProps } from "./types";

    let {
        value = $bindable(undefined),

        menuClass,
        contentClass,
        name,
        id,
        disabled,
        readonly,
        required,

        options,
        groups,
        onSelect,
        triggerSnippet,
        optionSnippet,
        groupSnippet,
        sortOptions,
        sortGroups,
    }: SelectProps = $props();

    let isOpen = $state(false);
    let error = $state(false);

    let parentElement: HTMLDivElement;

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

    function selectOption(key: string) {
        value = key;
        isOpen = false;
        error = false;
        if (onSelect) {
            onSelect(key);
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            toggleOpen(e);
        } else if (e.key === "Escape") {
            isOpen = false;
        }
    }

    function handleClick(
        event: MouseEvent & { currentTarget: EventTarget & Document },
    ) {
        if (!parentElement.contains(event.target as Node) && isOpen) {
            isOpen = false;
            if (value === undefined && required) {
                error = true;
            } else if (error === true)
            {
                error = false;
            }
        }
    }

    function toggleOpen(event: Event) {
        event.stopPropagation();
        if (disabled || readonly) return;
        isOpen = !isOpen;
    }

    function handleBlur(
        event: FocusEvent & { currentTarget: EventTarget & HTMLDivElement },
    ) {
        const next = event.relatedTarget as Node | null;
        if (next && !parentElement.contains(next)) {
            isOpen = false;
        }
    }
</script>

<svelte:document onclick={handleClick} />
<div
    bind:this={parentElement}
    class="relative inline-flex"
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
        onclick={toggleOpen}
        onkeydown={handleKeydown}
        disabled={disabled || readonly}
        aria-controls="select-options"
        aria-expanded={isOpen}
    >
        {@render triggerSnippet({
            selectedOption: value === undefined ? undefined : options[value],
            isOpen: isOpen,
            error: error,
        })}
    </button>
    <input hidden {name} {id} {value} />
    <Menu
        {menuClass}
        {contentClass}
        {options}
        {isOpen}
        {groupedOptions}
        {selectOption}
        isSelected={(val: string) => value === val}
        {groups}
        {optionSnippet}
        {groupSnippet}
        {sortOptions}
        {sortGroups}
    />
</div>
