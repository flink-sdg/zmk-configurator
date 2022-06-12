import type {TooltipConfig} from '@/models/tooltip.types';

export type ControlOption = {
    label: string;
    value: any;
    subtext?: string;
}

export type LayoutManagerConfig = {
    test: boolean
};

export type AccordionConfig = {
    maxHeight?: string,
    class?: string | any,
    shouldReload?: boolean
};

export type DropdownConfig = {
    label?: string,
    tooltip?: TooltipConfig,
    placeholder?: string,
    isClearable?: boolean,
    clearSelectionText?: string,
    disabled?: boolean,
    class?: string | any,
    accordionConfig?: AccordionConfig,
    accordionZIndex?: number
}
