<script lang="ts">
    import { SvelteDate } from "svelte/reactivity";
    import { cn } from "../utils";
    import { common, focusable } from "../styles";
    import { Calendar, ChevronLeft, ChevronRight } from "@lucide/svelte";

    type DatePickerProps = {
        placeholder?: string;
        isSelectable?: (date: Date) => boolean;
        minDate?: Date;
        maxDate?: Date;
    };

    type DateRange = { start: Date | null; end: Date | null };

    let {
        placeholder = "Select a date",
        isSelectable,
        minDate,
        maxDate,
    }: DatePickerProps = $props();

    // Current month/year state
    let currYear = $state(new Date().getFullYear());
    let currMonth = $state(new Date().getMonth());

    // Selected range
    let range: DateRange = $state({ start: null, end: null });

    let isOpen = $state(false);
    let parentEl: HTMLDivElement;

    // Utility to get first day of first week
    function getFirstWeekStart(year: number, month: number, weekStartsOn = 1) {
        const firstOfMonth = new Date(year, month, 1);
        const dayOfWeek = firstOfMonth.getDay();
        const diff = (dayOfWeek - weekStartsOn + 7) % 7;
        return new Date(year, month, 1 - diff);
    }

    // Utility to get last day of last week
    function getLastWeekEnd(year: number, month: number, weekStartsOn = 1) {
        const lastOfMonth = new Date(year, month + 1, 0);
        const dayOfWeek = lastOfMonth.getDay();
        const weekEnd = (weekStartsOn + 6) % 7;
        const diff = (weekEnd - dayOfWeek + 7) % 7;
        return new Date(year, month + 1, 0 + diff);
    }

    // Generate grid of weeks
    function getDays(year: number, month: number) {
        const start = getFirstWeekStart(year, month);
        const end = getLastWeekEnd(year, month);

        const days: Date[] = [];
        let d = new Date(start);
        while (d <= end) {
            days.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }

        // Chunk into weeks
        const weeks: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    }

    let daysBetween = $derived(getDays(currYear, currMonth));

    // Localized weekday labels
    function formatWeekDays(locale = navigator.language): string[] {
        if (!daysBetween[0]) return [];
        const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
        const weekdays: string[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(daysBetween[0][0]);
            date.setDate(daysBetween[0][0].getDate() + i);
            weekdays.push(formatter.format(date));
        }
        return weekdays;
    }

    function formatMonthYear(locale = navigator.language): string {
        const formatter = new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
        });
        return formatter.format(new Date(currYear, currMonth, 1));
    }

    function prevMonth() {
        if (currMonth === 0) {
            currMonth = 11;
            currYear -= 1;
        } else {
            currMonth -= 1;
        }
    }

    function nextMonth() {
        if (currMonth === 11) {
            currMonth = 0;
            currYear += 1;
        } else {
            currMonth += 1;
        }
    }

    // Handle selection
    function handleSelect(day: Date) {
        if (!range.start || (range.start && range.end)) {
            range = { start: day, end: null };
        } else if (range.start && !range.end) {
            if (day.getTime() < range.start.getTime()) {
                range = { start: day, end: range.start };
            } else {
                range.end = day;
            }
        }
    }

    // Check if day is in selected range
    function isInRange(day: Date) {
        if (!range.start) return false;
        if (!range.end) return range.start.getTime() === day.getTime();
        return day >= range.start && day <= range.end;
    }

    // Disable out-of-range or not-selectable dates
    function isDisabled(day: Date) {
        if (minDate && day < minDate) return true;
        if (maxDate && day > maxDate) return true;
        if (isSelectable && !isSelectable(day)) return true;
        return false;
    }

    // Close popup when clicking outside
    function handleClick(event: MouseEvent) {
        const target = event.target as Node;
        if (isOpen && parentEl && !parentEl.contains(target)) {
            isOpen = false;
        }
    }
</script>

<svelte:document onclick={handleClick} />

<div class="relative inline-flex items-center rounded-md" bind:this={parentEl}>
    <button
        class={cn(
            common,
            focusable,
            "py-2 px-2 flex items-center space-x-2 cursor-pointer",
        )}
        onclick={() => (isOpen = !isOpen)}
    >
        <Calendar class="w-5 h-5 text-gray-400" />
        <span class={cn(!range.start && "text-gray-400")}>
            {#if range.start && range.end}
                {range.start.toLocaleDateString()} – {range.end.toLocaleDateString()}
            {:else if range.start}
                {range.start.toLocaleDateString()}
            {:else}
                {placeholder}
            {/if}
        </span>
    </button>

    {#if isOpen}
        <div
            class="flex flex-col absolute left-0 top-full rounded-md shadow-sm z-10 bg-white border-2 border-gray-300 overflow-hidden p-2 w-max"
        >
            <!-- Month Navigation -->
            <div class="flex justify-between items-center px-2 py-1">
                <button onclick={prevMonth}><ChevronLeft /></button>
                <span>{formatMonthYear()}</span>
                <button onclick={nextMonth}><ChevronRight /></button>
            </div>

            <!-- Weekday Labels -->
            <div class="inline-grid grid-cols-7">
                {#each formatWeekDays() as day}
                    <div class="px-1 py-2 text-center font-semibold">{day}</div>
                {/each}
            </div>

            <!-- Calendar Days -->
            {#each daysBetween as week}
                <div class="inline-grid grid-cols-7">
                    {#each week as day}
                        <button
                            class={cn(
                                "px-2 py-2 text-center rounded",
                                day.getMonth() !== currMonth && "text-gray-400",
                                isInRange(day) && "bg-blue-200",
                                isDisabled(day) &&
                                    "cursor-not-allowed opacity-50",
                            )}
                            disabled={isDisabled(day)}
                            onclick={() => handleSelect(day)}
                        >
                            {day.getDate()}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
