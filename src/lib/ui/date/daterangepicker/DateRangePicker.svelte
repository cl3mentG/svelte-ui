<script lang="ts">
    import { cn } from "../../utils";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import type { DateRange, DaterangepickerProps, DayRangeStatus } from "./types";

    let {
        isSelectable,
        locale = navigator.language,
        menuClass,
        triggerSnippet,
        dayCellSnippet,
    }: DaterangepickerProps = $props();

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
                isOpen = false;
            }
        }
    }
    
    // Close popup when clicking outside
    function handleClick(event: MouseEvent) {
        const target = event.target as Node;
        if (isOpen && parentEl && !parentEl.contains(target)) {
            isOpen = false;
        }
    }

    function getDayStatus(day: Date): DayRangeStatus {
        return {
            isInRange:
                range.start != null &&
                day.getTime() >= range.start.getTime() &&
                range.end != null &&
                day.getTime() <= range.end.getTime(),
            isStart:
                range.start != null && range.start.getTime() == day.getTime(),
            isEnd: range.end != null && range.end.getTime() == day.getTime(),
            isSelectable: isSelectable === undefined || isSelectable(day),
            isInMonth: day.getMonth() === currMonth,
        };
    }
</script>

<svelte:document onclick={handleClick} />

<div class="relative inline-flex items-center rounded-md" bind:this={parentEl}>
    <button onclick={() => (isOpen = !isOpen)}>
        {@render triggerSnippet(locale, range)}
    </button>

    {#if isOpen}
        <div
            class={cn(
                "flex flex-col absolute left-0 top-full z-10 overflow-hidden ",
                menuClass,
            )}
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
                    {#each week as day, dayIndex (dayIndex)}
                        {@const status = getDayStatus(day)}

                        <button
                            disabled={!status.isSelectable}
                            onclick={() => handleSelect(day)}
                        >
                            {@render dayCellSnippet(status, day)}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
