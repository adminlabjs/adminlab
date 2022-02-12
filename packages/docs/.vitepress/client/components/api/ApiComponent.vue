<template>
  <div>
    <api-section :apiData="data" :type="type"></api-section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ApiComponent",

  setup(props) {
    const data = JSON.parse(decodeURIComponent(props.data));

    return {
      data,
    };
  },

  props: {
    data: String,
    type: String,
  },
});
</script>
