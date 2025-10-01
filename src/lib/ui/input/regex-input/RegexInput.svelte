<script lang="ts">
    import type { RegexInputProps } from "./types";

    let {
        class: cls,
        value = $bindable(undefined),
        validRegex,
        completionRegex,
        required,
        name,
        ...restProps
    }: RegexInputProps = $props();

    let inputValue = $derived(value);
    let error = $state(false);
    let inputElement: HTMLInputElement;

    function handleInput(val: string) {
        if (completionRegex && !completionRegex.test(val) && val !== "") {
            inputElement.value = inputValue ?? "";
        } else {
            inputValue = val;
        }
    }

    function handleBlur(
        event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement },
    ) {
        if (inputValue === "" || inputValue === undefined) {
            if (!required) {
                error = false;
            } else {
                error = true;
            }
        } else {
            if (validRegex.test(inputValue)) {
                error = false;
            } else {
                error = true;
            }
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            inputElement.blur();
        }
    }
</script>

<input
    bind:this={inputElement}
    {...restProps}
    class={cls}
    value={inputValue}
    data-error={error || undefined}
    oninput={(e) => handleInput(e.currentTarget.value)}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
/>
