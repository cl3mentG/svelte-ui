
# svelte-ui

A library of customizable components for Svelte projects.
It is a non-opinionated library designed to let users build their own library by making their own design choices.

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
- (_optional_, **bindable**) `value: number`: value.
- (_optional_) `decimalSeparator: boolean` : sets decimal separator (usually `,` or  `.` by default)
- `buttonsSnippet: Snippet<[NumberInputButtonsProps]>`: snippet used to add buttons to increment or decrement input value. `NumberInputButtonsProps` contains:
    - `functions`: 4 functions `startIncrement`, `startDecrement`, `stopIncrement`, `stopDecrement` with same signature `(e: MouseEvent) => void`
    - `disabled?: boolean`: is component disabled?
    - `readonly?: boolean`: is component readonly?

---

#### `RegexInput`
Input with styling. Supports default input props.

Supports regex validation.

**Additional properties**
- (_optional_, **bindable**) `value: string`: value (if it matches `validRegex`).
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
- (_optional_) `required: boolean`: is control required? If true, `error` prop is set to true if the control is blurred without a proper value.

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
- `triggerSnippet: Snippet<[SelectTriggerProps]>`: snippet used as button to open the dropdown. `SelectTriggerProps` contains:
    - `selectedOption: Option | undefined`: selected option
    - `isOpen`: is dropdown open?
    - `error`: has error?
- (_optional_) `onSelect: (string) => void` callback called when item selected

---
#### `Search`
A searchbar with styling applied.
Supports custom ordering, grouping options, custom snippet to render groups and options.

**Additional properties**
- (_optional_, **bindable**) `value: string`: the key of the selected option.
- `triggerSnippet: Snippet<[SearchTriggerProps]>`: snippet used as overlay to delete elements. `SearchTriggerProps` contains: 
    - `input: Snippet<[Partial<HTMLInputAttributes & {class?: string}]>`: input passed as snippet to the trigger. Use the argument to pass properties to input.such as class, placeholder etc...
    - `selectedOption: Option | undefined`: option that is currently selected (`undefined` if no option).
    - `isOpen: boolean`: tells if dropdown menu is open.
    - `error: boolean`: tells if there is an error on blur : nothing selected while `required` is set.
    - `resetOption: () => void`: callback that can be called to deselect the option and reset input text.
    - `focusInput: () => void`: callback that can be called to focus the input.
- (_optional_) `onSelect: (string | undefined) => void` callback called when item selected or deselected. When item is deselected `onSelect` is called with `undefined`.
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
- (_optional_) `onSelect: (string) => void` callback called when item selected or deselected. 
- (_optional_) `inputClass: string` class applied to the input. Use this to style the border, change font color etc...
- (_optional_) `placeholder: string` placeholder for input
- `noResultSnippet: Snippet`: snippet used when no option matches the search query.
- `selectedOptionSnippet: Snippet<[Option, () => void]>`: snippet used to render the selected option. First element is option details, second one is callback to deselect the option.
- (_optional_) `triggerSnippet: Snippet<[MultisearchTriggerProps]>`: snippet to be used as trigger. `MultisearchTriggerProps` contains:
    - `selectedOptionsSnippet`: snippet to render all selected options as children. The rendering is taken care of inside the multisearch, but the user has to provide the place where it should be rendered.
    - `input: Snippet<[Partial<HTMLInputAttributes> & { class?: string }]>`: snippet to render input with attributes.
    - `isOpen`: is dropdown menu open?
    - `error`: tells if there is an error on blur : nothing selected while `required` is set.
    - `resetOptions: () => void`: callback to reset all options
    - `focusInput: () => void`: callback to focus the input

---
### Date

**Common properties**

- (_optional_) `isSelectable: (Date) => boolean`: callback to check if date is selectable. All days are selectable by default. Use this to restrict selectable days.
- (_optional_) `locale: string`: locale used for date formatting. Defaults to `navigator.language`.
- (_optional_) `menuClass: string`: class use to style the dropdown menu (background, borders etc...).

---
#### `DatePicker`

**Additional properties**

- (_optional_, **bindable**) `value: SvelteDate`: selected date.
- `triggerSnippet: Snippet<[DatePickerTriggerProps]>`: snippet used as button to open the dropdown. `DatePickerTriggerProps` contains:
    - `locale: string`: locale to format the date.
    - `value: Date | undefined`: current value.
    - `isOpen: boolean`: tells if dropdown menu is open.
    - `error: boolean`: tells if error (`required` + blur)
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
- `triggerSnippet: Snippet<[DaterangePickerTriggerProps]>`: snippet used to render the trigger button. `DaterangePickerTriggerProps` contains:
    - `locale: string`: locale to format the date.
    - `value: DateRange`: current value.
    - `isOpen: boolean`: tells if dropdown menu is open.
    - `error: boolean`: tells if error (`required` + blur)
- `dayCellSnippet:  Snippet<[DayRangeStatus, Date]>`: snippet used to style how a day looks like in the dropdown calendar. Contains 
    - `isInMonth` (is day in the current calendar month?)
    - `isSelectable` (can that day be selected?)
    - `isStart` (is that day start of the range?)
    - `isEnd` (is that day end of the range?)
    - `isInRange` (is that day start in the selected range?)

---
## Color picker

A color picker with dropdown menu.
Supports alpha HSV selection, and hex input.
Supports alpha channel.

**Additional properties**
- (_optional_, **bindable**) `value: SvelteDate`: selected date.
- `triggerSnippet: Snippet<[ColorPickerTriggerProps]>`: snippet used to render the button to open the dropdown. `ColorPickerTriggerProps` contains:
    - `color: Color`: custom class to support hsv, rgb, hsl and hex.
    - `isOpen`: tells if dropdown menu is open.
    - `error: boolean`: tells if error (`required` + blur)
- (_optional_)`menuClass: string`: class that can be applied to the dropdown. use that to set border and background color.
- (_optional_) `noAlpha: boolean`: Don't use alpha channel.
- (_optional_) `inputClass: string`: class to be used on inputs in the dropdown. 
- (_optional_) `sliderTrackClass: string`: class to be used on slider track in the dropdown. Use this to set width, rounded borders etc...
- (_optional_) `sliderThumbClass: string`: class to be used on slider thumb in the dropdown. Use this to set width, height, etc...
- (_optional_) `gradientTrackClass: string`: class to be used on the 2D color shade selector in the dropdown. Use this to set width, height, etc...
- (_optional_) `gradientThumbClass: string`: class to be used on the cursor on the 2D color shade selector in the dropdown. Use this to set width, height, etc...

## Roadmap
| Component | Action | Status |
|---| ---|---|
|`ContextMenu`| Create component |🚧|
|`Calendar`| Create component |🚧|
|`Kanban`| Create component |🚧|
|`Table`| Create component |🚧|
|all| Refactor to make functionnalities consistent: `onSelect`, `id`, `name`, `disabled` and `readonly`|🚧|
|all| Refactor to allow user to set custom styles |wip|
|all| Write documentation for `Tooltip` and `ContextMenu` |wip|