const pokemonList = document.querySelector("#pokemonList");
let url = "https://rickandmortyapi.com/api/character/";
//Limitar la cantidad de personajes por carga
let limit = 20;
let offset = 0;

//funciones para mostrar/borrar el mensaje 'Cargando...'
function showLoading(){
    const loadingMessage = document.createElement('p');
    loadingMessage.id = 'loadingMessage';
    loadingMessage.textContent = 'Cargando...';
    pokemonList.appendChild(loadingMessage);
}

    // borrar mensaje
function hideLoading(){
    const loadingMessage = document.querySelector('#loadingMessage');
    if (loadingMessage){
        //coloca un delay de medio segundo para eliminar el mensaje 'Cargando...'
        setTimeout(()=> {
            loadingMessage.remove();
        }, 500);
        loadingMessage.remove();
    }
}

//Consumo de la API por metodo fetch y uso de async/await
async function loadCharacters() {
    pokemonList.innerHTML = "";
    showLoading();

    //Codigo necesario para poder evitar la carga inmediata de los elementos
    //y asi poder mostrar el mensaje de carga durante mas tiempo
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        
    for (let i = offset + 1; i <= offset + limit; i++) {
        const response = await fetch(url + i)
        const data = await response.json();
        showPokemon(data);
    }
    //se anaden los botones de navegacion en la primera carga 
    addNavigationButtons();
} catch (error){
    console.error ("Error cargando Personaje", error);
}finally {
    hideLoading();
}
}

    //Estructura dinamica de html para presentar los personajes 
    //(permanecen las mismas clases de la api pokemon para ahorrar tiempo)
function showPokemon(character) {
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
    <div class="pokemonImg">
        <img src="${character.image}" alt="${character.name}">
    </div>
    <div class="info">
        <div class="nameContainer">
            <h3 class="pokemonName">${character.name}</h3>
        </div>
        <p class="id">#${character.id}</p>
    </div>`;
    pokemonList.append(div);

    }


    //Se crea la funcion donde se generan los botones
function addNavigationButtons() {
    const buttonContainer = document.getElementById("buttonContainer");
    // limpiar la lista anterior
    buttonContainer.innerHTML = "";

    // Botones creados junto con sus clases y los "listeners" para 
    //las acciones de cada boton
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

    //funciones que entran en accion al hacer click en los botones 
    //de navegacion
function loadNextPokemons() {
    offset += limit;
    loadCharacters();
}

function loadPrevPokemons() {
    if (offset >= limit) {
        offset -= limit;
        loadCharacters();
    }
}

// Cargado inicial
loadCharacters();
