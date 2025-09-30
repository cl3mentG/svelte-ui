<script lang="ts">
    import { SvelteDate } from "svelte/reactivity";
    import { cn } from "../../utils";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import type { DatepickerProps, DayStatus } from "./types";

    let {
        value = $bindable(),
        isSelectable,
        menuClass,
        locale = navigator.language,
        triggerSnippet,
        dayCellSnippet,
    }: DatepickerProps = $props();

    let currYear = $state(
        value ? value.getFullYear() : new Date().getFullYear(),
    );
    let currMonth = $state(value ? value.getMonth() : new Date().getMonth());

    function getFirstWeekStart(year: number, month: number, weekStartsOn = 1) {
        const firstOfMonth = new Date(year, month, 1);
        const dayOfWeek = firstOfMonth.getDay();
        const diff = (dayOfWeek - weekStartsOn + 7) % 7;

        return new Date(year, month, 1 - diff);
    }

    function getLastWeekEnd(year: number, month: number, weekStartsOn = 1) {
        const lastOfMonth = new Date(year, month + 1, 0);
        const dayOfWeek = lastOfMonth.getDay();
        const weekEnd = (weekStartsOn + 6) % 7;
        const diff = (weekEnd - dayOfWeek + 7) % 7;

        return new Date(year, month + 1, 0 + diff);
    }

    function getDays(date: Date | SvelteDate | undefined) {
        if (date === undefined) {
            date = new Date();
        }

        const year = date.getFullYear();
        const month = date.getMonth();

        const start = getFirstWeekStart(year, month);
        const end = getLastWeekEnd(year, month);

        const days: Date[] = [];
        let d = new Date(start);
        while (d <= end) {
            days.push(new Date(d)); // clone
            d.setDate(d.getDate() + 1);
        }

        // chunk into weeks
        const weeks: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks;
    }

    function formatWeekDays(): string[] {
        const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
        const weekdays: string[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(daysBetween[0][0]);
            date.setDate(daysBetween[0][0].getDate() + i);
            weekdays.push(formatter.format(date));
        }

        return weekdays;
    }

    function formatDate(): string {
        if (value !== undefined) {
            const formatter = new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            return formatter.format(value);
        }
        return "";
    }

    function formatMonthYear(): string {
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
        daysBetween = getDays(new Date(currYear, currMonth, 1));
    }

    function nextMonth() {
        if (currMonth === 11) {
            currMonth = 0;
            currYear += 1;
        } else {
            currMonth += 1;
        }
        daysBetween = getDays(new Date(currYear, currMonth, 1));
    }

    let daysBetween = $derived(getDays(value));

    let isOpen = $state(false);

    function handleSelect(day: Date) {
        if (value === undefined || value.getTime() !== day.getTime()) {
            isOpen = false;
            value = new SvelteDate(day);
        } else {
            value = undefined;
        }
    }

    let parentEl: HTMLDivElement;

    function handleClick(
        event: MouseEvent & { currentTarget: EventTarget & Document },
    ) {
        if (isOpen && !parentEl.contains(event.target as Node)) {
            isOpen = false;
        }
    }

     function getDayStatus(day: Date): DayStatus {
        return {
            isSelected: value !== undefined && day.getTime() === value.getTime(),
            isSelectable: isSelectable === undefined || isSelectable(day),
            isInMonth: day.getMonth() === currMonth,
        };
    }
</script>

<svelte:document onclick={handleClick} />
<div
    class={"relative inline-flex items-center rounded-md"}
    bind:this={parentEl}
>
    <button onclick={() => (isOpen = !isOpen)}>
        {@render triggerSnippet(locale, value)}
    </button>

    {#if isOpen}
        <div
            class={cn(
                "flex flex-col absolute left-0 top-full z-10 overflow-hidden ",
                menuClass,
            )}
        >
            <div class="flex justify-between items-center space-x-4 px-2">
                <button onclick={prevMonth}>
                    <ChevronLeft />
                </button>
                <span>{formatMonthYear()}</span>
                <button onclick={nextMonth}>
                    <ChevronRight />
                </button>
            </div>
            <div class="inline-grid grid-cols-7">
                {#each formatWeekDays() as day}
                    <div class="px-1 py-2 text-center font-semibold">
                        {day}
                    </div>
                {/each}
            </div>

            {#each daysBetween as week, weekIndex (weekIndex)}
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
