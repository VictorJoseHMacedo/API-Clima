// Variaveis e Seleção de Elementos
const apiKey = "ee8b8017fc4f9e4c136c96ad89ebb1aa"; // numero da API
const apiCountryURL = ""; // Api das bandeiras dos paises
const apiUnsplash = "https://source.unsplash.com/1600x900/?"; //API das fotos que vão ao background

const cityInput = document.querySelector("#city-input"); // Pegando id da cidade
const searchBtn = document.querySelector("#search"); // Pegando id do search

const cityElement = document.querySelector("#city"); // Pegando id da cidade
const tempElement = document.querySelector("#temperature span"); // Pegando id da temperatura
const descElement = document.querySelector("#description"); // Pegando id da descrição
const weatherIconElement = document.querySelector("#weather-icon"); // Pegando id do icone da temperatura
const countryElement = document.querySelector("#country"); // Pegando id da bandeira do pais
const umidityElement = document.querySelector("#umidity span"); // Pegando id da umidade
const windElement = document.querySelector("#wind span"); // Pegando id do vento

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message"); // Pegando id da mensagem de erro
const loader = document.querySelector("#loader"); // Pegando id do botão de carregar

const suggestionContainer = document.querySelector("#suggestions"); // Pegando id que sugere paises
const suggestionButtons = document.querySelectorAll("#suggestions button"); // Pegando id dos botões que sugere paises

// Loader
const toggleLoader = () => { // Botão de carregar
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => { // Essa função é responsável por ocultar informações anteriores na interface do usuário relacionadas aos dados do clima
  errorMessageContainer.classList.add("hide"); // Ocultará ou esconderá visualmente o elemento na interface do usuário.
  weatherContainer.classList.add("hide"); // Ocultará ou esconderá visualmente o elemento na interface do usuário.

  suggestionContainer.classList.add("hide"); // Ocultará ou esconderá visualmente o elemento na interface do usuário.
};

const showWeatherData = async (city) => { //Exibir os dados do clima para uma determinada cidade
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404") { // Usado para verificar se a resposta da API do clima indicou que a cidade especificada não foi encontrada
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name; // Nome da cidade
  tempElement.innerText = parseInt(data.main.temp); // Temperatura da cidade
  descElement.innerText = data.weather[0].description; // Texto da temperatura
  weatherIconElement.setAttribute( // Icone da temperatura
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", apiCountryURL + data.sys.country); // Pegando a foto do pais
  umidityElement.innerText = `${data.main.humidity}%`; // Pegando a humidade
  windElement.innerText = `${data.wind.speed}km/h`; // Pegando a velocidade do vento

  // Change bg image
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`; // Alterar a imagem do background 

  weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => { // Quando clicar no botão de pesquisar, aparecer na tela
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => { // Adicionando pequisar com botão enter do teclado
  if (e.code === "Enter") {
    const city = e.target.value; 

    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) => { // Quando clicar no botão das sugestões de clima, aparecer na tela
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});