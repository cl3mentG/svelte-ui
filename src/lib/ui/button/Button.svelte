<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";
    import { buttonDefault } from "../styles";

    type ButtonProps = Omit<HTMLButtonAttributes, 'class'> & {
        class?: string; 
        children?: Snippet;
    };

    let { class: cls = "", children, ...others }: ButtonProps = $props();
    
    let mergedClasses = $derived(twMerge(buttonDefault, cls));
</script>

<button {...others} class={mergedClasses}>
    {@render children?.()}
</button>