import { defineComponent, h } from "vue";

export default defineComponent({
	name: "ElementSelect",
	inheritAttrs: false,
	emits: ["refresh"],

	setup(props, { attrs, slots, emit }) {
		return () => {
			const { loading: isLoading, showRefresh } = props;
			const isShowRefresh = showRefresh && !attrs.disabled;

			const makeSelectNode = () => {
				const props = Object.assign({ loading: isLoading }, attrs);

				return h(<el-select {...props}></el-select>, {
					style: (isLoading || isShowRefresh) ? {
						marginRight: "10px"
					} : {}
				}, slots);
			}

			const selectNode = makeSelectNode();

			return h("div", {
				class: "a-flex items-center",
			}, [
				selectNode,
				isLoading ? <el-icon class={"is-loading"} size={20}><loading /></el-icon> : null,
				// todo: 国际化
				isShowRefresh ? h(<el-button type={'text'} loading={isLoading} onClick={() => emit("refresh")}>刷新</el-button>) : null,
			])
		}
	},

	props: {
		loading: Boolean,
		showRefresh: Boolean,
	}
})
