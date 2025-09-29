
# svelte-ui

A library of customizable components for Svelte projects

## How to run
```
pnpm install
pnpm run dev --open
```

## Available components

### Inputs
Input components

---
#### `NumberInput`
Input with styling. Supports default input props.

Supports numbers functionnalities (buttons to increment and decrement, dynamic check for errors).
- Buttons to increment/decrement value
- Use up and down arrow keys to increment/decrement value
- Input validation: red outline if value not between min and max
- Supports exponential notation eg `3e2`

**Additional properties**
- (_optional_) `decimalSeparator: boolean` : sets decimal separator (usually `,` or  `.` by default)
-  (_optional_) `noButton: boolean`: remove buttons used to increment / decrement value. Useful if input is too small.
---

#### `RegexInput`
Input with styling. Supports default input props

Supports regex validation.

**Additional properties**
- `validRegex: RegExp`: regular expression used to validate input when it blurs. It the text doesn't match, `data-error="true"` is added to the class list for input.
- (_optional_) `completionRegex: RegExp`: regular expression used to validate input each type a key is pressed. If the content of the input does not match that pattern, input is reverted to last valid state. If `undefined`, input is unconstrained.
---

### Dropdowns
Components that display a dropdown to select one or multiple options
The following props are common to all dropdown components:
**Additional properties**

- (_optional_) `id: string`: control id
- (_optional_) `name: string`: control name
- (_optional_) `readonly: boolean`: is control readonly?
- (_optional_) `disabled: boolean`: is control disabled?

- `options: Record<string, Option extends Record<string, any> & {group?: string}>`: list of options available as a dictionnary where the key is used as value for the input e.g.

```
const options = {
    "0": {label: "Pancakes", "difficulty": "easy", "group": "desserts"},
    "1": {label: "Ice Cream", "difficulty": "medium", "group": "desserts"},
}
```

- (_optional_) `groups: Record<string, Option extends Record<string, any>>`:
list of groups available as a dictionnary where the key is used to group options together e.g.

```
const groups = {
    "desserts": {label: "Desserts"},
    "main_courses": {label: "Main courses"},
}
```

- (_optional_) `menuClass: string`: class to apply to the outer dropdown container, to apply border styles, shadows etc...

- (_optional_) `contentClass: string`: class to apply to the inner dropdown container, to set maximum size etc...

- (_optional_) `onSelect: (value: string) => void`: callback to be called when a value is selected from the dropdown menu.

- `optionSnippet: Snippet<[Option, boolean]>`: snippet used to render option in the dropdown list. Use it to customize appearance. First parameter is option selected, second one tells if the option is the one selected or not.
- (_optional_) `groupSnippet: Snippet<[Group]>`: snippet used to render the group header (because options are grouped together). It is optional but highly recommended to use if you plan to support groups.

- (_optional_) `sortOptions: (a: Option, b: Option) => number`: callback to sort options inside a group
- (_optional_) `sortGroups: (a: Group, b: Group) => number`: callback to sort groups

---
#### `Select`
A dropdown list with styling applied.
Supports custom ordering, grouping options, custom snippet to render groups and options

**Additional properties**
- (_optional_, **bindable**) `value: string`: the key of the selected option.
- `triggerSnippet: Snippet<[Option | undefined, boolean]>`: snippet used as overlay to add . First parameter is option selected, second one tells if the dropdown menu is open or not.
- (_optional_) `onSelect: (string) => void` callback called when item selected

---
#### `Search`
A searchbar with styling applied.
Supports custom ordering, grouping options, custom snippet to render groups and options

**Additional properties**
- (_optional_, **bindable**) `value: string`: the key of the selected option.
- `triggerSnippet: Snippet<[Option | undefined, () => void]>`: snippet used as overlay to delete elements. First parameter is option selected, second one tells is a callback to reset value.
- (_optional_) `onSelect: (string) => void` callback called when item selected
- (_optional_) `onDeselect: () => void` callback called when selected item is reset
- (_optional_) `inputClass: string` class applied to the input. Use this to style the border, change font color etc...
- (_optional_) `placeholder: string` placeholder for input
- `noResultSnippet: Snippet`: snippet used when no option matches the search query.

---
#### `Multisearch`
A searchbar to search labels.
Supports custom ordering, grouping options, custom snippet to render groups and options

## Roadmap
| Component | Action | Status |
|---| ---|---|
|`ContextMenu`| Create component |🚧|
|`Calendar`| Create component |🚧|
|`Kanban`| Create component |🚧|
|`Table`| Create component |🚧|
|all| Refactor to allow user to set custom styles |wip|