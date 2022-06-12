<script setup lang="ts">
import {InitService, ModalService} from '@/services';
import {computed, type ComputedRef} from 'vue';
import {RouterView} from 'vue-router';

const modalService: ModalService = ModalService.instance();
const initService: InitService = InitService.instance();

const isModalOverlayVisible: ComputedRef<boolean> = computed(() => modalService.isModalOverlayVisible.value);
const isModalOverlayClickable: ComputedRef<boolean> = computed(() => modalService.isModalOverlayClickable.value);
const isModalOverlayEscapable: ComputedRef<boolean> = computed(() => modalService.isModalOverlayEscapable.value);

initService.init();

function onClickModalOverlay()
{
  if(isModalOverlayClickable.value)
  {
    modalService.onInteractModalOverlay();
  }
}

window.addEventListener('keyup', (keyboardEvent: KeyboardEvent) =>
{
  if(keyboardEvent.code === 'Escape' && isModalOverlayVisible.value && isModalOverlayEscapable.value)
  {
    modalService.onInteractModalOverlay();
  }
});
</script>

<template>
  <div id="app" class="app w-screen h-screen">
    <RouterView v-if="initService.isInit.value" />
    <div id="app-modal-overlay" class="modal-overlay" v-if="isModalOverlayVisible" @click="onClickModalOverlay"></div>
    <div id="app-tooltip-container" class="hidden animate__animated fixed"></div>
  </div>
</template>

<style>
@import '@/assets/tailwind.css';
@import '@/assets/base.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

</style>
