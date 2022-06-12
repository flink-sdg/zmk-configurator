export type Binding = {
    behavior?: string;
    modifier?: string;
    keycode?: string;
};

export type Layout = {
    name: string;
    split: boolean;
    shape: boolean[][];
    layers: Binding[][];
};
