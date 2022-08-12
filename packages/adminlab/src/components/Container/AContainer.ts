import { setInstanceProperty } from '@/utils/instance';
import { defineComponent, h, onBeforeUnmount, onMounted } from "vue";
import { framework } from "@/framework";
import { useModule, useCore, useProps } from "./modules";

export default defineComponent({
	name: "AContainer",
	inheritAttrs: false,

	setup(props, { attrs, slots }) {
		if (!framework.installed) {
			throw new Error(
				"[Adminlab]: adminlib is not installed, please use `Vue.use` to install"
			)
		}

		const core = useCore();
		const { fetch, search, emitter, state } = core;

		const module = useModule(core);

		setInstanceProperty({
			getTableData: () => state.listData.value,
			fetch,
			search,
		})

		if (slots.default) {
			const defaultSlots = slots.default;
			slots = {
				...slots,
				default: () => module.render(defaultSlots()),
			}
		}

		onMounted(() => {
			fetch();
		})

		onBeforeUnmount(() => emitter.removeAll());

		return () => h("div", null, slots);
	},

	props: useProps(),
})
