<script setup lang="ts">
import type {Behavior, TooltipConfig} from '@/models';
import {Alignment} from '@/models';
import {BindingService} from '@/services';

const props = defineProps<{
  id: string
}>();

const bindingService: BindingService = BindingService.instance();

function getTooltipConfig(behavior: Behavior): TooltipConfig
{
  const tooltip: HTMLElement = document.createElement('div');
  tooltip.classList.add('pad', 'bg-dark-transparent', 'max-w-xs');
  tooltip.innerHTML = `<p>${behavior.tooltip}</p><br><a class="text-sky-500" href="${behavior.href}" target="_blank">${behavior.href}</a>`;

  return {
    content:   tooltip,
    id:        `${props.id}-behavior-${behavior.label.replace(/\s/g, '')}-tooltip`,
    alignment: Alignment.TOP_ARIGHT
  };
}
</script>

<template>
  <div :id="id" class="binding-manager w-full h-full flex">
    <div class="w-72 bg-gray-900 h-full pad overflow-scroll">
      <div>
        <div :id="`${id}-behavior-${behavior.label.replace(/\s/g, '')}-button`"
             class="pad my-2 border-radius border border-solid border-black bg-black transition ease-in-out hover:border-emerald-500 hover:text-emerald-500 flex items-center justify-between"
             v-for="behavior in bindingService.behaviors.value" role="button" :key="behavior.label.replace(/\s/g, '')">
          <p>{{ behavior.label }}</p>
          <div class="inline-block relative" v-tooltip="getTooltipConfig(behavior)">
            <i class="fa-solid fa-circle-info"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="h-full flex-grow flex items-center justify-center">
      <div class="inline-block">
        <p>under construction...</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.binding-manager {

}
</style>
