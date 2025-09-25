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
        decimalSeparator?: "." | ",";
    };

    let {
        class: cls = "",
        value = $bindable(),
        step = 1,
        disabled = false,
        readonly = false,
        min,
        max,
        placeholder,
        decimalSeparator = ".",
        ...restProps
    }: InputProps = $props();

    let valueAsString = $state(
        value === undefined
            ? ""
            : (value.toString().replace(".", decimalSeparator) ?? ""),
    );
    let error = $state(false);

    let mergedClasses = $derived(cn(common, focusable, inputDefault, cls));
    let inputElement: HTMLInputElement;

    function roundToStep(num: number) {
        const precision = step.toString().split(".")[1]?.length ?? 0;
        return parseFloat((Math.round(num / step) * step).toFixed(precision));
    }

    let incrementTimeout: ReturnType<typeof setTimeout> | null = null;
    let decrementTimeout: ReturnType<typeof setTimeout> | null = null;
    let incrementInterval: ReturnType<typeof setInterval> | null = null;
    let decrementInterval: ReturnType<typeof setInterval> | null = null;

    function formatWithSeparator(num: number): string {
        let str = num.toString();
        if (decimalSeparator === ",") {
            str = str.replace(".", ",");
        }
        return str;
    }

    function startIncrement(e: MouseEvent) {
        e.preventDefault();
        inputElement.focus();
        if (disabled || readonly) return;
        increment();
        incrementTimeout = setTimeout(() => {
            incrementInterval = setInterval(increment, 50);
        }, 400);
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
        inputElement.focus();
        if (disabled || readonly) return;
        decrement();
        decrementTimeout = setTimeout(() => {
            decrementInterval = setInterval(decrement, 50);
        }, 400);
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
        valueAsString = formatWithSeparator(newValue);
    }

    function decrement() {
        if (disabled || readonly) return;
        const currentValue = value ?? min ?? 0;
        const minValue = min ?? -Infinity;
        let newValue = roundToStep(currentValue - step);
        if (min !== undefined && newValue < minValue) newValue = minValue;
        value = newValue;
        valueAsString = formatWithSeparator(newValue);
    }

    // const completeRegex =
    //     /^[+-]?(?:\d+|\d{1,3}(?: \d{1,3})*)(?:[.](?:\d+)?)?(?:[eE][+-]?\d+)?$/;

    const incompleteRegex =
        /^[+-]?(?:\d+|\d{1,3}(?: \d{1,3})*)?(?:[.](?:\d*)?)?(?:[eE][+-]?\d*)?$/;

    function handleInput(newInputValue: string) {
        if (newInputValue == "") {
            value = undefined;
            return;
        }
        newInputValue = newInputValue.replace(",", ".");
        const numValue = parseFloat(newInputValue);

        // validate format with regex first
        if (!incompleteRegex.test(newInputValue)) {
            inputElement.value = valueAsString;
            return;
        }

        if (newInputValue == "-" || newInputValue == "+") {
            valueAsString = newInputValue;
        }

        if (
            !isNaN(numValue) &&
            ((0 <= numValue &&
                ((max !== undefined && numValue <= max) ||
                    (min !== undefined && numValue <= min))) ||
                (numValue <= 0 &&
                    ((max !== undefined && numValue >= max) ||
                        (min !== undefined && numValue >= min))))
        ) {
            valueAsString = newInputValue.replace(".", decimalSeparator);
            value = numValue;
        } else {
            inputElement.value = valueAsString;
        }
    }

    function handleBlur() {
        const lastChar = valueAsString.slice(-1);
        if (lastChar === "e" || lastChar === "." || lastChar === ",") {
            valueAsString = valueAsString.slice(0, -1);
            inputElement.value = valueAsString;
        }

        if (value !== undefined && ((min !== undefined && min > value) || ((max !== undefined && value > max))))
        {
            error = true;
        } else {
            error = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;
        if (e.key === "Enter") {
            inputElement.blur();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            increment();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            decrement();
        }
    }
</script>

<div class="relative inline-flex items-center w-60 rounded-md">
    <input
        bind:this={inputElement}
        value={valueAsString}
        oninput={(e) => handleInput(e.currentTarget.value)}
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
            error && "border-red-500",
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
