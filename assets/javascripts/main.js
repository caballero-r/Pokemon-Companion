// Defining Varibles
var pokemon = ''
var pokemonEl = document.getElementById('poke-name')
var buttonEL = document.getElementById('button-addon2')
var searchEl = document.getElementById('search-input')
var spriteEL = document.getElementById('poke-sprite')

buttonEL.addEventListener('click', function () {
	pokemon = searchEl.value.toLowerCase()
	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
		.then((response) => response.json())
		.then((data) => {
			var pokeName = data.name
			pokemonEl.textContent = pokeName
			spriteEL.setAttribute('src', data.sprites.front_default)
		})
})
