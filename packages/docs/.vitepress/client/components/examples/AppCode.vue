<template>
  <doc-code :html="html" :type="type"></doc-code>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    html: String,
    type: String,
  },
});
</script>

<style scoped lang="less"></style>
