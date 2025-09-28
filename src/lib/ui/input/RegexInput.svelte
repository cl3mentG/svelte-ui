<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    type InputProps = HTMLInputAttributes & {
        class?: string;
        validRegex: RegExp;
        completionRegex?: RegExp;
        value?: string;
    };

    let {
        class: cls,
        value = $bindable(),
        validRegex,
        completionRegex,
        ...restProps
    }: InputProps = $props();

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
        if (inputValue !== "" && !validRegex.test(inputValue)) {
            error = true;
        } else if (error) {
            error = false;
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
