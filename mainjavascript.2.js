const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
    pokemon.speciesUrl = pokeDetail.species.url;

    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokeDetail) => {
            const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
            return {
                number: pokeDetail.id,
                name: pokeDetail.name,
                types: pokeDetail.types.map((typeSlot) => typeSlot.type.name),
                type: pokeDetail.types[0].type.name,
                photo: pokeDetail.sprites.other.dream_world.front_default,
                abilities: abilities,
                speciesUrl: pokeDetail.species.url,
                height: pokeDetail.height,
                weight: pokeDetail.weight
            };
        });
};

pokeApi.getPokemonSpecies = (pokemon) => {
    return fetch(pokemon.speciesUrl)
        .then((response) => response.json());
};

async function getPokemonAbility(abilityUrl) {
    const response = await fetch(abilityUrl);
    const abilityDetail = await response.json();
    return { name: abilityDetail.name };
}

async function openPokemonDetails(pokemon) {
    const pokemonDetailsDiv = document.getElementById('pokemonDetails');

    const species = await pokeApi.getPokemonSpecies(pokemon);

    pokeApi.getPokemonDetail(pokemon)
        .then((detailedPokemon) => {
            pokeApi.getPokemonSpecies(detailedPokemon)
                .then((species) => {
                    pokemonDetailsDiv.innerHTML = `
                        <h2>${detailedPokemon.name}</h2>
                        <p>Number: #${detailedPokemon.number}</p>
                        <p>Type: ${detailedPokemon.type}</p>
                        <p>Types: ${detailedPokemon.types.join(', ')}</p>
                        <p>Abilities: ${detailedPokemon.abilities.join(', ')}</p>
                        <p>Species: ${species.name}</p>
                        <img src="${detailedPokemon.photo}" alt="${detailedPokemon.name}">
                    `;
                    pokemonDetailsDiv.classList.add('pokemon-details-active');
                });
        });
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonSpecies = (pokemon) => {
    return fetch(pokemon.speciesUrl)
        .then((response) => response.json());
};