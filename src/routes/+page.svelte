<script lang="ts">
    import { Button } from "$lib/ui/button";
    import { Input, NumberInput } from "$lib/ui/input";
    import { Select, Search, Multisearch } from "$lib/ui/dropdown";
</script>

<Button>Click here</Button>

<Input type="number" />
<NumberInput max={3} min={-3} step={0.1} placeholder="Number between -3 and 3" />
<Select
    placeholder="What do you like most?"
    options={{
        "1": { label: "Pancakes", group: "1" },
        "2": { label: "Crêpes", group: "1" },
        "3": { label: "Tiramisu", group: "1" },
        "4": { label: "Burger", group: "2" },
        "5": { label: "French fries", group: "2" },
        "6": { label: "Soup", group: "2" },
        "7": { label: "Ice cream", group: "1" },
        "8": { label: "Mojito", group: "3" },
        "9": { label: "Coke", group: "3" },
        "10": { label: "Water", group: "3" },
    }}
    groups={{
        "1": { label: "Desserts" },
        "2": { label: "Main courses" },
        "3": { label: "Drinks" },
    }}
    onSelect={(selectedId: string) =>{console.log(selectedId)}}
    
>
    {#snippet groupSnippet(group)}
        <div class="font-bold italic">{group.label}</div>
    {/snippet}
</Select>

<Search
    placeholder="Search"
    noResultLabel="No results found."
    options={{
        "1": { label: "Pancakes", group: "1" },
        "2": { label: "Crêpes", group: "1" },
        "3": { label: "Tiramisu", group: "1" },
        "4": { label: "Burger", group: "2" },
        "5": { label: "French fries", group: "2" },
        "6": { label: "Soup", group: "2" },
        "7": { label: "Ice cream", group: "1" },
        "8": { label: "Mojito", group: "3" },
        "9": { label: "Coke", group: "3" },
        "10": { label: "Water", group: "3" },
    }}
    groups={{
        "1": { label: "Desserts" },
        "2": { label: "Main courses" },
        "3": { label: "Drinks" },
    }}
/>

<Multisearch
    placeholder="Search"
    noResultLabel="No results found."
    options={{
        "1": { label: "Pancakes", group: "1" },
        "2": { label: "Crêpes", group: "1" },
        "3": { label: "Tiramisu", group: "1" },
        "4": { label: "Burger", group: "2" },
        "5": { label: "French fries", group: "2" },
        "6": { label: "Soup", group: "2" },
        "7": { label: "Ice cream", group: "1" },
        "8": { label: "Mojito", group: "3" },
        "9": { label: "Coke", group: "3" },
        "10": { label: "Water", group: "3" },
    }}
    groups={{
        "1": { label: "Desserts" },
        "2": { label: "Main courses" },
        "3": { label: "Drinks" },
    }}
/>