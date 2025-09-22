<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";
    import { inputDefault } from "../styles";

    type InputProps = Omit<HTMLInputAttributes, 'class'> & {
        class?: string; 
    };

    let { class: cls = "", ...others }: InputProps = $props();
    
    let mergedClasses = $derived(twMerge(inputDefault, cls));
</script>

<input {...others} class={mergedClasses}/>
