<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { common, focusable, inputDefault } from "../styles";
    import { cn } from "../utils";

    type InputProps = Omit<HTMLInputAttributes, 'class'> & {
        class?: string; 
    };

    let { class: cls = "", ...others }: InputProps = $props();
    
    let mergedClasses = $derived(cn(common, focusable, inputDefault, cls));
</script>

<input {...others} class={mergedClasses}/>
