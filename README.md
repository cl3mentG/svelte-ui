
# svelte-cui

A library of customizable components for Svelte projects

## Available components

### Button
A simple button with styling applied

---
### Inputs
Input components

---
#### Input
A simple input with styling applied

---
#### NumberInput
An input with styling applied.
Supports numbers functionnalities (buttons to increment and decrement, dynamic check for errors).
- Buttons to increment/decrement value
- Use up and down arrow keys to increment/decrement value
- Input validation: red outline if value not between min and max
---

### Dropdowns
Components that display a dropdown to select one or multiple options

---
#### Select
A dropdown list with styling applied.
Supports custom ordering, grouping options, custom snippet to render groups and options

---
#### Search
A searchbar with styling applied.
Supports custom ordering, grouping options, custom snippet to render groups and options

---
#### Multisearch
A searchbar to search labels.
Supports custom ordering, grouping options, custom snippet to render groups and options

## Roadmap
| Component | Action | Status |
|---| ---|---|
|`Input`| Support regex validation |🚧|
|`Input`| Prevent typing letters if does not match start of regex |🚧|
|`NumberInput`| Prevent typing letters except 'e'|🚧|
|`NumberInput`| Fix precision errors, round to nearest step|🚧|
|`Select`, `Search`, `Multisearch`| Create reusable dropdown menu|✅|
|`Multisearch`| Create hidden inputs for form submission |🚧|