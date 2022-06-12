<script setup lang="ts">
import {computed, type ComputedRef, type Ref, ref, watch} from 'vue';
import type {LayoutManagerConfig, Layout, ControlOption} from '@/models';
import {Alignment} from '@/models';
import {LayoutService} from '@/services';

import Dropdown from '@/components/dropdown.vue';

const props = defineProps<{
  id: string,
  config?: LayoutManagerConfig
}>();

const alignment: any = Alignment;

const layoutService: LayoutService = LayoutService.instance();

const selectedLayout: Ref<Layout> = layoutService.selectedLayout;
const layoutOptions: ComputedRef<ControlOption[]> = computed(() => layoutService.layouts.value.map((layout: Layout) => ({label: layout.name, value: layout})));
const selectedLayoutShape: ComputedRef<boolean[][]> = computed(() =>
                                                          {
                                                            if(selectedLayout.value?.split)
                                                            {
                                                              return selectedLayout.value.shape?.map((row: boolean[]) => {
                                                                const rowRight: boolean[] = [];

                                                                for(let i = row.length - 1; i >= 0; --i) {
                                                                  rowRight.push(row[i]);
                                                                }

                                                                return [...row, false, ...rowRight];
                                                              }) || [];
                                                            }
                                                            else
                                                            {
                                                              return selectedLayout.value?.shape || [] as boolean[][];
                                                            }
                                                          });

function onClickBinding(bindingRow: number, bindingColumn: number) {
  console.log('binding clicked:', bindingRow, bindingColumn);
}
</script>

<template>
  <div :id="id" class="layout-manager w-full h-full flex">
    <div class="w-72 bg-gray-800 h-full pad">
      <Dropdown :id="id + '-layout-dropdown'"
                :options="layoutOptions"
                v-model="selectedLayout"
                  :config="{label: 'Layout', tooltip: {content: 'Select a layout to begin.', alignment: alignment.TOP_ARIGHT, id: id + '-layout-dropdown-tooltip'}}"></Dropdown>
    </div>
    <div class="h-full flex-grow flex items-center justify-center">
      <div class="inline-block">
        <div v-for="(shapeRow, rowIndex) in selectedLayoutShape">
          <div class="inline-block" v-for="(shapeColumn, columnIndex) in shapeRow">
            <button :id="`${id}-row-${rowIndex}-column-${columnIndex}-button`" class="h-10 w-10 border-radius inline-block m-2" :class="{
              'cursor-pointer bg-emerald-800 transition ease-in-out hover:scale-125 hover:bg-emerald-600': shapeColumn,
              'cursor-default': !shapeColumn
            }" @click="onClickBinding(rowIndex, columnIndex)"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.layout-manager {

}
</style>
