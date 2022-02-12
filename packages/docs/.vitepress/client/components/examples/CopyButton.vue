<template>
  <div>
    <q-btn icon="mdi-content-copy" flat round color="blue-grey-5" @click="copy">
      <q-tooltip>复制到剪切板</q-tooltip>
    </q-btn>

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-chip
        square
        dense
        class="absolute copy-button-tip"
        text-color="black"
        v-show="copied"
        color="blue-grey-1"
      >
        <q-avatar icon="done" color="info" text-color="white" />
        已复制
      </q-chip>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.className = "fixed-top";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);
}

export default defineComponent({
  setup(props) {
    const copied = ref(false);
    let timer;

    return {
      copied,
      copy: () => {
        copyToClipboard(props.text);
        copied.value = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
          copied.value = false;
        }, 1500);
      },
    };
  },

  props: {
    text: String,
  },
});
</script>

<style scoped lang="less">
.copy-button-tip {
  top: 8px;
  right: 50px;
  width: 69px;
  max-width: none;
}
</style>
