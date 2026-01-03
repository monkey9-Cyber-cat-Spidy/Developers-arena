# Week 4 - Weather Application

A responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API. It demonstrates frontend–backend integration concepts using a public REST API, async JavaScript, and localStorage caching.

## Features

- Current weather conditions
- 5-day weather forecast
- City search with autocomplete (HTML datalist)
- Celsius / Fahrenheit unit conversion
- Favorite cities (saved with `localStorage`)
- Basic data caching with `localStorage` (10 min TTL)
- "Use my location" (Geolocation API)
- Responsive layout for mobile, tablet, and desktop
- Error handling and clear loading states
- Time-based light/dark theme (day/night)

## Project Structure

```text
week4-weather-app/
│── index.html
│── css/
│   ├── style.css
│   ├── weather-icons.css
│   └── responsive.css
│── js/
│   ├── app.js
│   ├── weatherService.js
│   ├── ui.js
│   ├── storage.js
│   └── config.js
│── assets/
│   ├── icons/
│   └── images/
│── README.md
│── .env.example
└── .gitignore
```

## Setup Instructions

1. **Get an API key**
   - Go to the OpenWeatherMap website and create a free account.
   - Generate an API key (Current Weather + 5 Day / 3 Hour Forecast is enough).

2. **Configure your key**
   - Open `js/config.js`.
   - Replace `YOUR_API_KEY_HERE` with your actual key:

   ```js
   const OPENWEATHER_API_KEY = 'YOUR_REAL_KEY';
   ```

   > Note: `.env.example` documents the variable name, but for a static site (GitHub Pages) you must still embed the key in `config.js`.

3. **Run the project locally**
   - Option 1: Simply open `index.html` in your browser (double-click or drag into the browser).
   - Option 2 (recommended): Use a simple static server (e.g. VS Code Live Server extension or `npx serve`).

4. **Deploy to GitHub Pages**
   - Commit and push this folder to a GitHub repository.
   - In GitHub, enable **Pages** for the repository and select the main branch and `/ (root)` folder.
   - After deployment finishes, open the GitHub Pages URL.

## How It Works

### API Integration

- The app uses the **OpenWeatherMap REST API**:
  - `GET /data/2.5/weather` – current conditions
  - `GET /data/2.5/forecast` – 5-day / 3-hour forecast
- Requests are made with the **Fetch API** using `async/await`.
- HTTP errors (404, 401, etc.) are converted into human-readable error messages.

### Code Modules

- `js/config.js`
  - Stores the API key, base URL, default city, and cache duration.

- `js/storage.js` (`StorageService`)
  - Wraps `localStorage` for:
    - Last searched city (`weather_last_city`)
    - Favorite cities (`weather_favorites`)
    - Cached API responses (`weather_cache_v1`)

- `js/weatherService.js` (`WeatherService`)
  - Responsible for talking to the API.
  - Supports:
    - `getCurrentWeatherByCity(city)`
    - `getForecastByCity(city)`
    - `getCurrentWeatherByCoords(lat, lon)`
    - `getForecastByCoords(lat, lon)`
  - Caches each response with a timestamp.
  - Reuses cached data if it is younger than the configured TTL (10 minutes), using both in-memory `Map` and `localStorage`.

- `js/ui.js` (`WeatherUI`)
  - Handles all DOM updates:
    - Shows loading and error states
    - Renders current weather card
    - Renders 5-day forecast cards
    - Toggles °C / °F and converts temperatures
    - Switches between day/night themes based on sunrise/sunset times
    - Renders favorite city chips and wires click handlers

- `js/app.js`
  - "Glue" module that wires everything together.
  - Listens for:
    - Search form submit
    - "Use my location" button
    - Unit toggle
    - Add to favorites
    - Favorite city clicks
  - Keeps the current weather and forecast in memory and re-renders the UI on unit changes without new API calls.

### Data Flow

1. User searches for a city or clicks a favorite.
2. `app.js` asks `WeatherService` for current + forecast data.
3. `WeatherService` checks cache, hits the API if necessary, and returns JSON.
4. `app.js` stores the results in memory and tells `WeatherUI` to render.
5. `WeatherUI` converts temperatures according to the selected unit and updates the DOM.
6. `StorageService` persists last city, favorites, and the cache.

## Sample Test Cases

You can manually test the app with these scenarios:

1. **Valid city search**
   - Input: `New York`
   - Expect: Current weather card + 5 forecast cards, last updated timestamp.

2. **Invalid city search**
   - Input: `Xyzabc`
   - Expect: Friendly error message: "City not found...".

3. **Unit conversion**
   - Search a city, then click **Switch to °F**.
   - Expect: All displayed temperatures change to Fahrenheit without a new API call.

4. **Favorites**
   - Search a city (e.g., `London`), click **★ Add current city**.
   - Reload the page.
   - Expect: `London` chip appears under Favorite Cities and is clickable.

5. **Use my location**
   - Click **Use my location** and allow permission.
   - Expect: Weather data for your approximate location.

6. **Caching behavior**
   - Search a city, then refresh quickly and search again.
   - Expect: Second load is faster and uses cached data (still goes through the same UI flow).

## Component Architecture (High-Level)

- **App shell**: `index.html`, `style.css`, `responsive.css`
- **Data layer**: `WeatherService` + `StorageService`
- **Presentation layer**: `WeatherUI`
- **Controller**: `app.js` (wires events and orchestrates data flow)

This structure keeps the project small but organized, and mirrors patterns used in larger frontend applications.
