// Defining Variables
var pokemon = ''
var pokemonEl = document.getElementById('poke-name')
var buttonEl = document.getElementById('button-addon2')
var searchEl = document.getElementById('search-input')
var spriteEl = document.getElementById('poke-sprite')
var attacksEl = document.getElementById('attacks')
var evolutionEl = document.querySelector('.content-right ul')
var descriptionEl = document.getElementById('descript')
var randoEl = document.getElementById("rando")
var siteDescEl = document.querySelector(".site-description")
var pokeInfoEl = document.querySelector(".poke-info")
var musicButtonEl = document.getElementById("music")



musicButtonEl.addEventListener('click', function () {
		var musicPlayerEl = document.getElementById('player');
		if (musicPlayerEl.style.display === "none") {
		  	musicPlayerEl.style.display = "block";
		} else {
			musicPlayerEl.style.display = "none";
		}

})

//Return  ' Please enter the name of a Pokemon. ' if leave empty
buttonEl.addEventListener('click', function () {
  siteDescEl.classList.add('hide');
  pokeInfoEl.classList.remove('hide');
  pokemon = searchEl.value.toLowerCase().trim()
  if (pokemon === '') {
    alert('Please enter the name of a Pokemon.')
    return
  }
  getPokemon(pokemon)
})
function getPokemon(poke) {
  // Return 'Pokemon does not exist.' if no response match
  fetch(`https://pokeapi.co/api/v2/pokemon/${poke}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Pokemon does not exist.");
      }
      return response.json();
    })
    .then((data) => {
      attacksEl.innerHTML = "";
      var pokeName = data.name;
      pokemonEl.textContent = pokeName;
      spriteEl.setAttribute("src", data.sprites.front_default);
      populateMoveList(data);
      populateEvolutionChart(data);
      populateDesc(data);
    })
    .catch((error) => {
      alert(error.message);
    });
}
function populateMoveList(item) {
  for (let i = 0; i < 5; i++){
    fetch(item.moves[i].move.url)
      .then((res) => {
        return res.json();
      })
      .then((movesData) => {
    const li = document.createElement('li')
    li.innerHTML = `<h3>${item.moves[i].move.name.toUpperCase()}</h3>
            <p>${movesData.flavor_text_entries[1].flavor_text}</p>`
      attacksEl.append(li)
      });
  }
  }
function populateEvolutionChart(item) {
  const pokeId = item.id
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeId + 1}/`)
    .then(result => {
      return result.json()
    }).then(evoData => {
      var evoName = evoData.name;
      if (!evoData.evolves_from_species) {
        evolutionEl.innerHTML = `<li>This Pokémon does not evolve</li>`
      } else {
        evolutionEl.innerHTML = `<li><strong>${item.name.toUpperCase()}</strong> evolves into <strong><a id="evoLink" href="#">${evoName.toUpperCase()}</a></strong></li>`
        var evoLink = document.getElementById("evoLink")
        evoLink.addEventListener('click', () => {
          getPokemon(evoName)
        })
      }
    })
}
/*function populateDesc(item) {
  const pokeId = item.id
  var abilityName = ''
  fetch(`https://pokeapi.co/api/v2/ability/${pokeId}/`)
    .then((res) => {
      return res.json();
    })
    .then((descData) => {
      abilityName = descData.name;
    var abilityDesc = descData.effect_entries[1].effect;
    descriptionEl.innerHTML = `<h3>${abilityName}</h3>
                    <p>${abilityDesc}</p>`
    })
    .catch((error) => {
      descriptionEl.innerHTML = `<h3>${abilityName}</h3>
                   <p>No description available</p>`;
    });
}*/
function populateDesc(item) {
  var abilityName = "";
  // Check if the Pokemon has an ability listed in the API
  if (!item.abilities || item.abilities.length === 0) {
    descriptionEl.innerHTML = `<p>No ability available</p>`;
    return;
  }
  // Get the ability name from the Pokemon data
  abilityName = item.abilities[0].ability.name;
  fetch(`https://pokeapi.co/api/v2/ability/${abilityName}/`)
    .then((res) => {
      return res.json();
    })
    .then((descData) => {
      var abilityDesc = descData.effect_entries[1].effect;
      descriptionEl.innerHTML = `<h3>${abilityName}</h3>
                                  <p>${abilityDesc}</p>`;
    })
    .catch((error) => {
      descriptionEl.innerHTML = `<h3>${abilityName}</h3>
                                 <p>No description available</p>`;
    });
}
randoEl.addEventListener("click", function () {
  siteDescEl.classList.add('hide');
  pokeInfoEl.classList.remove('hide');
  var randomIndex = Math.floor(Math.random() * 999);
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomIndex}`)
    .then((response) => response.json())
    .then((data) => {
      // Select a random pokemon from the list
    attacksEl.innerHTML = "";
      // Display the pokemon's name and sprite
      var pokeName = data.name;
      pokemonEl.textContent = pokeName;
    spriteEl.setAttribute("src", data.sprites.front_default);
     populateMoveList(data);
     populateEvolutionChart(data);
     populateDesc(data);
    })
    .catch((error) => {
      alert(error.message);
    });
});
// added embedded youtube player with video that plays pokemon themed music
function youtubePlayer() {
  var player = document.getElementById('player')
  player.innerHTML = `<iframe width="350" height="250"
src="https://www.youtube.com/embed/YMEblRM4pGc?autoplay=1&mute=1">
</iframe>`;
}
youtubePlayer()