<script lang="ts">
    import type { NumberInputProps } from "./types";

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
        required,
        buttonsSnippet,
        ...restProps
    }: NumberInputProps = $props();

    let valueAsString = $state(
        value === undefined
            ? ""
            : (value.toString().replace(".", decimalSeparator) ?? ""),
    );
    let error = $state(false);

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

        if (
            (value === undefined && required) ||
            (value !== undefined &&
                ((min !== undefined && min > value) ||
                    (max !== undefined && value > max)))
        ) {
            error = true;
        } else {
            error = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (disabled || readonly) return;

        // Block "-" if both min/max are >= 0
        if (
            e.key === "-" &&
            min !== undefined &&
            max !== undefined &&
            min >= 0 &&
            max >= 0
        ) {
            e.preventDefault();
            return;
        }

        // Block "+" if both min/max are <= 0
        if (
            e.key === "+" &&
            min !== undefined &&
            max !== undefined &&
            min <= 0 &&
            max <= 0
        ) {
            e.preventDefault();
            return;
        }

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

<div class="relative w-fit">
    <input
        bind:this={inputElement}
        value={valueAsString}
        oninput={(e) => handleInput(e.currentTarget.value)}
        onblur={handleBlur}
        onkeydown={handleKeydown}
        data-error={error || undefined}
        {min}
        {max}
        {step}
        {disabled}
        {readonly}
        {placeholder}
        class={cls}
        {...restProps}
    />

    {@render buttonsSnippet?.({
        functions: {
            startIncrement: startIncrement,
            stopIncrement: stopIncrement,
            startDecrement: startDecrement,
            stopDecrement: stopDecrement,
        },
        disabled: disabled,
        readonly: readonly,
    })}
</div>
