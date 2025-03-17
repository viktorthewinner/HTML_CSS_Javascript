const input = document.getElementById('autocomplete-input');
const resultsContainer = document.getElementById('autocomplete-results');
const favoriteCitiesList = document.getElementById('favorite-cities-list');

input.addEventListener('input', async (event) => {
  const query = event.target.value;

  if (query.length < 3) {
    resultsContainer.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/autocomplete?q=${query}`);

    if (!response.ok) {
      throw new Error('Eroare la obținerea datelor autocomplete');
    }

    const cities = await response.json();

    resultsContainer.innerHTML = cities.map(city => `
      <div class="autocomplete-item" onclick="selectCity('${city}')">${city}
        <button onclick="saveToFavorites('${city}')">❤️</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Eroare:', error);
  }
});

function selectCity(city) {
  input.value = city;
  resultsContainer.innerHTML = '';
  onCitySelected(city);
}

function saveToFavorites(city) {
  const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];

  if (!favoriteCities.includes(city)) {
    favoriteCities.push(city);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }

  displayFavoriteCities();
}

function displayFavoriteCities() {
  const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
  favoriteCitiesList.innerHTML = '';

  favoriteCities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;

    listItem.addEventListener('click', () => {
      onCitySelected(city);
    });

    const heartButton = document.createElement('button');
    heartButton.textContent = '❤️';
    heartButton.addEventListener('click', () => {
      saveToFavorites(city);
    });

    listItem.appendChild(heartButton);
    favoriteCitiesList.appendChild(listItem);
  });
}

displayFavoriteCities();

async function onCitySelected(city) {
}


///apasand pe orasul din lista de favorite, afiseaza vremea orasului