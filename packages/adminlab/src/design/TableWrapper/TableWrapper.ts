import { defineComponent, h, ref, watch } from "vue";
import { LoadFail } from "./components";

export default defineComponent({
  name: "ATableWrapper",
  inheritAttrs: false,
	emits: ["reload"],

  setup(props, { slots, emit }) {
		const visible = ref(true);

    return () => {
			let table;

			if (slots.default) {
				table = slots.default();
			}

			const { loading, error } = props;

			watch(() => props.error, () => visible.value = true);
			
      return h(
        "div",
        {
          class: "a-table-wrapper",
        },
        [
					table,
					error && !loading && visible.value ? h(LoadFail, {
						onReload: () => emit("reload"),
						onClose: () => visible.value = false,
					}) : null,
				],
      );
    };
  },

	props: {
		loading: Boolean,
		error: Boolean,
	}
});
