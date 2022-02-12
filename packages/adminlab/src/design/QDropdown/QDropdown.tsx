import { defineComponent } from "vue";

export default defineComponent({
	name: "QuasarDropdown",
	inheritAttrs: false,
	setup(props, { attrs, slots }) {
		return () => <q-btn-dropdown {...attrs}>
			<q-list>
				{slots.default?.()}
			</q-list>
		</q-btn-dropdown>
	},
})
