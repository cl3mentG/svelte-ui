<script lang="ts">
    import { cn } from "../utils";

    let isOpen = $state(false);
    let parentEl: HTMLDivElement;

    // Selected color in hex
    let color = $state("#ff0000");

    // HSV values
    let hue = $state(0); // 0-360
    let saturation = $state(100); // 0-100
    let value = $state(100); // 0-100

    // Convert HSV to hex
    function HSVtoRGB(h: number, s: number, v: number) {
        s /= 100;
        v /= 100;
        let c = v * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = v - c;
        let r = 0,
            g = 0,
            b = 0;

        if (h < 60) [r, g, b] = [c, x, 0];
        else if (h < 120) [r, g, b] = [x, c, 0];
        else if (h < 180) [r, g, b] = [0, c, x];
        else if (h < 240) [r, g, b] = [0, x, c];
        else if (h < 300) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return (
            "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        );
    }

    function updateColorFromHSV() {
        color = HSVtoRGB(hue, saturation, value);
    }

    function handleGradientClick(event: MouseEvent) {
        const rect = (
            event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        saturation = Math.min(100, Math.max(0, (x / rect.width) * 100));
        value = Math.min(100, Math.max(0, 100 - (y / rect.height) * 100));
        updateColorFromHSV();
    }

    function handleHueChange(event: MouseEvent) {
        const rect = (
            event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const y = event.clientY - rect.top;
        hue = Math.min(360, Math.max(0, (y / rect.height) * 360));
        updateColorFromHSV();
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;
        if (isOpen && parentEl && !parentEl.contains(target)) {
            isOpen = false;
        }
    }
</script>

<svelte:document onclick={handleClickOutside} />

<div class="relative inline-flex items-center rounded-md" bind:this={parentEl}>
    <button
        class={"py-2 px-4 flex items-center space-x-2 cursor-pointer"}
        onclick={() => (isOpen = !isOpen)}
    >
        <div
            class="w-5 h-5 rounded border"
            style="background-color: {color}"
        ></div>
        <span>{color}</span>
    </button>

    {#if isOpen}
        <div
            class="absolute left-0 top-full mt-1 rounded-md shadow-lg z-10 bg-white border-2 border-gray-300 p-2 flex space-x-2"
        >
            <!-- Gradient rectangle -->
            <div
                class="relative w-64 h-40 cursor-crosshair rounded"
                style="background: hsl({hue}, 100%, 50%);"
                onclick={handleGradientClick}
            >
                <div
                    class="absolute inset-0 rounded"
                    style="background: linear-gradient(to right, #fff, rgba(255,255,255,0)), linear-gradient(to top, #000, rgba(0,0,0,0));"
                ></div>
            </div>

            <!-- Hue slider -->
            <div
                class="w-6 h-40 rounded cursor-pointer"
                style="background: linear-gradient(to top, red, yellow, lime, cyan, blue, magenta, red);"
                onclick={handleHueChange}
            ></div>
        </div>
    {/if}
</div>
