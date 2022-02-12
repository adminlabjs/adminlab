import { defineComponent, h } from "vue";

export default defineComponent({
	name: "ElementDropdown",
	inheritAttrs: false,

	setup(props, { attrs, slots }) {
		return () => h(<el-dropdown></el-dropdown>, {
			trigger: "click",
			...attrs,
		}, {
			default: () => {
				return <el-button type={props.flat ? 'text' : props.color} icon={"el-icon-search"}>
					{props.label}

					<el-icon>
						<arrow-down></arrow-down>
					</el-icon>
				</el-button>
			},
			dropdown: () => <el-dropdown-menu>
				{slots.default?.()}
			</el-dropdown-menu>
		});
	},

	props: {
		flat: Boolean,
		label: String,
		color: String,
	}
})

