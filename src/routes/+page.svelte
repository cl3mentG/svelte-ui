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
</script>

<NumberInput
    decimalSeparator=","
    max={60}
    min={3}
    step={0.1}
    required
    placeholder="Number between -3 and 3"
    class="w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 error:border-red-500"
>
    {#snippet buttonsSnippet(props)}
        <div
            class="absolute right-1 top-0 bottom-0 flex flex-col justify-between text-gray-400 space-y-0.5"
        >
            <button
                type="button"
                tabindex="-1"
                class="h-1/2 min-h-0 flex items-center justify-center cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
                onmousedown={props.functions.startIncrement}
                onmouseup={props.functions.stopIncrement}
                onmouseleave={props.functions.stopIncrement}
                disabled={props.disabled || props.readonly}
            >
                <ChevronUp class="h-full w-full min-w-5 min-h-5" />
            </button>
            <button
                type="button"
                tabindex="-1"
                class="h-1/2 min-h-0 flex items-center justify-center cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
                onmousedown={props.functions.startDecrement}
                onmouseup={props.functions.stopDecrement}
                onmouseleave={props.functions.stopDecrement}
                disabled={props.disabled || props.readonly}
            >
                <ChevronDown class="h-full w-full min-w-5 min-h-5" />
            </button>
        </div>
    {/snippet}
</NumberInput>

<RegexInput
    required
    validRegex={/^hello$/}
    completionRegex={/^h(e(l(l(o)?)?)?)?$/}
    placeholder="Enter 'hello'"
    class="w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 error:border-red-500"
/>

<Select
    required
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
>
    {#snippet triggerSnippet(props)}
        <div
            class={cn(
                "flex items-center justify-between w-128 rounded border-2 border-gray-300 px-4 py-2 transition duration-200 outline-none error:border-red-500",
                props.isOpen && "ring-2 ring-blue-500",
            )}
            data-error={props.error || undefined}
        >
            <span
                class={cn(
                    props.selectedOption === undefined ? "text-gray-400" : "",
                    "block overflow-hidden text-ellipsis whitespace-nowrap",
                )}
            >
                {props.selectedOption === undefined
                    ? "Select an option"
                    : (props.selectedOption.label ?? "Option selected")}
            </span>
            <span class="text-gray-400">
                {#if props.isOpen}
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
    required
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
>
    {#snippet noResultSnippet()}
        <div>No result</div>
    {/snippet}
    {#snippet groupSnippet(group)}
        <div class="text-sm italic px-2">{group.label}</div>
    {/snippet}
    {#snippet optionSnippet(opt)}
        <div class="px-5">{opt.label}</div>
    {/snippet}
    {#snippet triggerSnippet(props)}
        <div>
            <div class="absolute top-1/2 -translate-y-1/2 left-2 h-auto">
                {#if props.selectedOption === undefined}
                    <SearchIcon
                        class="pointer-events-none w-5 h-5 text-gray-400"
                    />
                {:else if props.selectedOption !== undefined}
                    <button
                        class="cursor-pointer w-5 h-5"
                        onclick={(e) => {
                            e.stopPropagation();
                            props.resetOption();
                        }}
                    >
                        <X class="w-full" />
                    </button>
                {/if}
            </div>
            {@render props.input({
                class: "w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 py-2 pl-9 error:border-red-500",
                placeholder: "Choose an option",
            })}
        </div>
    {/snippet}
</Search>

<Multisearch
    menuClass="rounded bg-white border-2 border-gray-300 shadow-md"
    contentClass="max-h-60"
    name="test"
    minCount={3}
    maxCount={4}
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
    {#snippet triggerSnippet(props)}
        <div
            class={cn(
                "w-128 flex flex-wrap items-center px-4 py-2 gap-1 border-2 border-gray-300 transition duration-200 rounded-md cursor-text relative error:border-red-500",
                props.isOpen && "ring-2 ring-blue-500",
            )}
            data-error={props.error || undefined}
            data-focus={props.isOpen || undefined}
        >
            {@render props.selectedOptionsSnippet()}
            <div class="flex items-center gap-2 flex-1 min-w-[80px] shrink">
                {@render props.input({ placeholder: "Search" })}
            </div>
        </div>
    {/snippet}

    {#snippet noResultSnippet()}
        <div>No result</div>
    {/snippet}
    {#snippet groupSnippet(group)}
        <div class="text-sm italic px-2">{group.label}</div>
    {/snippet}
    {#snippet optionSnippet(opt)}
        <div class="px-5">{opt.label}</div>
    {/snippet}

    {#snippet selectedOptionSnippet(details, removeOption)}
        <span
            class="flex items-center gap-1 bg-gray-100 text-gray-700 pl-2 pr-1 rounded-md"
        >
            {details.label}
            <button
                type="button"
                class="text-gray-500 hover:text-gray-700 cursor-pointer"
                onclick={(e) => removeOption()}
            >
                <X class="w-5 h-5" />
            </button>
        </span>
    {/snippet}
</Multisearch>

<VerificationCode
    length={4}
    onCompletion={(code) => console.log(code)}
    containerClass="flex items-center space-x-4"
    inputClass="rounded border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 w-16 h-16 text-center text-xl"
/>

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
    menuClass="border-2 border-gray-300 rounded-md shadow-md p-2 bg-white"
    isSelectable={(date) => date.getDate() % 2 == 0}
    required
>
    {#snippet triggerSnippet(props)}
        {@const formatter = new Intl.DateTimeFormat(props.locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}
        <div
            class={cn(
                "flex items-center space-x-4 w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none py-2 error:border-red-500",
                props.isOpen && "ring-2 ring-blue-500",
            )}
            data-error={props.error || undefined}
        >
            <Calendar class="w-5 h-5 text-gray-400" />
            <span
                class={props.value === undefined ? "text-gray-400" : undefined}
            >
                {props.value ? formatter.format(props.value) : "Select a date"}
            </span>
        </div>
    {/snippet}
    {#snippet dayCellSnippet(dayStatus, day)}
        <div
            class={cn(
                "py-2 px-1",
                (!dayStatus.isInMonth || !dayStatus.isSelectable) &&
                    "text-gray-400",
                dayStatus.isSelected && "rounded-md bg-gray-400",
            )}
        >
            {day.getDate()}
        </div>
    {/snippet}
</DatePicker>

<DateRangePicker
    menuClass="border-2 border-gray-300 rounded-md shadow-md p-2 bg-white"
    isSelectable={(date) => date.getDate() % 2 == 0}
    required
>
    {#snippet triggerSnippet(props)}
        {@const formatter = new Intl.DateTimeFormat(props.locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}
        <div
            class={cn(
                "flex items-center space-x-4 w-128 rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none py-2 pl-4 error:border-red-500",
                props.isOpen && "ring-2 ring-blue-500",
            )}
            data-error={props.error || undefined}
        >
            <Calendar class="w-5 h-5 text-gray-400" />
            <span class={cn(!props.value.start && "text-gray-400")}>
                {#if props.value.start && props.value.end}
                    {formatter.format(props.value.start)} – {formatter.format(
                        props.value.end,
                    )}
                {:else if props.value.start}
                    {formatter.format(props.value.start)}
                {:else}
                    Select a date range
                {/if}
            </span>
        </div>
    {/snippet}
    {#snippet dayCellSnippet(day, status)}
        <div
            class={cn(
                "py-2 px-1",
                (!status.isInMonth || !status.isSelectable) && "text-gray-400",
                status.isInRange && "bg-gray-200",
                status.isStart && "rounded-l bg-gray-400",
                status.isEnd && "rounded-r bg-gray-400",
            )}
        >
            {day.getDate()}
        </div>
    {/snippet}
</DateRangePicker>
<ColorPicker
    menuClass="rounded-md w-full shadow-lg bg-white border-2 border-gray-300 p-2 "
    inputClass="rounded-md border-2 border-gray-300 transition duration-200 outline-none focus:ring-2 focus:ring-blue-500"
>
    {#snippet triggerSnippet(props)}
        <div
            class={cn(
                "flex items-center w-60 justify-between rounded-md px-4 border-2 border-gray-300 transition duration-200 outline-none py-2",
                props.isOpen && "ring-2 ring-blue-500",
            )}
        >
            <div
                class="w-10 h-5 rounded"
                style="background-color: {props.color.hexWithAlpha}"
            ></div>
            <span>{props.color.hexWithAlpha}</span>
        </div>
    {/snippet}
</ColorPicker>
