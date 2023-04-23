// Määritellään muuttujat, joita käytetään hakutoiminnossa
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

let pokemonData;
// Funktio, joka hakee datan PokeAPI:sta
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


// Luodaan async-funktio, joka hakee hakutermiä vastaavan Pokemonin tiedot PokeAPI:sta
async function searchPokemon() {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm === "") {
    searchResults.innerHTML = "<p>Please enter a Pokemon name or ID</p>";
    return;
  }

  // Haetaan data PokeAPI:sta vain kerran, jotta ei tarvitse hakea joka kerta uudestaan. Haetaan myös vain ekat 1118 pokemonia.
  if (!pokemonData) {
    pokemonData = await fetchData("https://pokeapi.co/api/v2/pokemon?limit=1118");
  }
// Etsitään hakutermiä vastaava Pokemon
  const pokemon = pokemonData.results.find(p => p.name === searchTerm || p.url.endsWith(searchTerm));
  if (!pokemon) {
    searchResults.innerHTML = "<p>No matching Pokemon found</p>";
    return;
  }
// Haetaan Pokemonin tiedot ja näytetään ne sivulla
  const pokemonUrl = pokemon.url;
  const pokemonDetails = await fetchData(pokemonUrl);
  const image = `<img class="image" src="${pokemonDetails.sprites.front_default}" alt="${pokemon.name}">`;
  const name = `<h2>${pokemon.name}</h2>`;
  const type = `<p>Type: ${pokemonDetails.types[0].type.name}</p>`;
  const abilities = `<p>Abilities: ${pokemonDetails.abilities.map(a => a.ability.name).join(", ")}</p>`;
  searchResults.innerHTML = image + name + type + abilities;
}
// Kutsutaan searchPokemon-funktiota, kun painetaan hakunappia tai painetaan Enter-näppäintä
searchButton.addEventListener("click", searchPokemon);
searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    searchPokemon();
  }
});
