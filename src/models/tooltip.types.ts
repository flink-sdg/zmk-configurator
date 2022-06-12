import type {Alignment} from "@/models";
import type {ModalService, UiService} from "@/services";

export type TooltipConfig = {
    content: string | HTMLElement;
    id: string;
    alignment?: Alignment;
    delay?: number;
    isClickable?: boolean;
    class?: string[];
    uiService?: UiService;
    modalService?: ModalService;
    zIndex?: number;
}
