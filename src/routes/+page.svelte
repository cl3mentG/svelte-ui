<script lang="ts">
    import { Button } from "$lib/ui/button";
    import { Input, NumberInput } from "$lib/ui/input";
    import { Select } from "$lib/ui/select";
</script>

<Button class="bg-blue-500">TEST</Button>

<Input type="number" />
<NumberInput max={3} min={-3} placeholder="placeholder" />
<Select
    class="w-80"
    options={[
        { label: "First option", value: 1 },
        { label: "Second option", value: 2 },
        { label: "BVBBBBBBBBBBBBBBBBBBB option", value: 3 },
        { label: "Fourth option", value: 4 },
        { label: "Fifth option", value: 5 },
        { label: "Sixth option", value: 6 },
        { label: "Seventh option", value: 7 },
        { label: "Eighth option", value: 8 },
        { label: "Ninth option", value: 9 },
        { label: "Tenth option", value: 10 },
        { label: "Eleventh option", value: 11 },
        { label: "Twelfth option", value: 12 },
        { label: "Thirteenth option", value: 13 },
        { label: "Fourteenth option", value: 14 },
        { label: "Fifteenth option", value: 15 },
    ]}
    placeholder="Select a value"
/>
