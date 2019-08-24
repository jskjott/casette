<template>
	<div id="app">
		<Menu @audioTest="testNote"></Menu>
		<Casette @note="note"> </Casette>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IO, IOType } from './scripts/io'

import Menu from './components/Menu.vue'
import Casette from './components/Casette.vue'

let io: IOType

export default Vue.extend({
	name: 'app',
	components: {
		Menu,
		Casette,
	},
	data() {
		return {
			io,
		}
	},
	watch: {},
	mounted() {
		this.io = new IO(this)
		this.io.start()
	},
	methods: {
		testNote: function() {
			this.midi(42)
		},
		note(data: number) {
			this.midi(data)
		},
		midi: function(number: number) {
			const convertedNote = [
				'C',
				'Db',
				'D',
				'Eb',
				'E',
				'F',
				'Gb',
				'G',
				'Ab',
				'A',
				'Bb',
				'B',
			][number % 12]

			const channel = 0
			const octave = 2
			const note = convertedNote
			const velocity = 100
			const length = 7

			this.io.midi.clear()
			this.io.midi.send({ channel, octave, note, velocity, length })

			this.io.setIp('127.0.0.1')
			this.io.run()
		},
	},
})
</script>

<style>
@font-face {
	font-family: 'titillium_webbold';
	src: url('assets/titilliumweb-bold-webfont.woff2') format('woff2'),
		url('assets/titilliumweb-bold-webfont.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}

@font-face {
	font-family: 'open_sansregular';
	src: url('assets/opensans-regular-webfont.woff2') format('woff2'),
		url('assets/opensans-regular-webfont.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}

h3,
h2,
h1 {
	font-family: 'titillium_webbold';
	margin-bottom: 1rem;
}

* {
	margin: 0;
	background-color: #1d1d1d;
	font-family: 'open_sansregular';
}

*::-webkit-scrollbar {
	/* WebKit */
	width: 0;
	height: 0;
}

body {
}

p {
	font-family: 'open_sansregular';
	margin-bottom: 1rem;
}

a {
	color: inherit;
}

svg {
	display: block;
}

#header {
	height: 100px;
	width: auto;
}

#app {
	display: grid;
	grid-template-rows: 100px 300px;
	line-height: 1.6;
}
</style>
