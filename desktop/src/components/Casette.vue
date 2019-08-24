<template>
	<div id="Casette">
		<div id="plate">
			<div v-for="(sentence, sentenceIndex) in sentences">
				<span v-for="(letter, charIndex) in sentence">
					<span :class="highlights[sentenceIndex][charIndex]">{{
						letter
					}}</span>
				</span>
			</div>
		</div>
		<button v-on:click="start"></button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

const sentences = [
	'meta hyper flux coil ',
	'flux meta hyper coil ',
	'meta super coil flux ',
	'met super flux hyper ',
]

const sentenceLength = sentences[0].length

const highlights = [
	new Array(sentenceLength).fill('inactive'),
	new Array(sentenceLength).fill('inactive'),
	new Array(sentenceLength).fill('inactive'),
	new Array(sentenceLength).fill('inactive'),
]

export default Vue.extend({
	name: 'Casette',
	props: [],
	data() {
		return {
			sentences,
			highlights,
		}
	},
	methods: {
		tick: function() {
			const split = this.sentences.map(sentence => {
				return sentence.split('')
			})

			this.shift(split)
			this.highlight(split)
			this.$forceUpdate()
		},
		start: function() {
			setInterval(this.tick, 500)
		},
		shift: function(split: string[][]) {
			split.forEach((sentence, i) => {
				let letter

				if (i % 2 === 0) {
					letter = sentence.shift()
				} else {
					letter = sentence.pop()
				}

				if (typeof letter === 'string') {
					if (i % 2 === 0) {
						sentence.push(letter)
					} else {
						sentence.unshift(letter)
					}
				}

				this.sentences[i] = sentence.join('')
			})
		},
		highlight: function(split: string[][]) {
			split.forEach((sentence, senIndex) => {
				sentence.forEach((char, charIndex) => {
					const upperIndex = (senIndex + 1) % 4
					const lowerIndex =
						senIndex - 1 < 0 ? split.length - 1 : senIndex - 1
					if (split[upperIndex][charIndex] === char) {
						this.highlights[senIndex][charIndex] = 'active'
						this.note(char.charCodeAt(0))
					} else {
						this.highlights[senIndex][charIndex] = 'inactive'
					}
					if (split[lowerIndex][charIndex] === char) {
						this.highlights[senIndex][charIndex] = 'active'
						this.note(char.charCodeAt(0))
					} else {
						this.highlights[senIndex][charIndex] = 'inactive'
					}
				})
			})
		},
		note: function(number: number) {
			this.$emit('note', number)
		},
	},
	mounted() {},
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

span {
	font-family: 'vt323regular';
}

div {
	background-color: #252525;
	color: silver;
}

button {
	background-color: #717171;
	border-radius: 1rem;
	font-size: 20px;
	color: #343434;
	font-family: 'titillium_webbold';
}

#Casette {
	display: grid;
	justify-content: center;
	align-content: center;
	width: 100%;
	height: 300px;
	background-color: #f0fff0;
}

#plate {
	padding: 20px;
}

.active {
	color: yellow;
}
</style>
