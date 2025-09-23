<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import { buttonDefault, common } from "../styles";
    import { cn } from "../utils";

    type ButtonProps = Omit<HTMLButtonAttributes, 'class'> & {
        class?: string; 
        children?: Snippet;
    };

    let { class: cls = "", children, ...others }: ButtonProps = $props();
    
    let mergedClasses = $derived(cn(common, buttonDefault, cls));
</script>

<button {...others} class={mergedClasses}>
    {@render children?.()}
</button>