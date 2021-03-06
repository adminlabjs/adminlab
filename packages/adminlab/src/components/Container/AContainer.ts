import { defineComponent, h, onBeforeMount, onBeforeUnmount, getCurrentInstance } from "vue";
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
		const { fetch, emitter, state } = core;

		const module = useModule(core);

		const vm = getCurrentInstance()!;

		Object.assign(vm.proxy, {
			getTableData: () => state.listData.value,
		});

		if (slots.default) {
			const defaultSlots = slots.default;
			slots = {
				...slots,
				default: () => module.render(defaultSlots()),
			}
		}

		onBeforeMount(() => {
			fetch();
		})

		onBeforeUnmount(() => emitter.removeAll());

		return () => h("div", null, slots);
	},

	props: useProps(),
})
