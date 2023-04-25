// Defining Variables
var pokemon = ''
var pokemonEl = document.getElementById('poke-name')
var buttonEl = document.getElementById('button-addon2')
var searchEl = document.getElementById('search-input')
var spriteEl = document.getElementById('poke-sprite')
var shinyEl = document.getElementById('poke-sprite-shiny')
var attacksEl = document.getElementById('attacks')
var evolutionEl = document.querySelector('.evolution ul')
var descriptionEl = document.getElementById('descript')
var randoEl = document.getElementById("rando")
var siteDescEl = document.querySelector(".site-description")
var pokeInfoEl = document.querySelector(".poke-info")
var musicButtonEl = document.getElementById("music")
var historyButton = document.getElementById('history');
var historyList = document.getElementById('search-history');
var musicButton = document.getElementById('music');
var shinyToggle = document.getElementById('shinyToggle');
var musicPlayer = document.getElementById('player');
var historyBtn = document.querySelector('#history');
var lastKey = ''
//get existing history element
var pastSearches = [];
var pastSearchesEl = document.getElementById("history");
function displayPastSearches() {
  pastSearchesEl.innerHTML = "";
  pastSearches.forEach((search) => {
    var pastSearchItem = document.createElement("p");
    pastSearchItem.textContent = search;
  });
}
//recall searched pokemon and show data
function recallPokemon(index) {
  const pokemonName = pastSearches[index];
  getPokemon(pokemonName);
}
pastSearchesEl.addEventListener("click", function (event) {
  const target = event.target;
  if (target.tagName.toLowerCase() === "p") {
    const index = Array.from(pastSearchesEl.children).indexOf(target);
    recallPokemon(index);
  }
});
//Return  'Please enter the name of a Pokemon.' if leave empty
buttonEl.addEventListener("click", function () {
  pokemon = searchEl.value.toLowerCase().trim();
  if (pokemon === "") {
    resetToDefaultPage();
    displayErrorMessage("Please enter the name of a Pokemon.");
    return;
  }
  getPokemon(pokemon)
    .then(() => {
      siteDescEl.classList.add("hide");
      pokeInfoEl.classList.remove("hide");
    })
    .catch((error) => {
      displayErrorMessage(error.message);
    });
});
function addToSearchHistory(pokemon) {
  // Check if the Pokemon already exists in the search history
  const pokemonExists = pastSearches.some(
    (search) => search.toLowerCase() === pokemon.toLowerCase(),
  )
  // If the Pokemon does not exist in the search history, add it
  if (!pokemonExists) {
    pastSearches.push(pokemon);
    displayPastSearches();
  }
}
//reset the page elements to their original state
function resetToDefaultPage() {
  siteDescEl.classList.remove("hide");
  pokeInfoEl.classList.add("hide");
  searchEl.value = "";
  attacksEl.innerHTML = "";
  evolutionEl.innerHTML = "";
  descriptionEl.innerHTML = "";
  pokemonEl.textContent = "";
  spriteEl.removeAttribute("src");
}
// Return 'Pokemon does not exist.' if no response match
function getPokemon(poke) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${poke}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Pokemon does not exist.");
      }
      return response.json();
    })
    .then((data) => {
      attacksEl.innerHTML = "";
      var pokeName = data.name;
      pokemonEl.textContent = capitalizeFirstLetter(pokeName);
      spriteEl.setAttribute(
        "src",
        data.sprites.other["official-artwork"].front_default
      );
      shinyEl.setAttribute(
        "src",
        data.sprites.other["official-artwork"].front_shiny
      );
      populateMoveList(data);
      populateEvolutionChart(data);
      addToSearchHistory(pokemon);
      populateDesc(data);
      localStorage.setItem(data.id, pokeName);
    });
}
//get existing history element
var pastSearches = [];
var pastSearchesEl = document.getElementById("history");
function displayPastSearches() {
  pastSearchesEl.innerHTML = "";
  pastSearches.forEach((search) => {
    var pastSearchItem = document.createElement("p");
    pastSearchItem.textContent = search;
    pastSearchesEl.appendChild(pastSearchItem);
  });
}

historyBtn.addEventListener('click', showHistory);
function showHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  if (searchHistory && searchHistory.length > 0) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    searchHistory.forEach((pokemon, index) => {
      const pokemonBtn = document.createElement('button');
      pokemonBtn.classList.add('pokemon-btn');
      pokemonBtn.textContent = pokemon.name;
      pokemonBtn.addEventListener('click', () => recallPokemon(index));
      modalContent.appendChild(pokemonBtn);
    });
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
}
//Get pokemon's Move list
function populateMoveList(item) {
  for (let i = 0; i < 5; i++){
    fetch(item.moves[i].move.url)
      .then((res) => {
        return res.json();
      })
      .then((movesData) => {
    const li = document.createElement('li')
    li.innerHTML = `<h3>${capitalizeFirstLetter(`${item.moves[i].move.name}`)}</h3>
            <p>${movesData.flavor_text_entries[1].flavor_text}</p>`
      attacksEl.append(li)
      });
  }
  }
//Get pokemon's ability
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
 // Check if the Pokemon has an ability listed in the API
function populateDesc(item) {
  var abilityName = "";
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
      descriptionEl.innerHTML = `<h3>${capitalizeFirstLetter(`${abilityName}`)}</h3>
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
      pokemonEl.textContent = capitalizeFirstLetter(pokeName);
    spriteEl.setAttribute("src", data.sprites.other['official-artwork'].front_default);
  shinyEl.setAttribute("src", data.sprites.other['official-artwork'].front_shiny);
     populateMoveList(data);
     populateEvolutionChart(data);
     populateDesc(data);
    })
    .catch((error) => {
    displayErrorMessage(error.message);
    });
});
// Toggle the music player from hide and show
var isPlayerVisible = false;
musicButton.addEventListener('click', () => {
  if (isPlayerVisible) {
    musicPlayer.classList.add('hide');
    isPlayerVisible = false;
  } else {
    musicPlayer.classList.remove('hide');
    isPlayerVisible = true;
  }
});
var shiny = false;
shinyToggle.addEventListener('click', () => {
  if (shiny) {
    shinyEl.classList.add('hide');
  spriteEl.classList.remove('hide');
    shiny = false;
  shinyToggle.style.backgroundColor="white";
  } else {
    shinyEl.classList.remove('hide');
  spriteEl.classList.add('hide');
    shiny = true;
  shinyToggle.style.backgroundColor="#8EEBFC";
  }
});
//Getting error message
function displayErrorMessage(message) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);
  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}
// Function created to have the first letter of the string as an upper case letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// added embedded youtube player with video that plays pokemon themed music
function youtubePlayer() {
  var player = document.getElementById('player')
  player.innerHTML = `<iframe width="350" height="250"
src="https://www.youtube.com/embed/YMEblRM4pGc?autoplay=1&mute=1">
</iframe>`;
}
youtubePlayer()