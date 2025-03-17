const cityInput = document.getElementById('autocomplete-input');
const weatherSpinner = document.getElementById('weather-spinner');

async function updateBackground(city) {
  try {
    const response = await fetch(`http://localhost:3000/background?city=${city}`);
    const data = await response.json();

    if (data.imageUrl) {
      document.body.style.backgroundImage = `url('${data.imageUrl}')`;
    } else {
      alert('Nu a fost găsită nicio imagine pentru acest oraș.');
    }
  } catch (error) {
    console.error('Eroare la obținerea imaginii de fundal:', error);
    alert('A apărut o eroare la obținerea imaginii de fundal.');
  }
}

async function searchCityBackground(city) {
  weatherSpinner.style.display = 'block';
  try {
    await updateBackground(city); // actualizează doar imaginea de fundal
  } catch (error) {
    console.error('Eroare la actualizarea imaginii de fundal:', error);
    alert('A apărut o eroare la actualizarea imaginii de fundal.');
  } finally {
    weatherSpinner.style.display = 'none';
  }
}

cityInput.addEventListener('change', () => {
  const city = cityInput.value.trim();
  if (city) {
    searchCityBackground(city);
  }
});
