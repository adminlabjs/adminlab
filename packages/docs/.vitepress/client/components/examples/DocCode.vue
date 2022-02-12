<script lang="ts">
import { defineComponent, h, ref } from "vue";
import CopyButton from "./CopyButton.vue";

export default defineComponent({
  setup(props) {
    const className = `language-${props.type}`;
    let { html } = props;
    html = decodeURIComponent(html);

    const makeContent = () => {
      return html.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<");
    };

    return () =>
      h("div", {
        class: "relative-position"
      }, [
        h(
          "pre",
          {
            class: `doc-code ${className}`,
          },
          h("code", {
            class: className,
            innerHTML: html,
          })
        ),
        h(CopyButton, {
          class: "copy-button",
          text: makeContent(),
        }),
      ]);
  },

  props: {
    html: String,
    type: String,
  },
});
</script>

<style lang="less">
.doc-code {
  padding: 16px 19px;
  position: relative;
  margin: 0 !important;
  background: #fafafa !important;

  code {
    color: #000 !important;
  }
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
