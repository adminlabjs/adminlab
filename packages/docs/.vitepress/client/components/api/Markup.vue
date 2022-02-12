<template>
	<div v-if="!ts" v-html="getContent()"></div>
	<pre v-else><code style="padding: 0" class="language-typescript" v-html="getContent()"></code></pre>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Prism from "prismjs"
import markdownIt from "markdown-it";

const md = markdownIt({
	html: true,
	linkify: true,
	typographer: true,
})

export default defineComponent({
	setup(props) {
		const markdown = (content: string) => md.render(content);
		const highlight = (content: string) => Prism.highlight(String(content || ""), Prism.languages.typescript);

		return {
			getContent: () => {
				const { content, ts } = props;
				return props.ts ? highlight(content) : markdown(content)
			}
		}
	},

	props: {
		content: [String, Boolean, Number, Function, Object],
		type: String,
		ts: Boolean,
	}
});
</script>
