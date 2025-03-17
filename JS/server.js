import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Folosește import pentru node-fetch
import path from 'path';
import fs from 'fs';

// Citirea fișierului JSON folosind fs
const cities = JSON.parse(fs.readFileSync(path.resolve('cities.json'), 'utf-8'));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Cheile API
const OPENWEATHER_API_KEY = '8076575397d12e7549781e95b5f249ea'; // Înlocuiește cu cheia ta API OpenWeather
const PEXELS_API_KEY = 'NVt8oRrZNGpjRtqqi3hMM7j2tjldcOqkl66QsTY0GTRPAxvyniP9Et5i'; // Înlocuiește cu cheia ta API Pexels

// Endpoint pentru autocomplete
app.get('/autocomplete', (req, res) => {
  const query = req.query.q;
  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long' });
  }

  const results = cities.filter(city =>
    city.toLowerCase().startsWith(query.toLowerCase())
  );

  res.json(results.slice(0, 5)); // Returnează primele 5 rezultate
});

// Endpoint pentru vreme și imagine de fundal
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // Obține datele meteo
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    if (!weatherResponse.ok) {
      return res.status(404).json({ error: 'City not found' });
    }

    const weatherData = await weatherResponse.json();
    const weatherDescription = weatherData.weather[0].description;

    // Obține imaginea de fundal din Pexels
    const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=${city} ${weatherDescription}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    const pexelsData = await pexelsResponse.json();
    let imageUrl = null;

    if (pexelsData.photos && pexelsData.photos.length > 0) {
      imageUrl = pexelsData.photos[0].src.original; // Obține URL-ul imaginii
    }

    const responseData = {
      weather: {
        city: weatherData.name,
        country: weatherData.sys.country,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        icon: weatherData.weather[0].icon
      },
      background: imageUrl || 'No image found for this city and weather'
    };

    res.json(responseData); // Returnează atât datele meteo cât și imaginea de fundal
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather or background image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
