// Defining Varibles
var pokemon = ''
var pokemonEl = document.getElementById('poke-name')
var buttonEl = document.getElementById('button-addon2')
var searchEl = document.getElementById('search-input')
var spriteEl = document.getElementById('poke-sprite')

// buttonEL.addEventListener('click', function () {
// 	pokemon = searchEl.value.toLowerCase()
// 	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			var pokeName = data.name
// 			pokemonEl.textContent = pokeName
// 			spriteEL.setAttribute('src', data.sprites.front_default)
// 		})
// })

//Return  ' Please enter the name of a Pokemon. ' if leave empty
buttonEl.addEventListener('click', function () {
	pokemon = searchEl.value.toLowerCase().trim()
	if (pokemon === '') {
		alert('Please enter the name of a Pokemon.')
		return
	}
	// Return 'Pokemon does not exist.' if no response match
	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Pokemon does not exist.')
			}
			return response.json()
		})
		.then((data) => {
			var pokeName = data.name
			pokemonEl.textContent = pokeName
			spriteEl.setAttribute('src', data.sprites.front_default)
		})
		.catch((error) => {
			alert(error.message)
		})
})
