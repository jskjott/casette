<template>
	<div id="menu">
		<button v-on:click="test">Audio Test</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'Menu',
	methods: {
		test: function() {
			this.$emit('audioTest')
		},
	},
})
</script>

<style scoped>
@font-face {
	font-family: 'titillium_webbold';
	src: url('../assets/titilliumweb-bold-webfont.woff2') format('woff2'),
		url('../assets/titilliumweb-bold-webfont.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}

@font-face {
	font-family: 'vt323regular';
	src: url('../assets/vt323-regular-webfont.woff2') format('woff2'),
		url('../assets/vt323-regular-webfont.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}

h2 {
	font-family: 'titillium_webbold';
}

div {
	background-color: #252525;
	color: silver;
}

button {
	background-color: #aad2aa;
	border-radius: 1rem;
	padding: 0.5rem;
	font-size: 20px;
	color: #343434;
	font-family: 'vt323regular';
}

#menu {
	display: grid;
	justify-content: center;
	align-content: center;
	width: 100%;
	height: 100px;
	background-color: #e8f3e8;
}
</style>
