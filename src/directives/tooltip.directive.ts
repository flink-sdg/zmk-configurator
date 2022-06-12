import {computed, type ComputedRef, type DirectiveBinding, type Ref, ref, watch} from "vue";
import {Alignment, PositionType, type TooltipConfig} from "@/models";
import type {Directive} from "@vue/runtime-core";
import {ModalService, UiService} from "@/services";
import type {Subscription} from "rxjs";

const callbacks: Record<string, Record<string, () => void>> = {};

let isModalOverlayClickedSubscription: Subscription;

export const tooltip: Directive = {
    mounted: (object: HTMLElement, binding: DirectiveBinding) => {
        const tooltipConfig: TooltipConfig = binding.value;
        const tooltipContainer: HTMLElement | null = document.getElementById('app-tooltip-container');
        const uiService: UiService = tooltipConfig.uiService || UiService.instance();
        const modalService: ModalService = tooltipConfig.modalService || ModalService.instance();

        const isClicked: Ref<boolean> = ref(false);
        const isOverObject: Ref<boolean> = ref(false);
        const isOverTooltipContainer: Ref<boolean> = ref(false);
    
        const isShowing: ComputedRef<boolean> = computed(() => isOverObject.value || isOverTooltipContainer.value || isClicked.value);
    
        let enterObjectTimeout: number = 0;
        let leaveObjectTimeout: number = 0;

        if (!tooltipContainer)
            return;

        callbacks[tooltipConfig.id] = {
            enterTooltipContainerCallback: () => isOverTooltipContainer.value = true,
            leaveTooltipContainerCallback: () => isOverTooltipContainer.value = false
        };

        watch(isShowing, () => {
            const renderTooltip: () => void = () => {
                uiService.alignFixedSubordinateObject(tooltipContainer, object, tooltipConfig.alignment ?? Alignment.RIGHT_BELOW, tooltipConfig.zIndex ?? 1);
                uiService.adjustSubordinateObjectPositionAlignment(tooltipContainer, object, PositionType.FIXED);

                if (isShowing.value) {
                    requestAnimationFrame(renderTooltip);
                } else {
                    tooltipContainer.classList.add('animate__fadeOut');
                    tooltipContainer.style.zIndex = '-1';
                    tooltipContainer.removeEventListener('mouseenter', callbacks[tooltipConfig.id].enterTooltipContainerCallback);
                    tooltipContainer.removeEventListener('mouseleave', callbacks[tooltipConfig.id].leaveTooltipContainerCallback);
                }
            };

            if (isShowing.value) {
                tooltipContainer.classList.remove('hidden');
                tooltipContainer.classList.remove('animate__fadeOut');
                tooltipContainer.classList.add('animate__fadeIn');

                tooltipContainer.addEventListener('mouseenter', callbacks[tooltipConfig.id].enterTooltipContainerCallback);
                tooltipContainer.addEventListener('mouseleave', callbacks[tooltipConfig.id].leaveTooltipContainerCallback);

                if (typeof tooltipConfig.content === 'string') {
                    tooltipContainer.innerHTML = `<div id="${tooltipConfig.id}" class="${tooltipConfig.class || 'p-2 border-radius bg-dark-transparent text-white'}"><p>${tooltipConfig.content}</p></div>`
                } else if (tooltipConfig.content) {
                    tooltipConfig.content.id = tooltipConfig.id;
                    tooltipContainer.replaceChildren(tooltipConfig.content);
                } else return;

                requestAnimationFrame(renderTooltip);
            } else {
                tooltipContainer.classList.add('animate__fadeOut');
                tooltipContainer.style.zIndex = '-1';
                tooltipContainer.removeEventListener('mouseenter', callbacks[tooltipConfig.id].enterTooltipContainerCallback);
                tooltipContainer.removeEventListener('mouseleave', callbacks[tooltipConfig.id].leaveTooltipContainerCallback);
            }
        });

        object.addEventListener('mouseenter', () => {
            clearTimeout(leaveObjectTimeout);
            enterObjectTimeout = setTimeout(() => isOverObject.value = true, tooltipConfig.delay || 200);
        });
        object.addEventListener('mouseleave', () => {
            clearTimeout(enterObjectTimeout);
            leaveObjectTimeout = setTimeout(() => isOverObject.value = false, 100);
        });

        if (tooltipConfig.isClickable) {
            isModalOverlayClickedSubscription = modalService.onInteractModalOverlay$.subscribe((isModalOverlayClicked: boolean) => {
               if(isModalOverlayClicked) {
                   modalService.hideModalOverlay();
                   isClicked.value = false;
               }
            });

            object.ariaRoleDescription = 'button';
            object.tabIndex = 0;
            object.classList.add('cursor-pointer');
            object.addEventListener('click', () => {
                modalService.showModalOverlay();
                isClicked.value = true
            });
            object.addEventListener('keyup', (keyboardEvent: KeyboardEvent) => {
                if (keyboardEvent.code === 'Enter' || keyboardEvent.code === 'Space') {
                    modalService.showModalOverlay();
                    isClicked.value = true;
                }
            });
        }
    },
    beforeUnmount: (object: HTMLElement, binding: DirectiveBinding) => {
        const tooltipContainer: HTMLElement | null = document.getElementById('app-tooltip-container');
        const tooltipConfig: TooltipConfig = binding.value;

        if(isModalOverlayClickedSubscription)
            isModalOverlayClickedSubscription?.unsubscribe();
        if (!tooltipContainer)
            return;

        tooltipContainer.removeEventListener('mouseenter', callbacks[tooltipConfig.id].enterTooltipContainerCallback);
        tooltipContainer.removeEventListener('mouseleave', callbacks[tooltipConfig.id].leaveTooltipContainerCallback);
    }
};
