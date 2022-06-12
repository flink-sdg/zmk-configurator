<script setup lang="ts">
import LayoutManager from '@/components/layout-manager.vue';
import BindingManager from '@/components/binding-manager.vue';

</script>

<template>
  <div id="home" class="home w-full h-full">
    <div class="key-selector-container h-3/6 bg-gray-900 w-full">
      <LayoutManager id="layout-manager"></LayoutManager>
    </div>
    <div class="map-container h-3/6 bg-black w-full">
      <BindingManager id="binding-manager"></BindingManager>
    </div>
  </div>
</template>
