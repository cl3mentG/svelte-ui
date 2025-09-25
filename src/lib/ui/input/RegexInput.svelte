<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { common, focusable, inputDefault } from "../styles";
    import { cn } from "../utils";

    type InputProps = Omit<HTMLInputAttributes, "class"> & {
        class?: string;
        validRegex: RegExp;
        completionRegex?: RegExp;
        value?: string;
        onEnter?: (val: string) => void; // new prop for enter handling
    };

    let {
        class: cls = "",
        value = $bindable(),
        validRegex,
        completionRegex,
        onEnter,
        ...others
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
    {...others}
    class={cn(common, focusable, inputDefault, cls, error && "border-red-500")}
    value={inputValue}
    oninput={(e) => handleInput(e.currentTarget.value)}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
/>
