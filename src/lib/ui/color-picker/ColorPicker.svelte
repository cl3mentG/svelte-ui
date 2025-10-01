<script lang="ts">
    import { Color } from "./color.svelte";
    import { cn } from "../utils";
    import type { ColorPickerProps } from "./types";

    let {
        triggerSnippet,
        menuClass,
        noAlpha,
        inputClass,
        sliderTrackClass,
        sliderThumbClass,
        gradientTrackClass,
        gradientThumbClass,
    }: ColorPickerProps = $props();

    let isOpen = $state(false);
    let error = $state(false);

    let parentEl: HTMLDivElement;

    // svelte-ignore non_reactive_update
    let gradientDiv: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let hueDiv: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let alphaDiv: HTMLDivElement;

    let color: Color = $state(new Color("#ff0000"));
    let previousHexInput = $state(
        noAlpha ? color.hexWithoutAlpha : color.hexWithAlpha,
    );

    let draggingStatus = $state({ alpha: false, gradient: false, hue: false });

    function handleMouseMove(event: MouseEvent) {
        const rectGradient = gradientDiv?.getBoundingClientRect();
        const rectHue = hueDiv?.getBoundingClientRect();
        const rectAlpha = alphaDiv?.getBoundingClientRect();

        if (draggingStatus.gradient && rectGradient) {
            let x = event.clientX - rectGradient.left;
            let y = event.clientY - rectGradient.top;

            x = Math.max(0, Math.min(rectGradient.width, x));
            y = Math.max(0, Math.min(rectGradient.height, y));

            const s = x / rectGradient.width; // HSV saturation 0..1
            const v = 1 - y / rectGradient.height; // Value 0..1, top = high

            color.set({ sHsv: s, v: v });
        } else if (draggingStatus.hue && rectHue) {
            let y = event.clientY - rectHue.top;
            y = Math.max(0, Math.min(rectHue.height, y));

            const h = (y / rectHue.height) * 360;
            color.set({ h: h });
        } else if (draggingStatus.alpha && rectAlpha) {
            let y = event.clientY - rectAlpha.top;
            y = Math.max(0, Math.min(rectAlpha.height, y));

            const a = 1 - y / rectAlpha.height;
            color.set({ a: a });
        }
    }

    function handleGradientDown(event: MouseEvent) {
        event.preventDefault();
        draggingStatus.gradient = true;
        handleMouseMove(event);
    }

    function handleHueDown(event: MouseEvent) {
        event.preventDefault();
        draggingStatus.hue = true;
        handleMouseMove(event);
    }

    function handleAlphaDown(event: MouseEvent) {
        event.preventDefault();
        draggingStatus.alpha = true;
        handleMouseMove(event);
    }

    function handleMouseUp(
        event: MouseEvent & { currentTarget: EventTarget & Document },
    ) {
        if (
            !draggingStatus.alpha &&
            !draggingStatus.gradient &&
            !draggingStatus.hue
        ) {
            if (!parentEl.contains(event.target as Node)) {
                isOpen = false;
            }
        } else {
            draggingStatus.alpha = false;
            draggingStatus.gradient = false;
            draggingStatus.hue = false;
        }
    }

    function handleInput(
        event: Event & { currentTarget: EventTarget & HTMLInputElement },
    ) {
        const raw = event.currentTarget.value.trim().toLowerCase();

        // Strict: RGB (6 digits) or RGBA (8 digits), optional leading #
        const hexRegex = /^#?(?:[a-f0-9]{6}|[a-f0-9]{8})$/;

        // Incomplete: hex digits
        const incompleteRegex = /^#?(?:[a-f0-9]{0,8})$/;

        if (!incompleteRegex.test(raw)) {
            event.currentTarget.value = previousHexInput;
            return;
        }

        let hex = raw;
        if (!hex.startsWith("#")) {
            hex = "#" + hex;
        }
        event.currentTarget.value = hex;
        previousHexInput = hex;

        if (hexRegex.test(raw)) {
            if (hex.length === 7 && noAlpha) {
                hex += "ff";
                color.set({ hex: hex });
                event.currentTarget.blur();
            } else if (hex.length === 9) {
                color.set({ hex: hex });
                event.currentTarget.blur();
            }
        }
    }
</script>

<svelte:document onmouseup={handleMouseUp} onmousemove={handleMouseMove} />

<div class="relative inline-flex items-center rounded-md" bind:this={parentEl}>
    <button onclick={() => (isOpen = !isOpen)}>
        {@render triggerSnippet({color: color, isOpen: isOpen, error: error})}
    </button>

    {#if isOpen}
        <div
            class={cn(
                "absolute left-0 top-full z-10 flex flex-col space-y-2 items-stretch",
                menuClass,
            )}
        >
            <div class="flex space-x-2">
                <!-- Gradient rectangle -->
                <div
                    role="slider"
                    aria-valuenow={color.sHsv * 100 * (1 - color.v) * 100}
                    tabindex="0"
                    aria-valuetext={`Saturation: ${color.sHsv * 100}, Value: ${(1 - color.v) * 100}`}
                    class={cn(
                        "gradient-rect relative aspect-square flex-1 cursor-crosshair rounded",
                        gradientTrackClass,
                    )}
                    style="background: hsl({color.h}, 100%, 50%);"
                    onmousedown={handleGradientDown}
                    bind:this={gradientDiv}
                >
                    <div
                        class="absolute inset-0 rounded"
                        style="background: 
                        linear-gradient(to top, #000, transparent),
                        linear-gradient(to right, #fff, transparent);"
                    ></div>

                    <div
                        class={cn(
                            "absolute w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none",
                            gradientThumbClass,
                        )}
                        style="
                        left: calc({color.sHsv * 100}% - 0.5rem);
                        top: calc({(1 - color.v) * 100}% - 0.5rem);
                        background: {color};
                    "
                    ></div>
                </div>

                <!-- Hue slider -->
                <div
                    role="slider"
                    tabindex="0"
                    aria-valuenow={(color.h / 360) * 100}
                    class={cn(
                        "alpha-slider relative w-6 rounded cursor-pointer",
                        sliderTrackClass,
                    )}
                    style="background: linear-gradient(to bottom, red, yellow, lime, cyan, blue, magenta, red);"
                    onmousedown={handleHueDown}
                    bind:this={hueDiv}
                >
                    <div
                        class={cn(
                            "absolute left-1/2 w-8 h-2 -translate-x-1/2 rounded bg-white border border-gray-400 shadow",
                            sliderThumbClass,
                        )}
                        style="top: calc({(color.h / 360) * 100}% - 0.25rem);"
                    ></div>
                </div>

                <!-- Alpha slider -->
                {#if !noAlpha}
                    <div
                        role="slider"
                        tabindex="0"
                        aria-valuenow={(1 - color.a) * 100}
                        class={cn(
                            "alpha-slider relative w-6 rounded cursor-pointer",
                            sliderTrackClass,
                        )}
                        style="background: 
                    linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1)),
                    repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 16px 16px"
                        onmousedown={handleAlphaDown}
                        bind:this={alphaDiv}
                    >
                        <div
                            class={cn(
                                "absolute left-1/2 w-8 h-2 -translate-x-1/2 rounded bg-white border border-gray-400 shadow",
                                sliderThumbClass,
                            )}
                            style="top: calc({(1 - color.a) * 100}% - 0.25rem);"
                        ></div>
                    </div>
                {/if}
            </div>

            <div class="flex items-center space-x-2">
                <label for="hex">hex</label>
                <input
                    class={cn("w-full", inputClass)}
                    id="hex"
                    value={noAlpha ? color.hexWithoutAlpha : color.hexWithAlpha}
                    oninput={handleInput}
                />
            </div>
        </div>
    {/if}
</div>
