<script lang="ts">
    import { common, focusable, inputDefault } from "../styles";
    import { ChevronDown, ChevronUp } from "@lucide/svelte";
    import { cn } from "../utils";

    type InputProps = {
        class?: string;
        id?: string;
        name?: string;
        value?: number;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        min?: number;
        max?: number;
        step?: number;
    };

    let {
        class: cls = "",
        value = $bindable(0),
        step = 1,
        disabled = false,
        readonly = false,
        min,
        max,
        placeholder,
        ...restProps
    }: InputProps = $props();

    let valueAsString = $state(value === 0 ? "" : (value?.toString() ?? ""));
    let error = $state(false);

    let mergedClasses = $derived(cn(common, focusable, inputDefault, cls));
    let inputElement: HTMLInputElement;

    function roundToStep(num: number) {
        return Math.round(num / step) * step;
    }

    let incrementTimeout: ReturnType<typeof setTimeout> | null = null;
    let decrementTimeout: ReturnType<typeof setTimeout> | null = null;
    let incrementInterval: ReturnType<typeof setInterval> | null = null;
    let decrementInterval: ReturnType<typeof setInterval> | null = null;

    function startIncrement(e: MouseEvent) {
        e.preventDefault();
        if (disabled || readonly) return;
        increment();
        incrementTimeout = setTimeout(() => {
            incrementInterval = setInterval(increment, 50);
        }, 400); // delay before repetition
    }

    function stopIncrement() {
        if (incrementTimeout) {
            clearTimeout(incrementTimeout);
            incrementTimeout = null;
        }
        if (incrementInterval) {
            clearInterval(incrementInterval);
            incrementInterval = null;
        }
    }

    function startDecrement(e: MouseEvent) {
        e.preventDefault();
        if (disabled || readonly) return;
        decrement();
        decrementTimeout = setTimeout(() => {
            decrementInterval = setInterval(decrement, 50);
        }, 400); // delay before repetition
    }

    function stopDecrement() {
        if (decrementTimeout) {
            clearTimeout(decrementTimeout);
            decrementTimeout = null;
        }
        if (decrementInterval) {
            clearInterval(decrementInterval);
            decrementInterval = null;
        }
    }

    function increment() {
        if (disabled || readonly) return;
        const currentValue = value ?? min ?? 0;
        const maxValue = max ?? Infinity;
        let newValue = roundToStep(currentValue + step);
        if (max !== undefined && newValue > maxValue) newValue = maxValue;
        value = newValue;
        valueAsString = newValue.toString();
    }

    function decrement() {
        if (disabled || readonly) return;
        const currentValue = value ?? min ?? 0;
        const minValue = min ?? -Infinity;
        let newValue = roundToStep(currentValue - step);
        if (min !== undefined && newValue < minValue) newValue = minValue;
        value = newValue;
        valueAsString = newValue.toString();
    }

    function handleInput() {
        if (valueAsString === "0" && inputElement.selectionStart === 1) {
            valueAsString = "";
        }
        if (valueAsString === "") {
            value = 0;
            error = false;
            return;
        }
        const numValue = parseFloat(valueAsString);
        if (
            !isNaN(numValue) &&
            (max == null || numValue <= max) &&
            (min == null || numValue >= min)
        ) {
            const snapped = roundToStep(numValue);
            value = snapped;
            valueAsString = snapped.toString();
            if (error) error = false;
        } else {
            error = true;
        }
    }

    function handleBlur() {
        if (valueAsString === "") {
            value = 0;
        } else {
            const numValue = parseFloat(valueAsString);
            if (!isNaN(numValue)) {
                const snapped = roundToStep(numValue);
                value = snapped;
                valueAsString = snapped.toString();
            }
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            inputElement.blur();
        }
    }

    function handleButtonClick(
        e: MouseEvent,
        action: "increment" | "decrement",
    ) {
        e.preventDefault();
        inputElement.focus();
        action === "increment" ? increment() : decrement();
    }
</script>

<div class="relative inline-flex items-center w-60 rounded-md">
    <input
        bind:this={inputElement}
        bind:value={valueAsString}
        oninput={handleInput}
        onblur={handleBlur}
        onkeydown={handleKeydown}
        {min}
        {max}
        {step}
        {disabled}
        {readonly}
        {placeholder}
        class={cn(
            mergedClasses,
            "pr-10 w-full rounded-md placeholder-gray-400",
            error && "border-red-500 focus:ring-red-500",
        )}
    />

    <div
        class="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col space-y-0.5 text-gray-400"
    >
        <button
            type="button"
            tabindex="-1"
            class="flex items-center justify-center w-5 h-5 cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
            onmousedown={startIncrement}
            onmouseup={stopIncrement}
            onmouseleave={stopIncrement}
            disabled={disabled || readonly}
        >
            <ChevronUp />
        </button>
        <button
            type="button"
            tabindex="-1"
            class="flex items-center justify-center w-5 h-5 cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
            onmousedown={startDecrement}
            onmouseup={stopDecrement}
            onmouseleave={stopDecrement}
            disabled={disabled || readonly}
        >
            <ChevronDown />
        </button>
    </div>
</div>
