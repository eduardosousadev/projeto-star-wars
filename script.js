// --> Criando uma variável para armazenar a URL da API, ou seja, o endpoint da API que iremos usar para fazermos a requisição e obter os dados da API
let currentPageUrl = 'https://swapi.dev/api/people/'

// --> Usar a função window.onload, ela é chamada sempre que uma página for chamada, carregada. Ela armazenará uma arrow function, e dentro dela, iremos chamar uma outra função que será responsável por fazer a requisição a API que estamos utilizando para gerar os nossos cards. Utilizaremos o conceito de try catch para verificação da execução da função. Dentro do bloco try chamaremos a função loadCharacters,  onde sua função é pegar a URL da API utilizada e fará uma requisição com essa URL, vai trazer os resultados e transformá-los em cards
window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch(error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    // O .addEventListener irá monitorar eventos neste elemento
    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)

};

// --> Criando o corpo da função loadCharacters
async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; 
    // limpar os resultados anteriores antes de gerar os próximos. O .innerHTML modifica o HTML que estar dentro desse elemento

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            //O .createElement() basicamente cria uma nova tag HTML
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
            card.className = "cards"
            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"
            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`
            // O .innetText modifica o conteúdo de texto

            // --> Organizando a hierarquia das classes
            // O .appendChild() tem a função de inserir um elemento dentro de um outro elemento
            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = '' // Limpando todo o conteúdo que tiver dentro da div id="modal-content"

                const characterImage = document.createElement("div") // Criando uma div
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = "character-image" // Criando uma classe="character-image" dentro da div que acabanos de criar

                const name = document.createElement("span") // Criando um span
                name.className = "character-details" // Criando uma classe="character-dateils" para a tag span que acabamos de criar
                name.innerText = `Nome: ${character.name}` // Colocando um texto dentro da tag span utulizando o template String.

                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement("span")
                mass.className = "character-details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                if(character.eye_color === "blue-gray") {
                    eyeColor.innerText = `Cor dos olhos: azul acinzentado`
                } else {
                    eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`
                }

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            const mainContent = document.getElementById('main-content')
            mainContent.appendChild(card)
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;  //botão estará habilitado, caso não tenha o previous, o botão estará deshabilitado.

        // --> Manipulamos o id #backButton utilizando um operador ternário: 
        // Existe o response.previous?, se sim, altere a propriedade visibility para "visible", se não: permaneça "hidden", escondido.
        backButton.style.visibility = responseJson.previous? "visible" : "hidden";

        currentPageUrl = url;

    } catch(error) {
        alert('Erro ao carregar os personagens')
        console.log(error)
    }
}

async function loadNextPage() {
    if(!currentPageUrl) return;

    try {
        // Será feito a requisição com o fetch, essa requisição é armazenada na variável response, em seguida pegamos essa requisição, transformamos em JSON  e armazenamos na variável responseJson.
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.next)
    } catch(error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

async function loadPreviousPage() {
    if(!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.previous)
    } catch(error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden";
}

function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknown: "descolhecida"
    };

    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
    if(height === "unknown") {
        return "desconhecida"
    }

    return (height / 100).toFixed(2) + " m"; // O .toFixed(2) estar definindo o resultado com duas casas decimais
}

function convertMass(mass) {
    if(mass === "unknown") {
        return "desconhecido"
    }

    return `${mass} kg`
}

function convertBirthYear(birthYear) {
    if(birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}