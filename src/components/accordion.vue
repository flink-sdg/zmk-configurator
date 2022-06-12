<script setup lang="ts">
import {ref, type Ref, type ComputedRef, computed, watch} from 'vue';

import type {AccordionConfig} from "@/models";

const props = defineProps<{
  id: string,
  isExpanded: boolean,
  config?: AccordionConfig
}>();

let isInitialExpanded: boolean = false;
let maxHeight: string | null = null;
let cachedSlotContainerHeight: string | null = null;

const slotContainer: Ref<HTMLElement | null> = ref(null);
const cssClass: Ref<any> = ref(null);

const style: ComputedRef<string | null> = computed(() => {
  if (props.isExpanded)
    return isInitialExpanded ? null : maxHeight;

  return isInitialExpanded ? 'max-height: 0px;' : null;
});
const aggregateClass: ComputedRef<any> = computed(() => typeof props.config?.class === 'string' ? {
  [props.config?.class]: true,
  ...(cssClass.value || {})
} : {...(cssClass.value || {}), ...(props.config?.class || {})});

watch([slotContainer, () => props.isExpanded, () => props.config?.shouldReload], () => {
  if (slotContainer.value)
    size();
});

function size() {
  if (slotContainer.value) {
    const slotContainerComputedStyle = window.getComputedStyle(slotContainer.value);
    const slotContainerHeight: string = ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'].reduce((accumulator: number, property: string) => accumulator + parseFloat((<any>slotContainerComputedStyle)[property].replace('px', '')), 0).toString();

    if(slotContainerHeight !== cachedSlotContainerHeight){
      cachedSlotContainerHeight = slotContainerHeight;
      isInitialExpanded = props.isExpanded;

      let componentStyle: HTMLElement | null = document.getElementById(props.id + '-style');

      maxHeight = props.config?.maxHeight ? `max-height: min(${props.config?.maxHeight}, ${slotContainerHeight}px);` : `max-height: ${slotContainerHeight}px;`

      if (!componentStyle) {
        componentStyle = document.createElement('style');
        componentStyle.id = props.id + '-style';
        document.head.appendChild(componentStyle);
      }

      componentStyle.innerText = `.${props.id + '-style'} {${props.isExpanded ? maxHeight : 'max-height: 0px;'}transition: max-height 200ms ease-in-out;}`;

      cssClass.value = {[props.id + '-style']: true};
    }
  }
}
</script>

<template>
  <div :id="id" class="accordion" :class="aggregateClass" :style="style">
    <div ref="slotContainer">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.accordion {

}
</style>