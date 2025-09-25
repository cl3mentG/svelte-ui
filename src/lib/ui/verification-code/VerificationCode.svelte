<script lang="ts">
    import { common, focusable } from "../styles";
    import { cn } from "../utils";

    type VerificationCodeProps = {
        class?: string;
        id?: string;
        name?: string;
        length: number;
        onCompletion: (code: string) => any;
    };

    let { class: cls, id, name, length, onCompletion }: VerificationCodeProps = $props();

    let values: string[] = $state(Array(length).fill(""));
    let inputs: HTMLInputElement[] = $state([]);

    let code = $derived(values.join(""));

    function handleInput(
        i: number,
        e: Event & { currentTarget: HTMLInputElement },
    ) {
        const val = e.currentTarget.value;

        // Keep only digits
        values[i] = val.replace(/\D/g, "");

        // Move focus if valid
        if (values[i].length === 1 && i < length - 1) {
            inputs[i + 1].focus();
        } else if (i === length - 1 && values.every((v) => v !== "")) {
            onCompletion(code);
        }
    }

    function handleKeydown(i: number, e: KeyboardEvent) {
        if (e.key === "Backspace" && values[i] === "" && i > 0) {
            inputs[i - 1].focus();
        }
    }
</script>

<div class="space-x-4" id={id}>
    {#each Array.from({ length }, (_, i) => i) as i (i)}
        <input
            type="text"
            inputmode="numeric"
            pattern="\d*"
            maxlength="1"
            bind:this={inputs[i]}
            bind:value={values[i]}
            class={cn(
                common,
                focusable,
                "w-16 text-xl aspect-square text-center",
            )}
            oninput={(e) => handleInput(i, e)}
            onkeydown={(e) => handleKeydown(i, e)}
        />
    {/each}
    {#if name}
        <input hidden name={name} value={code} />
    {/if}
</div>
