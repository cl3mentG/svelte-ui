<script lang="ts">
  import type { Snippet } from "svelte";

  type TooltipProps = {
    children: Snippet<[]>;
    popupSnippet: Snippet<[]>;
    delay?: number; 
  };

  let { children, popupSnippet, delay = 500 }: TooltipProps = $props();

  let isOpen = $state(false);
  let showTimeout: ReturnType<typeof setTimeout>;

  function open() {
    clearTimeout(showTimeout);
    showTimeout = setTimeout(() => (isOpen = true), delay);
  }

  function close() {
    clearTimeout(showTimeout);
    isOpen = false;
  }
</script>

<div
  role="button"
  tabindex="0"
  onmouseenter={open}
  onmouseleave={close}
  onfocus={open}
  onblur={close}
  class="relative inline-block"
>
  {@render children()}

  {#if isOpen}
    <div
      id="tooltip"
      role="tooltip"
      class="absolute left-1/2 top-full mt-1 -translate-x-1/2 origin-top transition-all duration-200 ease-out scale-95 translate-y-1 opacity-0 data-[show=true]:scale-100 data-[show=true]:translate-y-0 data-[show=true]:opacity-100 z-50 w-full"
      data-show={isOpen}
    >
      {@render popupSnippet()}
    </div>
  {/if}
</div>
