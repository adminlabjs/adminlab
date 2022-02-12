import { defineComponent } from "vue";

export default defineComponent({
	name: "QuasarDropdownItem",
	inheritAttrs: false,
	setup(props, { attrs }) {
		attrs = Object.assign({}, attrs);

		if (!attrs.disabled) {
			delete attrs.disabled;
		}

		return () => <q-item {...attrs} clickable={!attrs.disabled} v-close-popup>
			<q-item-section>
				<q-item-label>{props.label}</q-item-label>
			</q-item-section>
		</q-item>;
	},
	props: {
		label: {
			type: String,
		}
	}
})
