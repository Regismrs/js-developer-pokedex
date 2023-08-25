const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const overlayer = document.getElementById('overlayer')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="showDetails('${pokemon.number}')">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonToCardDetails(pokemon) {
    const statsSection = pokemon.stats.reduce((acc, item) => {
           return acc + `<span>
                    <b>${item.stat.name}</b>
                    <meter value="${item.base_stat}" min="0" max="110" low="30" high="60" optimum="90"></meter>
                </span>`}, "")
    
    const movesSection = pokemon.moves.splice(0, 7).reduce((acc, item) => {
        return acc + `<span>${item.move.name}</span>`}, "")

    return `<div class="card-detail">
                <div class="header gradient ${pokemon.types[0].type.name}">
                    <div style="display:flex; justify-content: space-between">
                        <h1 class="jpn-name">${pokemon.specie.names[0].name}</h1>
                        <h2 class="number">#${pokemon.id}</h3>
                    </div>
                    <h1 class="name">${pokemon.name}</h1>
                    <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}" class="photo">
                    <img src="assets/imgs/pokeball-stencil.png" class="stencil">
                </div>
                <div class="body">
                    <nav>
                        <a id="about" onclick="showTab('about')" class="active">About</a>
                        <a id="stats" onclick="showTab('stats')">Stats</a>
                        <a id="moves" onclick="showTab('moves')">Moves</a>
                    </nav>
                    <div id="about-tab">
                        <b>Physics</b>
                        <span><b>Weight</b> ${(pokemon.weight / 10).toFixed(1)} Kg</span>
                        <span><b>Height</b> ${(pokemon.height / 10).toFixed(2)} m</span>
                        <b>Specie</b>
                        <span><b>Habitat</b> ${pokemon.specie.habitat.name}</span>
                        <b>Quote</b>
                        <span><cite>${pokemon.specie.flavor_text_entries[0].flavor_text}</cite></span>

                    </div>
                    <div id="stats-tab">
                        ${statsSection}
                    </div>
                    <div id="moves-tab">
                        ${movesSection}
                    </div>
                </div>
            </div>`
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        loadMoreButton.innerHTML = "load more"
    })
}

async function showDetails(id) {
    let pokemon = await pokeApi.getPokemonDetailById(id)
    pokemon.specie = await pokeApi.getPokemonSpecieDetailById(id)

    overlayer.style.display = "flex"
    overlayer.innerHTML = convertPokemonToCardDetails(pokemon)
}

function hideDetails() {
    overlayer.innerHTML = ''
    overlayer.style.display = "none"
}

function showTab(tabId) {
    const el = document.getElementsByClassName('active')[0] || document.getElementById('about')

    document.getElementById(`${el.id}-tab`).style.display = 'none'
    el.className = ''

    // Nav
    document.getElementById(tabId).className = 'active'
    // Tab
    const tabActive = document.getElementById(`${tabId}-tab`)
    tabActive.style.display = 'block'
}

loadPokemonItens(offset, limit)

overlayer.addEventListener('click', (evt) => { 
    if (evt.target.id == "overlayer") hideDetails();
})

loadMoreButton.addEventListener('click', () => {
    loadMoreButton.innerHTML = `<img src="assets/imgs/loading.gif" width="48" height="48">`
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})