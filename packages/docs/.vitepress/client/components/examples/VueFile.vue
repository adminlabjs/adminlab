<template>
  <div class="q-pa-md col doc-vue-file">
    <ClientOnly>
      <component :is="component"></component>
    </ClientOnly>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    component: Object,
  },
});
</script>
