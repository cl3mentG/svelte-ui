<script lang="ts">
    type VerificationCodeProps = {
        inputClass?: string;
        containerClass?: string;
        id?: string;
        name?: string;
        length: number;
        onCompletion: (code: string) => any;
    };

    let { containerClass, inputClass, id, name, length, onCompletion }: VerificationCodeProps = $props();

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

<div class={containerClass} id={id}>
    {#each Array.from({ length }, (_, i) => i) as i (i)}
        <input
            type="text"
            inputmode="numeric"
            pattern="\d*"
            maxlength="1"
            bind:this={inputs[i]}
            bind:value={values[i]}
            class={inputClass}
            oninput={(e) => handleInput(i, e)}
            onkeydown={(e) => handleKeydown(i, e)}
        />
    {/each}
    {#if name}
        <input hidden name={name} value={code} />
    {/if}
</div>
