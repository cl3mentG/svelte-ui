export type BaseContextMenuItem<TExtra = Record<string, unknown>> = {
    action?: (args: any) => any;
    children?: BaseContextMenuItem<TExtra>[];
} & TExtra;