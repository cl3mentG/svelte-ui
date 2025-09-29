<script
    lang="ts"
>
    import { cn } from "../../utils";
    import type { MenuProps } from "./types";

    let props: MenuProps = $props();
</script>

{#if props.isOpen}
    {@const data = Object.entries(props.groupedOptions)}

    <div
        class={cn(
            props.menuClass,
            "absolute left-0 top-full rounded-md overflow-hidden z-10 w-full",
        )}
    >
        <div class={cn(props.contentClass, "overflow-y-scroll")}>
            <ul role="listbox">
                {#if data.length == 0}
                    <li>
                        {@render props.noResultSnippet?.()}
                    </li>
                {/if}
                {#each data as [groupKey, groupData] (groupKey)}
                    {#if groupKey !== "_ungrouped_" && props.groups != undefined}
                        {#if props.groupSnippet && groupData.groupProps}
                            <li class="p-1">
                                {@render props.groupSnippet(
                                    groupData.groupProps,
                                )}
                            </li>
                        {:else}
                            <li class="p-1">
                                {groupData.groupProps?.label}
                            </li>
                        {/if}
                    {/if}

                    {#each Object.entries(groupData.options) as [optionValue, optionData] (optionValue)}
                        {@const isSelected = props.isSelected(optionValue)}
                        <li
                            role="option"
                            aria-selected={isSelected}
                            class="p-1"
                        >
                            <button
                                class="w-full text-left"
                                onclick={() =>
                                    props.selectOption(optionValue, optionData)}
                            >
                                {#if !props.optionSnippet}
                                    {optionData.label}
                                {:else}
                                    {@render props.optionSnippet(
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
    </div>
{/if}
