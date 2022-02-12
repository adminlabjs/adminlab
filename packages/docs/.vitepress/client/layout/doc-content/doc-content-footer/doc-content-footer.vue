<template>
  <div class="overflow-hidden">
    <q-separator class="q-my-lg" />

    <footer-nav></footer-nav>

    <footer-edit-link></footer-edit-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FooterNav from "./nav.vue";
import FooterEditLink from "./edit-link.vue";

export default defineComponent({
  components: {
    FooterNav,
    FooterEditLink,
  }
});
</script>
