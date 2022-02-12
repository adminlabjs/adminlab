<template>
	<div class="full-width">
		<q-table
			:rows="rows"
			:columns="columns"
			hide-pagination
			row-key="name"
			:pagination="{ rowsPerPage: 0 }"
			:square="isChild"
			:flat="isChild"
		>
			<template #body="props">
				<q-tr :props="props">
					<!-- name -->
					<q-td v-if="props.colsMap.name" auto-width>
						<pre style="font-size: 15px" class="text-blue">{{ props.row.name }}</pre>
					</q-td>

					<!-- type -->
					<q-td v-if="props.colsMap.type" auto-width>
						<div class="a-flex items-center">
							<div class="q-mr-sm">
								<q-btn
									v-if="props.row.children && props.row.children.length && expand"
									size="sm"
									color="accent"
									round
									dense
									@click="props.expand = !props.expand"
									:icon="props.expand ? 'remove' : 'add'"
									style="flex: none"
								/>
							</div>
							<markup ts :content="getType(props.row.type)"></markup>
						</div>
					</q-td>

					<q-td v-if="props.colsMap.default" auto-width>
						<markup ts :content="props.row.default || 'undefined'"></markup>
					</q-td>

					<!-- description -->
					<q-td v-if="props.colsMap.description" class="api-section-description">
						<markup :content="props.row.description"></markup>
					</q-td>
				</q-tr>

				<q-tr v-if="props.row.children" v-show="props.expand" :props="props">
					<q-td colspan="100%" class="api-section-child">
						<api-section :apiData="props.row.children" :type="type" is-child></api-section>
					</q-td>
				</q-tr>
			</template>

			<template v-slot:top v-if="apiData && apiData.length > 1">
				<q-input
					v-model="filter"
					placeholder="输入关键字，支持所有列的模糊查询"
					label="搜索"
					clearable
					rounded
					class="full-width"
					dense
				>
					<template v-slot:prepend>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
		</q-table>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, capitalize, computed } from "vue";
import { useData } from 'vitepress'
import Markup from "./Markup.vue";

const FIELD_MAP = {
	name: "属性名",
	type: "类型",
	description: "描述",
	default: "默认值"
}

const COLUMNS = {
	props: ["name", "type", "default", "description"],
	methods: ["name", "type", "description"],
	slots: ["name", "description"],
	events: ["name", "type", "description"]
}

export default defineComponent({
	name: "ApiSection",

	setup(props) {
		const filter = ref("");
		let expand = ref(false);

		const genTableProps = (data: any[]) => {
			const type = props.type;

			const columns = COLUMNS[type] ? COLUMNS[type].map(key => ({
				field: key,
				name: key,
				label: FIELD_MAP[key] || capitalize(key),
				align: "left",
			})) : []

			const allowed = Object.keys(FIELD_MAP);

			const rows = computed(() => {
				const keyword = (filter.value || "").toLowerCase();

				return keyword ? data.filter(item => {
					const values = Object.values(item);
					for (let i = 0; i < values.length; i++) {
						const val = values[i];
						if (val.toString().toLowerCase().indexOf(keyword) > -1) return true;
					}
					return false;
				}) : data;
			})

			const _rows = rows.value;
			for (let i = 0; i < _rows.length; i++) {
				const row = _rows[i];
				if (Array.isArray(row.children) && row.children.length) {
					expand.value = true;
					break;
				}
			}

			return {
				columns,
				rows,
			};
		};

		const { columns, rows } = genTableProps(props.apiData);

		return {
			filter,

			columns,
			rows,
			expand,

			getType: (value: string | string[]) => {
				return Array.isArray(value) ? value.join(' | ') : value
			},
		};
	},

	props: {
		type: {
			type: String,
			default: ""
		},

		apiData: {
			type: Array,
			default: [],
		},

		title: String,
		isChild: Boolean,
	},

	components: {
		Markup
	}
});
</script>

<style lang="scss">
.api-section-child {
	// padding: 10px 0 10px 0 !important;
}

.table-filed {
	width: 100px;
}

.api-section-description {
	color: #000;
	width: 100px;
}
</style>
