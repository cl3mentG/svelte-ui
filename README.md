
# svelte-ui

A library of customizable components for Svelte projects

## How to run the demo
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
**Common properties**

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
- `triggerSnippet: Snippet<[Option | undefined, boolean]>`: snippet used as button to open the dropdown. First parameter is option selected, second one tells if the dropdown menu is open or not.
- (_optional_) `onSelect: (string) => void` callback called when item selected

---
#### `Search`
A searchbar with styling applied.
Supports custom ordering, grouping options, custom snippet to render groups and options.

**Additional properties**
- (_optional_, **bindable**) `value: string`: the key of the selected option.
- `triggerSnippet: Snippet<[Option | undefined, () => void]>`: snippet used as overlay to delete elements. First parameter is option selected, second one tells is a callback to reset value.
- (_optional_) `onSelect: (string | undefined) => void` callback called when item selected or deselected. When item is deselected `onSelect` is called with `undefined`.
- (_optional_) `inputClass: string` class applied to the input. Use this to style the border, change font color etc...
- (_optional_) `placeholder: string` placeholder for input
- `noResultSnippet: Snippet`: snippet used when no option matches the search query.

---
#### `Multisearch`
A searchbar to search labels.
Supports custom ordering, grouping options, custom snippet to render groups and options.

**Additional properties**
- (_optional_, **bindable**) `value: string[]`: the key of the selected option.
- (_optional_) `minCount: number`: minimum items to select
- (_optional_) `maxCount: number`: maximum items to select.
- (_optional_) `placeholder: string`: placeholder for input.
- (_optional_) `onSelect: (string | undefined) => void` callback called when item selected or deselected. When item is deselected `onSelect` is called with `undefined`.
- (_optional_) `inputClass: string` class applied to the input. Use this to style the border, change font color etc...
- (_optional_) `placeholder: string` placeholder for input
- `noResultSnippet: Snippet`: snippet used when no option matches the search query.
- `selectedOptionSnippet: Snippet<[Option, () => void]>`: snippet used to render the selected option. First element is option details, second one is callback to deselect the option.
- (_optional_) `triggerClass: string`: class applied to the container. Use this to style the input (background color, borders etc...).

### Date

**Common properties**
export type CommonDateProps = {
    isSelectable?: (date: Date) => boolean;
    locale?: string;
    menuClass?: string;
}

- (_optional_) `isSelectable: (Date) => boolean`: callback to check if date is selectable. All days are selectable by default. Use this to restrict selectable days.
- (_optional_) `locale: string`: locale used for date formatting. Defaults to `navigator.language`.
- (_optional_) `menuClass: string`: class use to style the dropdown menu (background, borders etc...).

---
#### `DatePicker`

**Additional properties**
- (_optional_, **bindable**) `value: SvelteDate`: selected date.
- `triggerSnippet: Snippet<[string, SvelteDate | undefined]>`: snippet used as button to open the dropdown. First element is the locale, and second one is the value.
- `dayCellSnippet:  Snippet<[DayStatus, Date]>`: snippet used to style how a day looks like in the dropdown calendar. Contains 
    - `isInMonth` (is day in the current calendar month?)
    - `isSelectable` (can that day be selected?)
    - `isSelected` (is that day selected?)

---
#### `DateRangePicker`

**Additional properties**
- (_optional_, **bindable**) `value: SvelteDate`: selected date.
- `triggerSnippet: Snippet<[string, DateRange | undefined]>`: snippet used as button to open the dropdown. First element is the locale, and second one is the value as `DateRange`. `DateRange` contains:
    - `start: SvelteDate | null`: start of the range
    - `end: SvelteDate | null`: end of the range
- `dayCellSnippet:  Snippet<[DayRangeStatus, Date]>`: snippet used to style how a day looks like in the dropdown calendar. Contains 
    - `isInMonth` (is day in the current calendar month?)
    - `isSelectable` (can that day be selected?)
    - `isStart` (is that day start of the range?)
    - `isEnd` (is that day end of the range?)
    - `isInRange` (is that day start in the selected range?)

## Roadmap
| Component | Action | Status |
|---| ---|---|
|`ContextMenu`| Create component |🚧|
|`Calendar`| Create component |🚧|
|`Kanban`| Create component |🚧|
|`Table`| Create component |🚧|
|all| Refactor to consistently use focus styles|🚧|
|all| Refactor to make functionnalities consistent: `onSelect`|🚧|
|all| Refactor to allow user to set custom styles |wip|
|all| Write documentation for `Tooltip` and `ContextMenu` |wip|