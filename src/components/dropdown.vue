<script setup lang="ts">
import {computed, type ComputedRef, nextTick, onMounted, type Ref, ref, watch, onBeforeUnmount} from 'vue';
import {ModalService, UiService, smartInterval} from '@/services';
import type {ControlOption, DropdownConfig, TooltipConfig} from '@/models';
import type {Subscription} from 'rxjs';
import {type AccordionConfig, Alignment} from '@/models';

import Accordion from '@/components/accordion.vue';

const props = defineProps<{
  id: string,
  modelValue: any | null,
  options: ControlOption[],
  config?: DropdownConfig
}>();

const emits = defineEmits(['update:modelValue', 'valid']);

const modalService: ModalService = ModalService.instance();
const onInteractModalOverlaySubscription: Subscription = modalService.onInteractModalOverlay$.subscribe(() =>
                                                                                                        {
                                                                                                          isExpanded.value = false;
                                                                                                        });

const accordionContainer: Ref<HTMLElement | null> = ref(null);
const accordionParent: Ref<HTMLElement | null> = ref(null);

const isExpanded: Ref<boolean> = ref(false);
const selectedOption: Ref<ControlOption | null> = ref(null);

const cssClass: Ref<any> = ref({'relative': true});
const cssAccordionClass: Ref<any> = ref({
                                          'w-full':            true,
                                          'shadow-lg':         true,
                                          'overflow-x-hidden': true,
                                          'overflow-y-scroll': true,
                                          'border-radius-b':   true,
                                          'bg-black':          true
                                        });

const aggregateClass: ComputedRef<any> = computed(() => typeof props.config?.class === 'string' ? {
  [props.config?.class]: true,
  ...(cssClass.value || {})
} : {...(cssClass.value || {}), ...(props.config?.class || {})});

const accordionConfig: ComputedRef<AccordionConfig> = computed(() => (props.config?.accordionConfig || {
  class: cssAccordionClass.value
}));

watch(() => props.modelValue, () =>
{
  selectedOption.value = props.options.find((option: ControlOption) => option.value === props.modelValue) || null;
});
watch(isExpanded, () =>
{
  if(isExpanded.value)
  {
    smartInterval((clear: () => void) =>
                  {
                    if(<HTMLElement>accordionContainer.value && <HTMLElement>accordionParent.value)
                    {
                      clear();
                      nextTick(() => UiService.instance()
                          .alignAbsoluteSubordinateObject(
                              <HTMLElement>accordionContainer.value,
                              <HTMLElement>accordionParent.value,
                              Alignment.RIGHT_BELOW,
                              props.config?.accordionZIndex ?? 10
                          ));
                    }
                  }, 200);
    modalService.showModalOverlay();
  }
  else
  {
    modalService.hideModalOverlay();
  }
});

onMounted(() =>
          {
            selectedOption.value = props.options.find((option: ControlOption) => option.value === props.modelValue) || null;
            smartInterval((clear: () => void) =>
                          {
                            if(<HTMLElement>accordionContainer.value && <HTMLElement>accordionParent.value)
                            {
                              clear();
                              nextTick(() => UiService.instance()
                                  .alignAbsoluteSubordinateObject(
                                      <HTMLElement>accordionContainer.value,
                                      <HTMLElement>accordionParent.value,
                                      Alignment.RIGHT_BELOW,
                                      props.config?.accordionZIndex ?? 10
                                  ));
                            }
                          }, 200);
          });
onBeforeUnmount(() =>
                {
                  onInteractModalOverlaySubscription.unsubscribe();
                });

function onClickDropdown()
{
  if(!props.config?.disabled)
  {
    isExpanded.value = !isExpanded.value;
  }
}

function onInput(option: ControlOption | null)
{
  isExpanded.value = false;
  emits('update:modelValue', option?.value || null);
}
</script>

<template>
  <div :id="id" class="dropdown" :class="aggregateClass">
    <label :for="id + '-toggle-button'"
           v-if="config?.label">{{ config?.label }}</label>
    <div class="inline-block absolute top-0 right-0" v-tooltip="config?.tooltip" v-if="config?.tooltip">
      <i class="fa-solid fa-circle-info"></i>
    </div>
    <div class="w-full mt-2" ref="accordionParent">
      <div :id="id + '-toggle-button'" class="w-full bg-black border-radius pad-text flex items-center justify-between" @click="onClickDropdown"
           @keyup.enter.space="isExpanded = !isExpanded" role="button" tabindex="0">
        <p class="flex-shrink truncate">{{ selectedOption?.label || config?.placeholder || '' }}</p>
        <i class="fa-solid fa-chevron-down rotates" :class="{rotate: isExpanded}"></i>
      </div>
      <div class="w-full" ref="accordionContainer">
        <Accordion :id="`${id}-accordion`" :is-expanded="isExpanded" :config="accordionConfig">
          <div class="border-radius-b">
            <div :id="`${id}-clear-selection-button`" :class="null" @click="onInput(null)"
                 @keyup.enter.space="onInput(null)" :tabindex="isExpanded ? 0: null" v-if="config?.isClearable">
              <p class="italic truncate text-srsa-black-300">{{ config?.clearSelectionText || 'clear selection' }}</p>
            </div>
            <div :id="`${id}-option-${index}`"
                 class="pad-text cursor-pointer hover:bg-gray-900"
                 :class="{'border-radius-b': index === options.length - 1}"
                 v-for="(option, index) in options" :key="index" @click="onInput(option)"
                 @keyup.enter.space="onInput(option)" role="button" :tabindex="isExpanded ? 0: null">
              <p class="truncate">{{ option.label }}</p>
              <p class="subtext truncate" v-if="option.subtext">{{ option.subtext }}</p>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dropdown {
  .selected-option {
    height: 2rem;
    padding: .25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selected-option-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    justify-items: center;
  }

  .option {
    padding: calc(var(--dimension-pad, .8rem) / 2);
    cursor: pointer;
    border-bottom: 1px solid var(--color-srsa-black-200, #000);

    &:hover {
      background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
    }

    .subtext {
      color: var(--color-srsa-black-300, #000);
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
}
</style>
