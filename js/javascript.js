const pokemonList = document.querySelector("#pokemonList");
let url = "https://pokeapi.co/api/v2/pokemon/";
//Limitar la cantidad de personajes por carga
let limit = 20;
let offset = 0;

//funciones para mostrar/borrar el mensaje 'Cargando...'
function showLoading() {
    const existingLoadingMessage = document.querySelector('#loadingMessage');
    if (!existingLoadingMessage){
        const loadingMessage = document.createElement('p');
        loadingMessage.id = 'loadingMessage';
        loadingMessage.textContent = 'Cargando...';
        pokemonList.appendChild(loadingMessage);
    }
    
}

    // borrar mensaje
function hideLoading() {
    const loadingMessage = document.querySelector('#loadingMessage');
    if (loadingMessage){
        loadingMessage.remove();
    }
}

    //Consumo de la API por metodo fetch y uso de promises
function fetchPokemonData(i) {
    return new Promise((resolve, reject) => {

        showLoading();
        //consulta a la api 
        fetch(url + i)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();//devuelve la respuesta en formato json
        })
        //retraso de 1 segundo para mostrar el mensaje de carga mas tiempo
        .finally(() => {
            setTimeout(hideLoading, 1000);
        })
        .then(resolve)// donde recibe los datos del json
        .catch(reject); //donde recibe el error en caso tal
        
        
    });
}

function loadPokemons() {
    pokemonList.innerHTML = "";//vacia la pantalla de pokemones existentes
    //constante donde se almacenan los datos del fetch, en forma de array
    const promises = [];
    //loop para incluir los datos del fecth dentro de la variable promises
    for (let i = offset + 1; i <= offset + limit && i <= 1017; i++) {
        promises.push(fetchPokemonData(i));
    }
    //con este segmento de codigo se esperala llegada de los datos
    //y luego se almacena el bloque de 20 en dataArray, para luego 
    //recorrer uno auno cada pokemon y mostrarlos en la pagina
    Promise.all(promises)
        .then((dataArray)=>{
            dataArray.forEach((data)=>{
                showPokemon(data);
            });
            //compara si el ultimo pokemon mosntrado corresponde con el 
            // ID esperado
            const lastPokemon = dataArray[dataArray.length - 1];
            if (lastPokemon.id === offset + limit || lastPokemon.id === 1017){
                addNavigationButtons();
            }
        })
        .catch((error)=>{
            console.error("Error al cargar Pokemon", error);
        });
}
    //Crea dinamicamente los contenedor del html para mostrar en la pagina,
    // e inserta las variables de la API segun el caso
function showPokemon(poke) {
    
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
    <div class="pokemonImg">
        <img src="${poke.sprites.front_default}" alt="${poke.name}">
    </div>
    <div class="info">
        <div class="nameContainer">
            <h3 class="pokemonName">${poke.name}</h3>
        </div>
        <p class="id">#${poke.id}</p>
    </div>`;
    pokemonList.append(div);

    if (poke.id === offset + limit || poke.id === 1017) {
        addNavigationButtons();
    }
}

    // Botones creados junto con sus clases y los "listeners" para 
    //las acciones de cada boton
function addNavigationButtons() {
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.innerHTML = "";

    const loadNextButton = document.createElement("button");
    loadNextButton.textContent = "Cargar mas";
    loadNextButton.classList.add("loadButton");
    loadNextButton.addEventListener("click", loadNextPokemons);

    const loadPrevButton = document.createElement("button");
    loadPrevButton.textContent = "Cargar anteriores";
    loadPrevButton.classList.add("loadButton");
    loadPrevButton.addEventListener("click", loadPrevPokemons);

    buttonContainer.append(loadPrevButton, loadNextButton);
}

function loadNextPokemons() {
    offset += limit;
    loadPokemons();
}

function loadPrevPokemons() {
    if (offset >= limit) {
        offset -= limit;
        loadPokemons();
    }
}

// Initial load
loadPokemons();
