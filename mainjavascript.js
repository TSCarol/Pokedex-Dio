const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;


function openPokemonDetails(pokemon) {
    const pokemonDetailsDiv = document.getElementById('pokemonDetails');
    pokemonDetailsDiv.innerHTML = `
        <h2>${pokemon.name}</h2>
        <p>Number: #${pokemon.number}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Types: ${pokemon.types.join(', ')}</p>
        <p>Abilities: ${pokemon.abilities.join(', ')}</p>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
    `;
    pokemonDetailsDiv.classList.add('pokemon-details-active');
}

function convertPokemonToLi(pokemon) {
    const liElement = document.createElement('li');
    liElement.classList.add('pokemon', pokemon.type);

    liElement.innerHTML = `
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    `;

    liElement.addEventListener('click', () => {
        openPokemonDetails(pokemon);
    });

    return liElement;
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newElements = pokemons.map(convertPokemonToLi);
        newElements.forEach((element) => {
            pokemonList.appendChild(element);
        });
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});