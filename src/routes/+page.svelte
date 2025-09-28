<script lang="ts">
    import { NumberInput, RegexInput } from "$lib/ui/input";
    import { Select, Search, Multisearch } from "$lib/ui/dropdown";
    import { VerificationCode } from "$lib/ui/verification-code";
    import { ToolTip } from "$lib/ui/tooltip";
    import { ContextMenu } from "$lib/ui/context-menu";
    import { DatePicker, DateRangePicker } from "$lib/ui/date";
    import ColorPicker from "$lib/ui/color-picker/ColorPicker.svelte";
    import { cn } from "$lib/ui/utils";
    import {
        ChevronDown,
        ChevronUp,
        X,
        Search as SearchIcon,
        Calendar,
    } from "@lucide/svelte";
    import { SvelteDate } from "svelte/reactivity";
</script>

<NumberInput
    decimalSeparator=","
    max={60}
    min={3}
    step={0.1}
    placeholder="Number between -3 and 3"
    class="w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 error:border-red-500"
/>

<RegexInput
    validRegex={/^hello$/}
    completionRegex={/^h(e(l(l(o)?)?)?)?$/}
    placeholder="Enter 'hello'"
    class="w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 error:border-red-500"
/>

<Select
    menuClass="rounded bg-white border-2 border-gray-300 shadow-md"
    contentClass="max-h-60"
    options={{
        "1": { label: "Pancakes", group: "1" },
        "2": { label: "Crêpes", group: "1" },
        "3": { label: "Tiramisu", group: "1" },
        "4": { label: "Burger", group: "2" },
        "5": { label: "French fries", group: "2" },
        "6": { label: "Soup", group: "2" },
        "7": { label: "Ice cream", group: "1" },
        "8": { label: "Mojito", group: "3" },
        "9": { label: "Coke", group: "3" },
        "10": { label: "Water", group: "3" },
    }}
    groups={{
        "1": { label: "Desserts" },
        "2": { label: "Main courses" },
        "3": { label: "Drinks" },
    }}
    onSelect={(selectedId: string) => {
        console.log(selectedId);
    }}
>
    {#snippet triggerSnippet(option, isOpen)}
        <div
            class="flex items-center justify-between w-128 rounded border-2 border-gray-300 px-4 py-2"
        >
            <span
                class={cn(
                    option === undefined ? "text-gray-400" : "",
                    "block overflow-hidden text-ellipsis whitespace-nowrap",
                )}
            >
                {option === undefined ? "Select an option" : option.label}
            </span>
            <span class="text-gray-400">
                {#if isOpen}
                    <ChevronUp class="shrink-0" />
                {:else}
                    <ChevronDown class="shrink-0" />
                {/if}
            </span>
        </div>
    {/snippet}
    {#snippet groupSnippet(group)}
        <div class="text-sm italic px-2">{group.label}</div>
    {/snippet}
    {#snippet optionSnippet(opt)}
        <div class="px-5">{opt.label}</div>
    {/snippet}
</Select>

<Search
    class="w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 pl-9 error:border-red-500"
    menuClass="rounded bg-white border-2 border-gray-300 shadow-md"
    contentClass="max-h-60"
    noResultLabel="No results found."
    placeholder="Choose an option"
    options={{
        "1": { label: "Pancakes", group: "1" },
        "2": { label: "Crêpes", group: "1" },
        "3": { label: "Tiramisu", group: "1" },
        "4": { label: "Burger", group: "2" },
        "5": { label: "French fries", group: "2" },
        "6": { label: "Soup", group: "2" },
        "7": { label: "Ice cream", group: "1" },
        "8": { label: "Mojito", group: "3" },
        "9": { label: "Coke", group: "3" },
        "10": { label: "Water", group: "3" },
    }}
    groups={{
        "1": { label: "Desserts" },
        "2": { label: "Main courses" },
        "3": { label: "Drinks" },
    }}
>
    {#snippet groupSnippet(group)}
        <div class="text-sm italic px-2">{group.label}</div>
    {/snippet}
    {#snippet optionSnippet(opt)}
        <div class="px-5">{opt.label}</div>
    {/snippet}
    {#snippet triggerSnippet(value, resetValue)}
        {#if value === undefined}
            <SearchIcon
                class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
        {:else if value !== undefined}
            <button
                class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onclick={resetValue}
            >
                <X class="w-full h-full" />
            </button>
        {/if}
    {/snippet}
</Search>

<Multisearch
    triggerClass="w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 pl-4 error:border-red-500"
    menuClass="rounded bg-white border-2 border-gray-300 shadow-md"
    contentClass="max-h-60"
    placeholder="Search"
    name="test"
    noResultLabel="No results found."
    minCount={3}
    options={{
        "1": { label: "Pancakes", group: "1" },
        "2": { label: "Crêpes", group: "1" },
        "3": { label: "Tiramisu", group: "1" },
        "4": { label: "Burger", group: "2" },
        "5": { label: "French fries", group: "2" },
        "6": { label: "Soup", group: "2" },
        "7": { label: "Ice cream", group: "1" },
        "8": { label: "Mojito", group: "3" },
        "9": { label: "Coke", group: "3" },
        "10": { label: "Water", group: "3" },
    }}
    groups={{
        "1": { label: "Desserts" },
        "2": { label: "Main courses" },
        "3": { label: "Drinks" },
    }}
>
    {#snippet groupSnippet(group)}
        <div class="text-sm italic px-2">{group.label}</div>
    {/snippet}
    {#snippet optionSnippet(opt)}
        <div class="px-5">{opt.label}</div>
    {/snippet}
    {#snippet selectedOptionSnippet(value, details, removeOption)}
        <span
            class="flex items-center gap-1 bg-gray-100 text-gray-700 pl-2 pr-1 rounded-md"
        >
            {details.label}
            <button
                type="button"
                class="text-gray-500 hover:text-gray-700 cursor-pointer"
                onclick={(e) => removeOption(value, e)}
            >
                <X class="w-5 h-5" />
            </button>
        </span>
    {/snippet}
</Multisearch>

<VerificationCode length={4} onCompletion={(code) => console.log(code)} />

{#snippet popupSnippet()}
    <div class="text-center">HELLO</div>
{/snippet}

<ToolTip {popupSnippet}>
    <button>Tooltip TEST</button>
</ToolTip>

<ContextMenu
    items={[{ test: "ra" }]}
    class="bg-white border-2 border-gray-300 w-48 rounded p-1"
>
    <div>This is a div with text and it has a context menu</div>
    {#snippet itemSnippet(item)}
        <div class="text-left">
            {item.test}
        </div>
    {/snippet}
</ContextMenu>

<DatePicker
    menuClass="border-2 border-gray-300 rounded-md shadow-md p-2"
    isSelectable={(date) => date.getDate() % 2 == 0}
>
    {#snippet triggerSnippet(locale, value)}
        {@const formatter = new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}
        <div
            class="flex items-center space-x-4 w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 pl-4 error:border-red-500"
        >
            <Calendar class="w-5 h-5 text-gray-400" />
            <span class={value === undefined ? "text-gray-400" : undefined}>
                {value ? formatter.format(value) : "Select a date"}
            </span>
        </div>
    {/snippet}
    {#snippet dayCellSnippet(isInMonth, isSelectable, isSelected, day)}
        <div
            class={cn(
                "py-2 px-1",
                (!isInMonth || !isSelectable) && "text-gray-400",
                isSelected && "rounded-md bg-gray-400",
            )}
        >
            {day}
        </div>
    {/snippet}
</DatePicker>

<DateRangePicker
    menuClass="border-2 border-gray-300 rounded-md shadow-md p-2"
    isSelectable={(date) => date.getDate() % 2 == 0}
>
    {#snippet triggerSnippet(locale, range)}
        {@const formatter = new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}
        <div
            class="flex items-center space-x-4 w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 pl-4 error:border-red-500"
        >
            <Calendar class="w-5 h-5 text-gray-400" />
            <span class={cn(!range.start && "text-gray-400")}>
                {#if range.start && range.end}
                    {formatter.format(range.start)} – {formatter.format(range.end)}
                {:else if range.start}
                    {formatter.format(range.start)}
                {:else}
                    Select a date range
                {/if}
            </span>
        </div>
    {/snippet}
    {#snippet dayCellSnippet(status, day)}
        <div
            class={cn(
                "py-2 px-1",
                (!status.isInMonth || !status.isSelectable) && "text-gray-400",
                status.isInRange && "bg-gray-200",
                status.isStart && "rounded-l bg-gray-400",
                status.isEnd && "rounded-r bg-gray-400",
            )}
        >
            {day}
        </div>
    {/snippet}
</DateRangePicker>
<!-- <ColorPicker /> -->
