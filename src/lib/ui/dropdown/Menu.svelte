<script lang="ts" generics="Option extends BaseOption, Group extends BaseGroup">
    import type { BaseGroup, BaseOption, CommonDropdownProps, GroupedOptions } from "./types";
    import { cn } from "../utils";


type Props = CommonDropdownProps<Option, Group> & {
    isOpen: boolean;
    groupedOptions: GroupedOptions<Option, Group>;
    selectOption: (optionValue: string, optionData: Option) => void;
    isSelected: (value: string) => boolean;
    noResultLabel: string;
}

let props: Props = $props()

</script>

{#if props.isOpen}
    {@const data = Object.entries(props.groupedOptions)}
    <div
        class="absolute left-0 top-full w-full max-h-60 rounded-md shadow-sm z-10 bg-white border-2 border-gray-300 overflow-hidden"
    >
        <ul role="listbox" class="max-h-60 overflow-auto rounded-md">
            {#if data.length == 0}
                <li
                    class="px-3 py-1 text-gray-500 bg-white italic cursor-not-allowed"
                >
                    {props.noResultLabel}
                </li>
            {/if}
            {#each data as [groupKey, groupData] (groupKey)}
                {#if groupKey !== "_ungrouped_" && props.groups != undefined}
                    {#if props.groupSnippet && groupData.groupProps}
                        <li
                            class="px-3 py-1 bg-white sticky top-0 cursor-not-allowed"
                        >
                            {@render props.groupSnippet(groupData.groupProps)}
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
                    {@const isSelected = props.isSelected(optionValue)}
                    <li role="option" aria-selected={isSelected} class="p-1">
                        <button
                            type="button"
                            class={cn(
                                "block w-full text-left px-6 py-1 hover:bg-gray-100 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer",
                                isSelected &&
                                    props.optionSnippet == null &&
                                    "bg-gray-50 font-medium",
                            )}
                            onclick={() =>
                                props.selectOption(optionValue, optionData)}
                        >
                            {#if !props.optionSnippet}
                                {optionData.label}
                            {:else}
                                {@render props.optionSnippet(optionData, isSelected)}
                            {/if}
                        </button>
                    </li>
                {/each}
            {/each}
        </ul>
    </div>
{/if}
