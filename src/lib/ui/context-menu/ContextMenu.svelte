<script lang="ts" generics="MenuItem extends BaseContextMenuItem">
    import type { Snippet } from "svelte";
    import type { BaseContextMenuItem } from "./types";

    type ContextMenuProps = {
        class?: string;
        items: MenuItem[];
        children?: Snippet<[]>;
        itemSnippet: Snippet<[MenuItem]>;
    };

    let {
        class: cls,
        items,
        children,
        itemSnippet,
    }: ContextMenuProps = $props();

    let isOpen = $state(false);
    let position = $state({ x: 0, y: 0 });

    function handleOpen(event: MouseEvent) {
        event.preventDefault();
        isOpen = true;
        position = { x: event.clientX, y: event.clientY };
    }

    function handleClose() {
        isOpen = false;
    }

   
</script>

<!-- trigger -->
<svelte:document onclick={handleClose} />
<div
    tabindex="0"
    role="menu"
    aria-controls="context-menu"
    oncontextmenu={handleOpen}
    class="inline-block"
>
    {@render children?.()}
</div>

<!-- menu -->
{#if isOpen}
    <div
        id="context-menu"
        role="menu"
        style={`position: fixed; top: ${position.y}px; left: ${position.x}px;`}
        class="z-50"
    >
        <div class={cls}>
            {#each items as item, index (index)}
                <button
                    role="menuitem"
                    type="button"
                    class="block w-full"
                    onclick={() => handleClose()}
                >
                    {@render itemSnippet(item)}
                </button>
            {/each}
        </div>
    </div>
{/if}
